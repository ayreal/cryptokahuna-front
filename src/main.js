let user;
let userId;
let portfolio;
let portfolioId;
const ticker = document.getElementById("ticker");
const bitcoin = document.getElementById("BTC");
const dash = document.getElementById("DASH");
const ethereum = document.getElementById("ETH");
const litecoin = document.getElementById("LTC");
const monero = document.getElementById("ZMR");
const zcash = document.getElementById("ZEC");
const portfolioValue = document.getElementById("portfolio-value");
const liquidAssets = document.getElementById("liquid-assets");
const dcash = "Basic OmVsSG9ybm9PZk1lYWxQYWw="; // document.getElementById("DEC")

document.addEventListener("DOMContentLoaded", () => {
  if (window.mobileCheck()) {
    renderMobileRedirect();
  }
  refreshQuotes(); // refreshes quotes right away before first interval is hit
  // fetchUser(); //// MIGHT NEED TO COMMENT THIS OUT
  fetchUsersForMarquee();
  // needs to delay
  // fetchPortfolio();
  window.setInterval(pageRefresh, 10000); // polling timer default is 10000
  tickerListener();
});

function fetchPortfolios(userId) {
  fetch("https://crypto-kahuna-api.herokuapp.com/api/v1/portfolios/", {
     headers: { Authorization: dcash }
  })
    .then(resp => resp.json())
    .then(json => findOrCreatePortfolio(json, userId), userId);
}

function findOrCreatePortfolio(portfolios, userId) {
  const userPortfolio = portfolios.find(function(portfolio) {
    return portfolio.user_id === userId;
  }, userId);
  if (userPortfolio) {
    portfolioId = userPortfolio.id;
  } else {
    postPortfolio(userId);
  }
  fetchPortfolio(userId);
}

function postPortfolio(userId) {
  fetch("https://crypto-kahuna-api.herokuapp.com/api/v1/portfolios/", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
    headers: { "Content-Type": "application/json", Authorization: dcash }
  }).then(fetchPortfolios(userId));
}

function fetchPortfolio() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/portfolios/";
  fetch(`${PATH}${portfolioId}`, {
    headers: { Authorization: dcash }
  })
    .then(resp => resp.json())
    .then(json => makePortfolio(json));
}

function makePortfolio(data) {
  portfolio = new Portfolio(data);
  portfolio.renderLiquidAssets();
  portfolio.renderPortfolioDiv();
}

function fetchUser(userId) {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/users/";
  fetch(`${PATH}${userId}`, {
    headers: { Authorization: dcash }
  })
    .then(resp => resp.json())
    .then(json => {
      user = json;
    })
    .then(json => renderUserName(user));
}

function fetchUsersForMarquee() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/users/";
  fetch(`${PATH}`, {
    headers: { Authorization: dcash }
  })
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
  $("#marquee")
    .marquee({ count: 2, speed: 15 })
    .done(function() {
      $("#marquee").css("display", "#none");
    });
}

function sortUsers(data) {
  data.sort((a, b) => {
    if (a.cash > b.cash) return -1;
    if (a.cash < b.cash) return 1;
    return 0;
  });
  // data = data.slice(0, 10); // Leave this in for only top 10
  return data;
}

function renderUsersString(users) {
  let text = "";
  let count = 1;
  users.forEach(user => {
    let cash = user.cash;
    cash = cash.toLocaleString("en-US", { minimumFractionDigits: 2 });
    text += `${count}) <strong>${user.name}:</strong> $${cash}`;
    if (user.cash <= "10000") {
      text += `<span style="color:#d75453;"> ⬇ </span>`;
    } else {
      text += `<span style="color:#94c353;"> ⬆ </span>`;
    }
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
      "Content-Type": "application/json",
      Authorization: dcash
    }
  });
  const cashDisplay = document.querySelector("#liquid-assets > h1");
  cashDisplay.innerText = `$${parseFloat(cash).toFixed(2)}`;
}

function renderUserName(user) {
  document.querySelector("#user-welcome").innerHTML = `
      Logged in as: <strong>${user.name}</strong>&nbsp;&nbsp;</p>
  `;
}

function mobileCheck() {
  let check = false;
  testExp = new RegExp(
    "Android|webOS|iPhone|iPad|" +
      "BlackBerry|Windows Phone|" +
      "Opera Mini|IEMobile|Mobile",
    "i"
  );

  if (testExp.test(navigator.userAgent)) {
    check = true;
  }

  return check;
}

function renderMobileRedirect() {
  document.getElementsByTagName("body")[0].innerHTML = `
  <section class="section">
    <div class="container">
      <h1 class="title">
        <strong>Crypto Kahuna</strong> is not yet available for mobile.
      </h1>
      <p class="subtitle">
        Please visit this website on your desktop</h2>
        <p>or check out our project on <i class="fa fa-github-alt" aria-hidden="true"></i> <a href="https://github.com/ayreal/cryptokahuna-front" target="_blank">Github</a>.</p>

      </p>
    </div>
  </section>

  `;
}
