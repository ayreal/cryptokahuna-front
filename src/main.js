// let data = {};
const ticker = document.getElementById("ticker");
const bitcoin = document.getElementById("bitcoin");
const dash = document.getElementById("dash");
const ethereum = document.getElementById("ethereum");
const litecoin = document.getElementById("litecoin");
const monero = document.getElementById("monero");
const zcash = document.getElementById("zcash");

document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
  window.setInterval(refreshQuotes, 60000);
  attachListeners();
});

function fetchQuotes() {
  const PATH = "https://min-api.cryptocompare.com";
  const ROUTE = "/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,XMR,LTC&tsyms=USD";
  fetch(`${PATH}${ROUTE}`)
    .then(res => res.json())
    .then(json => setPrices(json));
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
  debugger;
}
