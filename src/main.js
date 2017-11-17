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

document.addEventListener("DOMContentLoaded", () => {
  if (window.mobileCheck()) {
    renderMobileRedirect();
  }
  refreshQuotes(); // refreshes quotes right away before first interval is hit
  fetchUser(); //// MIGHT NEED TO COMMENT THIS OUT
  fetchUsers();
  // needs to delay
  // fetchPortfolio();
  window.setInterval(pageRefresh, 10000); // polling timer default is 10000
  tickerListener();
});

function fetchPortfolios(userId) {
  fetch("https://crypto-kahuna-api.herokuapp.com/api/v1/portfolios/")
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
    headers: { "Content-Type": "application/json" }
  });
}

function fetchPortfolio() {
  const PATH = "https://crypto-kahuna-api.herokuapp.com/api/v1/portfolios/";
  fetch(`${PATH}${portfolioId}`)
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
  fetch(`${PATH}${userId}`)
    .then(resp => resp.json())
    .then(json => {
      user = json;
    })
    .then(json => renderUserName(user));
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
  $("#marquee").marquee({ count: 2, speed: 15 });
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
    if (cash[0] === "-") {
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
      "Content-Type": "application/json"
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
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

function renderMobileRedirect() {
  window.setTimeout('window.open("mobile-redirect.html","newsite")',1000);
  `;
}
