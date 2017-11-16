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
  fetchUsers();
  // needs to delay
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

function fetchUsers() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/users/";
  fetch(`${PATH}`)
    .then(resp => resp.json())
    .then(json => {
      marquee(json);
    });
}

function pageRefresh() {
  refreshQuotes();
  // setTimeout(portfolio.renderPortfolioDiv(), 300);
  portfolio.renderPortfolioDiv();
}

// calls fetchQuotes and updates "Last updated" with the current datetime
function refreshQuotes() {
  // call fetchQuotes every 10 sec
  // call function that updates the time
  flashUpdates();
  fetchQuotes();
  // refresh currency if the buy/sell widget is loaded
  if (document.getElementById("buy-sell").innerText) {
    getLiveValue();
  }
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
  $(".blink")
    .fadeToggle(150)
    .fadeToggle(200);
}

// the ticker at the top of the page
function marquee(data) {
  const users = sortUsers(data); // this returns a sorted hash
  const marqueeString = `<strong>Today's Kahunas</strong> ${renderUsersString(
    users
  )}`; // makes a string of text for the marquee
  document.getElementById("marquee").innerHTML = marqueeString;
  $("#marquee").marquee({ speed: 15 });
}

function sortUsers(data) {
  data.sort((a, b) => {
    if (a.cash > b.cash) return -1;
    if (a.cash < b.cash) return 1;
    return 0;
  });
  return data;
}

function renderUsersString(users) {
  let text = "";
  let count = 1;
  users.forEach(user => {
    text += `${count}) <strong>${user.name}:</strong> ${user.cash}   `;
    count++;
  });
  return text;
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
