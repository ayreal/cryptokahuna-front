let userId = 1; // make dynamic
const portfolioId = 1; //// make dynamic
let user;
let portfolio; // what happens when we have a user?
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
  refreshQuotes(); // refreshes quotes right away before first interval is hit
  fetchUser();
  fetchPortfolio();
  window.setInterval(pageRefresh, 10000); // polling timer default is 10000
  tickerListener();
});

// fetches portfolio data from backend api
function fetchPortfolio() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/portfolios/";
  fetch(`${PATH}${portfolioId}`)
    .then(resp => resp.json())
    .then(json => makePortfolio(json));
}

function makePortfolio(data) {
  portfolio = new Portfolio(data);
  // make this find or create by
  portfolio.renderLiquidAssets();
  portfolio.renderPortfolioDiv();
}

function fetchUser() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/users/";
  fetch(`${PATH}${userId}`)
    .then(resp => resp.json())
    .then(json => {
      user = json;
    });
}

function pageRefresh() {
  refreshQuotes();
  portfolio.renderPortfolioDiv();
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

// fetches latest quotes from cryptocompare api
function fetchQuotes() {
  const PATH = "https://min-api.cryptocompare.com";
  const ROUTE = "/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,XMR,LTC&tsyms=USD";
  fetch(`${PATH}${ROUTE}`)
    .then(res => res.json())
    .then(json => setPrices(json));
}

// updates ticker prices with latest data from fetchQuotes
function setPrices(data) {
  // console.log(data);
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

function flashUpdates() {
  $(".blink").change(function() {
    $(".blink")
      .fadeToggle(150)
      .fadeToggle(200);
  });
}
