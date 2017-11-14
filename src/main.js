let data = {};
let ticker = document.getElementById("ticker");
let bitcoin = document.getElementById("bitcoin").querySelector("value");

document.addEventListener("DOMContentLoaded", () => {
  // refreshQuotes();
  fetchQuotes();
  window.setInterval(refreshQuotes, 10000); // change this interval later
});

function fetchQuotes() {
  console.log("fetchQuotes is starting");
  const PATH = "https://min-api.cryptocompare.com";
  const ROUTE = "/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,XMR,LTC&tsyms=USD";
  fetch(`${PATH}${ROUTE}`)
    .then(res => res.json())
    .then(json => (data = json));
  console.log("fetchQuotes is ending");
}

function refreshQuotes() {
  // call fetchQuotes every 10 sec
  // call function that updates the time
  console.log("refreshQuotes is starting");

  fetchQuotes();
  console.log(data);
  let date = new Date().toLocaleString("en-US");
  document.getElementById("last-updated").innerHTML = `
    <strong>Last updated</strong> ${date}
  `;
  console.log("refreshQuotes is ending");
}

// function setPrices() {
//   bitcoin.innerHTML = `
//     <strong>$${data.BTC.USD}</strong>
//   `;
// }
