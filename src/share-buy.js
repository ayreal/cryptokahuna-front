// attaches a click event listener to the ticker div
// click event triggers openBuy for each currency
function tickerListener() {
  ticker.addEventListener("click", e => {
    // listens for clicks on the entire ticker div
    if (e.target.tagName === "A") {
      // checks to see if those clicks are on a BUY button
      let currency = e.target.parentElement.id;
      let value = e.target.parentElement.querySelector("#value").innerText;
      openBuy(currency, value);
    }
  });
}

// renders the buy form and listens for inputs and clicks
function openBuy(currency, value) {
  // renders the buy form

  // value targets the ticker element (.blink class) with its currency name and updates accordingly

  document.getElementById("buy-sell").innerHTML = `
  <div class="level-item has-text-centered">
   <article class="tile is-child notification is-info">
     <h2 class="title">Buy Shares</h2>
     <p id="live-value">${currency} @ <strong>$${value}</strong></p>
     <div class="field">
     <div class="control">
       <input class="input is-medium" id="buy-shares" type="number" min="0" placeholder="0">
     </div>
   </div>
   <h3 class="title" id="total-buy">Total: <strong>$0</strong></h3>
   <a class="button is-medium is-warning" id="confirm-buy">CONFIRM PURCHASE</a>
   </article>
  </div>
  `;

  // adds an event listener to the shares input. OnChange it runs calcTotalBuys
  document.getElementById("buy-sell").addEventListener("input", e => {
    console.log("buy-sell listener");
    let amountShares = e.target.value; // number of shares entered
    let total = calcTotalBuy(value, amountShares); // total cost (if affordable)
    let confirmBuyButton = document.getElementById("confirm-buy");

    // total is true if user can afford the transaction
    total
      ? displayTotal(confirmBuyButton, total)
      : removeTotal(confirmBuyButton);
    e.stopPropagation(); // prevents duplicate event listeners
  });
}

function getLiveValue() {
  let currency = document
    .querySelector("#buy-sell > div > article > p")
    .innerText.split("$")[0]
    .slice(0, -3);

  let value = [...document.getElementsByClassName("blink")].find(e => {
    return e.parentElement.id === currency;
  });

  document.getElementById("live-value").innerHTML = `
  ${currency} @ <strong>$${value.innerText}</strong>
  `;
}

function displayTotal(confirmBuyButton, total) {
  document.getElementById("total-buy").innerHTML = `
        Total: <strong>$${total}</strong>
      `;
  confirmBuyButton.innerHTML = `
        CONFIRM PURCHASE
      `;
  confirmBuyButton.addEventListener("click", e => {
    const total = parseFloat(
      document.querySelector("#total-buy > strong").innerText.slice(1)
    ); // stores total purchase cost
    e.stopImmediatePropagation(); // prevents duplicate event listeners
    let buttonText = document.querySelector("a#confirm-buy").innerText;
    const shareNum = document.querySelector("#buy-shares").value;
    const currency = document
      .querySelector("#buy-sell > div > article > p")
      .innerText.split("$")[0]
      .slice(0, -3);
    buttonText === "CONFIRM PURCHASE"
      ? completePurchase(total, shareNum, currency)
      : console.log("no buy");
  });
}

function completePurchase(total, shares, currency) {
  updateUserCash(total, "buy"); // subtract total from user cash (fetch post to user)
  buyShares(shares, currency); // add the purchase to the portfolio's holdings (fetch post to holdings)
  // replace buy box with "purchase complete"
}

function updateUserCash(amount, action) {
  let cash;
  if (action === "buy") {
    cash = user.cash - amount;
  } else {
    cash = user.cash + amount;
  }
  fetch(`https://crypto-kahuna-api.herokuapp.com/api/v1/users/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      cash: cash
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const cashDisplay = document.querySelector("#liquid-assets > h1");
  cashDisplay.innerText = `$${parseFloat(cash).toFixed(2)}`;
}

function buyShares(shares, currency) {
  if (portfolio.getHoldingsForCurrency(currency)) {
    // checks to see if the portfolio already has this currency
    console.log("already have it");
    const holdingId = portfolio.getHoldingIdForCurrency(currency);
    // debugger;
    buyHoldingsFetch(holdingId, shares, currency, "buy");
    // renderUpdgitaateHolding(shares, currency)
  } else {
    console.log("don't have it");
    buyHoldingsFetch(0, shares, currency, "buy");
  }
  //op
}

//// make abstract so it works for buys AND sells
function buyHoldingsFetch(id, shares, currency, action) {
  let url = "https://crypto-kahuna-api.herokuapp.com/api/v1/holdings/";
  let method;
  let postData;
  if (id !== 0) {
    shares = portfolio.getHoldingsForCurrency(currency) + parseFloat(shares);
    url += id;
    method = "PATCH";
    postData = { shares: shares };
  } else {
    method = "POST";
    postData = {
      currency: currency,
      portfolio_id: portfolio.id,
      shares: shares
    };
  }
  fetch(url, {
    method: method,
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(fetchPortfolio());
}

function removeTotal(confirmBuyButton) {
  document.getElementById("total-buy").innerHTML = `
    Total: <strong>$0</strong>
  `;
  confirmBuyButton.innerHTML = `
    INVALID FUNDS
  `;
}

// calculates purchase total and determines if user can afford the transaction
function calcTotalBuy(value, amount) {
  let cash = portfolio.cash;
  value = parseFloat(value); // cost per share
  amount = parseFloat(amount); // number of shares enetered
  let total = parseFloat(amount * value).toFixed(2); // total cost (value * amount)
  let remainingFunds = parseFloat(cash - total).toFixed(2); // remaining funds
  // only returns total if user can afford the transaction
  if (remainingFunds > 0 && total > 0) {
    return total;
  } else {
    return false;
  }
}

function renderUpdateHolding(shares, currency) {
  shares = parseFloat(shares);
  let el = document.querySelector(`#holding-${currency} > td:nth-child(3)`);
  let newShares = parseFloat(el.innerText) + shares;
  el.innerText = newShares;
}
