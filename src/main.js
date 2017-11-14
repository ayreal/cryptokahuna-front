let data;

document.addEventListener("DOMContentLoaded", () => {
  refreshQuotes();
});

function fetchQuotes() {
  const PATH = "https://min-api.cryptocompare.com";
  const ROUTE = "/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,XMR,LTC&tsyms=USD";
  fetch(`${PATH}${ROUTE}`)
    .then(res => res.json())
    .then(json => (data = json));
}

function refreshQuotes() {
  // call fetchQuotes every 10 sec
}
