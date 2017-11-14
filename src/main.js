// let data = {};
const ticker = document.getElementById("ticker");
const bitcoin = document.getElementById("BTC");
const dash = document.getElementById("DASH");
const ethereum = document.getElementById("ETH");
const litecoin = document.getElementById("LTC");
const monero = document.getElementById("ZMR");
const zcash = document.getElementById("ZEC");

document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
  window.setInterval(refreshQuotes, 10000);
  attachListeners();
});

function fetchQuotes() {
  const PATH = "https://min-api.cryptocompare.com";
  const ROUTE = "/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,XMR,LTC&tsyms=USD";
  fetch(`${PATH}${ROUTE}`)
    .then(res => res.json())
    .then(json => setPrices(json));
}

function fetchUser() {
  // get the user data from herokuapp
  // make a new User object
  fetch("https://crypto-kahuna-api.herokuapp.com/users")
    .then(res => res.json())
    .then(console.log(json));
}

function refreshQuotes() {
  // call fetchQuotes every 10 sec
  // call function that updates the time
  fetchQuotes();
  let date = new Date().toLocaleString("en-US");
  document.getElementById("last-updated").innerHTML = `
    <strong>Last updated</strong> ${date}
  `;
}

function setPrices(data) {
  console.log(data);
  let valueBTC = parseFloat(data.BTC.USD).toFixed(2);
  let valueDASH = parseFloat(data.DASH.USD).toFixed(2);
  let valueETH = parseFloat(data.ETH.USD).toFixed(2);
  let valueLTC = parseFloat(data.LTC.USD).toFixed(2);
  let valueXMR = parseFloat(data.XMR.USD).toFixed(2);
  let valueZEC = parseFloat(data.ZEC.USD).toFixed(2);

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

function attachListeners() {
  // attach a click event to the buy button for each child of ticker
  // .querySelector(".buy")

  let buttons = ticker.getElementsByClassName("button");
  [...buttons].forEach(button => {
    button.addEventListener("click", e => {
      let currency = e.target.parentElement.id;
      let value = e.target.parentElement.querySelector("#value").innerText;
      openBuy(currency, value);
    });
  });
}

function openBuy(currency, value) {
  // add an event listener to the div
  // render Buy
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

  //add an event listener to the input. OnChange it runs calcTotalBuys
  document.getElementById("buy-sell").addEventListener("input", e => {
    let amountShares = e.target.value;
    let total = calcTotalBuy(value, amountShares);

    if (total) {
      document.getElementById("total-buy").innerHTML = `
        Total: <strong>$${total}</strong>
      `;
      document.getElementById("confirm-buy").innerHTML = `
        CONFIRM PURCHASE
      `;
    } else {
      document.getElementById("confirm-buy").innerHTML = `
        INVALID FUNDS
      `;
    }
  });

  // append an alert if the purchase is invalid
}

function calcTotalBuy(value, amount) {
  let cash = 3000; // dummy variable
  amount = parseFloat(amount);
  value = parseFloat(value);
  let total = parseFloat(amount * value).toFixed(2);
  let funds = parseFloat(cash - total).toFixed(2);
  if (funds >= 0 && total > 0) {
    return total;
  } else {
    return false;
  }

  // debugger;
}
