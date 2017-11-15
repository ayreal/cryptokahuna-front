const userId = 1;
let user = {};
const ticker = document.getElementById("ticker");
const bitcoin = document.getElementById("BTC");
const dash = document.getElementById("DASH");
const ethereum = document.getElementById("ETH");
const litecoin = document.getElementById("LTC");
const monero = document.getElementById("ZMR");
const zcash = document.getElementById("ZEC");
const portfolioValue = document.getElementById("portfolio-value");
const liquidAssets = document.getElementById("liquid-assets");

document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes(); // fetches quotes right away before first interval is hit
  //// should we call refreshQuotes() here instead so the last-updated text gets input right away?
  fetchUser();
  window.setInterval(refreshQuotes, 60000); // polling timer default is 10000
  //// set back to 10000 for more frequent updates
  attachListeners();
});

// fetches latest quotes from cryptocompare api
function fetchQuotes() {
  const PATH = "https://min-api.cryptocompare.com";
  const ROUTE = "/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,XMR,LTC&tsyms=USD";
  fetch(`${PATH}${ROUTE}`)
    .then(res => res.json())
    .then(json => setPrices(json));
}

// fetches user data from backend api
//// update this so user can be changed
function fetchUser() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/users/";
  fetch(`${PATH}${userId}`)
    .then(resp => resp.json())
    .then(json => (user = json));
}

// calls fetchQuotes and updates "Last updated" with the current datetime
function refreshQuotes() {
  // call fetchQuotes every 10 sec
  // call function that updates the time
  fetchQuotes();
  let date = new Date().toLocaleString("en-US");
  document.getElementById("last-updated").innerHTML = `
    <strong>Last updated</strong> ${date}
  `;
}

// updates ticker prices with latest data from fetchQuotes
function setPrices(data) {
  console.log(data);
  let valueBTC = parseFloat(data.BTC.USD).toFixed(2);
  let valueDASH = parseFloat(data.DASH.USD).toFixed(2);
  let valueETH = parseFloat(data.ETH.USD).toFixed(2);
  let valueLTC = parseFloat(data.LTC.USD).toFixed(2);
  let valueXMR = parseFloat(data.XMR.USD).toFixed(2);
  let valueZEC = parseFloat(data.ZEC.USD).toFixed(2);

  //// can we refactor these into one function?
  bitcoin.querySelector("#value").innerHTML = `
    <strong>${valueBTC}</strong>
  `;

  dash.querySelector("#value").innerHTML = `
    <strong>${valueDASH}</strong>
  `;

  ethereum.querySelector("#value").innerHTML = `
    <strong>${valueETH}</strong>
  `;

  litecoin.querySelector("#value").innerHTML = `
    <strong>${valueLTC}</strong>
  `;

  monero.querySelector("#value").innerHTML = `
    <strong>${valueXMR}</strong>
  `;

  zcash.querySelector("#value").innerHTML = `
    <strong>${valueZEC}</strong>
  `;
}

// attaches a click event listener to the buy button for each child of ticker
// click event triggers openBuy for that currency
function attachListeners() {
  // .querySelector(".buy") //// is this line needed?

  let buttons = ticker.getElementsByClassName("button");
  [...buttons].forEach(button => {
    button.addEventListener("click", e => {
      let currency = e.target.parentElement.id;
      let value = e.target.parentElement.querySelector("#value").innerText;
      openBuy(currency, value);
    });
  });
}

// renders the buy form and listens for inputs and clicks
//// refactor this!!!!!!
function openBuy(currency, value) {
  // add an event listener to the div //// is this a function description or pending change?
  
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
    let amountShares = e.target.value; // number of shares entered
    let total = calcTotalBuy(value, amountShares); // total cost (if affordable)
    let confirmBuyButton = document.getElementById("confirm-buy");

    // total is true if user can afford the transaction
    if (total) {
      document.getElementById("total-buy").innerHTML = `
        Total: <strong>$${total}</strong>
      `;
      confirmBuyButton.innerHTML = `
        CONFIRM PURCHASE
      `;
      confirmBuyButton.addEventListener("click", () => {
        console.log("BUY");
      });
      //// submit a post request to our API here
      //// fetch down User data again
      //// optimistically render User value changes
    } else {
      document.getElementById("total-buy").innerHTML = `

      `;
      confirmBuyButton.innerHTML = `
        INVALID FUNDS
      `;
    }
  });
}

// calculates purchase total and determines if user can afford the transaction
function calcTotalBuy(value, amount) {
  let cash = 3000; // dummy variable //// change to reflect user's cash
  value = parseFloat(value); // cost per share
  amount = parseFloat(amount); // number of shares enetered
  let total = parseFloat(amount * value).toFixed(2); // total cost (value * amount)
  let funds = parseFloat(cash - total).toFixed(2); // remaining funds
  // only returns total if user can afford the transaction
  if (funds > 0 && total > 0) {
    return total;
  } else {
    return false;
  }
}
