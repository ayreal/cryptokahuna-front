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
      handleSellInput(currency, value, sharesToSell);
    } else {
      document.querySelector(
        "#buy-sell > div > article > div > div > input"
      ).value =
        "";
    }
  });

  // adds listener to CONFIRM SALE button and processes transaction
  //// THIS SHOULD ONLY TRIGGER ON VALID SALES
  document.querySelector("a#confirm-sell").addEventListener("click", e => {
    // submit a patch request
    console.log("selling")
    let id = portfolio.getHoldingIdForCurrency(currency);
    // buyHoldingsFetch(id, sharesToSell, currency, "sell");
  });
}

// opens the sell widget
function renderSell(currency, value, shares) {
  return `


  <div class="level-item has-text-centered">
   <article class="tile is-child notification is-info">
     <h2 class="title">Sell Shares</h2>
     <p>${currency} @ <strong>$${value}</strong></p>
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
function handleSellInput(currency, value, sharesToSell) {
  // calls on a function that multiplies sharesToSell by value
  let total = parseFloat(value * sharesToSell).toFixed(2);
  // renders the return of that function on the page
  document.getElementsByClassName("total-sale")[0].innerHTML = `
    Sale Value: <strong>$${total}</strong>
  `;
}
