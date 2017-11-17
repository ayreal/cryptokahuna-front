// adds listener to portfolio table and listens for a click on SELL buttons
document.getElementById("portfolio").addEventListener("click", e => {
  if (e.target.tagName === "A") {
    let currency = e.target.dataset.currency;
    openSell(currency);
  }
});

// calls renderSell() and passes in necessary variables
function openSell(currency) {
  let value = document.getElementById(currency).querySelector("#value")
    .innerText;
  let currentShares = portfolio.getHoldingsForCurrency(currency);
  document.getElementById("buy-sell").innerHTML = renderSell(
    currency,
    value,
    currentShares
  );

  // adds listener to the sell widget
  //// refactor this out of openSell()
  document.getElementById("buy-sell").addEventListener("input", e => {
    let sharesToSell = e.target.value;
    // checks if user entered a valid number of shares
    if (sharesToSell <= currentShares && sharesToSell > 0) {
      renderSaleTotal(currency, value, sharesToSell);
    } else {
      document.querySelector(
        "#buy-sell > div > article > div > div > input"
      ).value =
        "";
    }
  });

  // adds listener to CONFIRM SALE button and processes transaction
  //// does it matter that a user can "sell" 0 shares?
  document.querySelector("a#confirm-sell").addEventListener("click", e => {
    const id = portfolio.getHoldingIdForCurrency(currency);
    const sharesToSell = parseFloat(
      document.querySelector("#buy-sell > div > article > div > div > input")
        .value
    );
    let newShares = currentShares - sharesToSell;
    let amount = parseFloat(
      document
        .querySelector("#buy-sell > div > article > h3 > strong")
        .innerText.slice(1)
    );
    updateUserCash(amount, "sell");
    sellHoldingsFetch(id, newShares);
    portfolio.renderTransactionComplete();
  });
}

// opens the sell widget
function renderSell(currency, value, shares) {
  return `


  <div class="level-item has-text-centered">
   <article class="tile is-child notification is-info">
     <h2 class="title">Sell Shares</h2>
     <p id="live-value">${currency} @ <strong>$${value}</strong></p>
     <div class="field">
     <div class="control">
       <input class="input is-medium" type="number" min="0" max="${shares}" placeholder="0">
     </div>
   </div>
   <h3 class="title total-sale">Sale Value: <strong>$0</strong></h3>
   <a class="button is-medium is-warning" id="confirm-sell">CONFIRM SALE</a>
   </article>
  </div>

  `;
}

// updates "Sale Value" amount with total
function renderSaleTotal(currency, value, sharesToSell) {
  value = [...document.getElementsByClassName("blink")].find(e => {
    return e.parentElement.id === currency;
  });
  value = value.innerText;
  // calls on a function that multiplies sharesToSell by value
  let total = parseFloat(value * sharesToSell).toFixed(2);
  // renders the return of that function on the page
  document.getElementsByClassName("total-sale")[0].innerHTML = `
    Sale Value: <strong>$${total}</strong>
  `;
}

// removes shares from api
function sellHoldingsFetch(id, newShares) {
  const url = `https://crypto-kahuna-api.herokuapp.com/api/v1/holdings/${id}`;
  let method;
  let body;
  let headers;
  if (newShares > 0) {
    method = "PATCH";
    body = JSON.stringify({ shares: newShares });
    headers = { "Content-Type": "application/json", Authorization: dcash };
    // deletes the holding if selling all shares
  } else {
    method = "DELETE";
    headers = { Authorization: dcash };
  }
  fetch(url, {
    method: method,
    body: body,
    headers: headers
  }).then(res => fetchPortfolio());
}
