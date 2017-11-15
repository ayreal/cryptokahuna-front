class Portfolio {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.userName = data.user.name;
    this.cash = data.user.cash;
    this.holdings = data.holdings; // an array
  }

  // updates cash display
  renderLiquidAssets() {
    liquidAssets.innerHTML = `
    <h2 class="subtitle">Current Liquid Assets</h2>
    <h1 class="title is-1">$${portfolio.cash}</h1>
    `;
  }

  // updates portfolio value
  renderPortfolioValue(value) {
    portfolioValue.innerHTML = `
    <h2 class="subtitle">Current Portfolio Value</h2>
    <h1 class="title is-1">$${value.toFixed(2)}</h1>
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
      <tr>
        <td width="5%">
          <i class="fa fa-line-chart" />
        </td>
        <td>${holding.currency}</td>
        <td>${holding.shares}</td>
        <td>$${holdingValue}</td>
        <td>
          <a class="button is-small is-primary" data-currency="${holding.currency}" href="#">
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
    return parseFloat(holdingObj.shares);
  }
}
