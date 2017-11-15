document.getElementById("portfolio").addEventListener("click", e => {
  if (e.target.tagName === "A") {
    let currency = e.target.dataset.currency;
    openSell(currency);
  }
});

function openSell(currency) {
  let value = document.getElementById(currency).querySelector("#value")
    .innerText;
  //calls on a global portfolio obj
  let currentShares = portfolio.getHoldingsForCurrency(currency);
  document.getElementById("buy-sell").innerHTML = renderSell(
    currency,
    value,
    currentShares
  );

  document.getElementById("buy-sell").addEventListener("input", e => {
    let sharesToSell = e.target.value;
    e.stopImmediatePropagation(); // prevents duplicate event listeners

    while (sharesToSell <= currentShares) {
      handleSellInput(currency, value, sharesToSell);
    }
  });
}

function renderSell(currency, value, shares) {
  let total = parseFloat(value * shares).toFixed(2);
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
   <h3 class="title">Total: <strong>$${total}</strong></h3>
   <a class="button is-medium is-warning">CONFIRM SALE</a>
   </article>
  </div>

  `;
}

function handleSellInput(currency, value, sharesToSell) {
  console.log("handling input");
  // calls on a function that multiplies sharesToSell by value (and validates)
  // renders the return of that function if true
}
