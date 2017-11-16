class Portfolio {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.userName = data.user.name;
    this.cash = data.user.cash;
    this.holdings = data.holdings.sort((a, b) => {
      if (a.currency < b.currency) return -1;
      if (a.currency > b.currency) return 1;
      return 0;
    }); // an array, alphebetized
  }

  // updates cash display

  sortHoldings(a, b) {
    if (a.currency < b.currency) return -1;
    if (a.currency > b.currency) return 1;
    return 0;
  }

  renderLiquidAssets() {
    liquidAssets.innerHTML = `
    <h2 class="subtitle">Current Liquid Assets</h2>
    <h1 class="title is-1">$${portfolio.cash.toLocaleString("en-US", {
      minimumFractionDigits: 2
    })}</h1>
    `;
  }

  // updates portfolio value
  renderPortfolioValue(value) {
    portfolioValue.innerHTML = `
    <h2 class="subtitle">Current Portfolio Value</h2>
    <h1 class="title is-1">$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2
    })}</h1>
    `;
  }

  renderPortfolioDiv() {
    // call a fn that generates the innerHTML for the portfolioDIV
    document.getElementById("portfolio").innerHTML = this.renderHoldings();
  }

  renderHoldings() {
    // loop through the holdings array
    // generate a string of HTML for each with the values
    let body = "";
    let total = 0;
    this.holdings.forEach(
      function(holding) {
        const holdingValue = this.calcHoldingValue(holding);
        let line = `
      <tr id="holding-${holding.currency}">
        <td width="5%">
          <i class="fa fa-line-chart" />
        </td>
        <td>${holding.currency}</td>
        <td>${holding.shares}</td>
        <td>$${holdingValue}</td>
        <td>
          <a class="button is-small is-primary" data-currency="${holding.currency}" href="#buy-sell">
            SELL
          </a>
        </td>
      </tr>
      `;
        body += line;
        total += parseFloat(holdingValue);
      }.bind(this)
    );
    this.renderPortfolioValue(total);
    return body;
  }

  calcHoldingValue(holding) {
    //holding is a holding object
    const currencyValue = document
      .getElementById(holding.currency)
      .querySelector("#value").innerText;
    return (parseFloat(currencyValue) * parseFloat(holding.shares)).toFixed(2);
  }

  getHoldingsForCurrency(currency) {
    let holdingObj = this.holdings.find(
      holding => holding.currency === currency
    );
    // checks to see if portfolio has currency
    if (holdingObj) {
      return parseFloat(holdingObj.shares);
    } else {
      return false;
    }
  }

  getHoldingIdForCurrency(currency) {
    return this.holdings.find(holding => {
      return holding.currency === currency;
    }).id;
  }

  appendNewHolding(shares, currency) {
    let portfolio = document.getElementById("portfolio");
    let line = document.createElement("tr");
    portfolio.appendChild(line);

    line.innerHTML = `
        <td width="5%">
          <i class="fa fa-line-chart" />
        </td>
        <td>${currency}</td>
        <td>${shares}</td>
        <td>$${holdingValue}</td>
        <td>
          <a class="button is-small is-primary" data-currency="${holding.currency}" href="#">
            SELL
          </a>
        </td>

      `;
  }

  renderTransactionComplete() {
    document.querySelector(
      "#buy-sell > div > article > div > div > input"
    ).value =
      "";

    document.getElementById("buy-sell").innerHTML = `
    <div class="level-item has-text-centered" id="transaction-complete">
     <article class="tile is-child notification is-success">
       <h2 class="title">Transaction Complete</h2>

     </article>
    </div>
    `;

    $("#transaction-complete")
      .delay(1080)
      .fadeOut();
  }
}
