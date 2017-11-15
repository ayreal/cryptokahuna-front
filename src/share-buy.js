// attaches a click event listener to the ticker div
// click event triggers openBuy for each currency
function tickerListener() {
    ticker.addEventListener("click", e => { // listens for clicks on the entire ticker div
        if (e.target.tagName === "A") { // checks to see if those clicks are on a BUY button
            let currency = e.target.parentElement.id;
            let value = e.target.parentElement.querySelector("#value").innerText;
            openBuy(currency, value);
        }
    });
}

// renders the buy form and listens for inputs and clicks
function openBuy(currency, value) {
  // renders the buy form
  document.getElementById("buy-sell").innerHTML = `
  <div class="level-item has-text-centered">
   <article class="tile is-child notification is-info">
     <h2 class="title">Buy Shares</h2>
     <p>${currency} @ <strong>$${value}</strong></p>
     <div class="field">
     <div class="control">
       <input class="input is-medium" id="buy-shares" type="number" placeholder="0">
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
    total ? displayTotal(confirmBuyButton, total) : removeTotal(confirmBuyButton);
    e.stopPropagation(); // prevents duplicate event listeners
  });
}

function displayTotal(confirmBuyButton, total) {
  document.getElementById("total-buy").innerHTML = `
        Total: <strong>$${total}</strong>
      `;
  confirmBuyButton.innerHTML = `
        CONFIRM PURCHASE
      `;
  confirmBuyButton.addEventListener("click", e => {
    e.stopImmediatePropagation(); // prevents duplicate event listeners
    let buttonText = document.querySelector("a#confirm-buy").innerText;
    buttonText === "CONFIRM PURCHASE" ? console.log("buy") : console.log("no buy");
  });
}

function removeTotal(confirmBuyButton) {
  document.getElementById("total-buy").innerHTML = `

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