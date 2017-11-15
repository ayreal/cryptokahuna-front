class Portfolio {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.userName = data.user.name;
    this.cash = data.user.cash;
    this.holdings = data.holdings; // an array
  }

  renderLiquidAssets() {
    liquidAssets.innerHTML = `
    <h2 class="subtitle">Current Liquid Assets</h2>
    <h1 class="title is-1">$${this.cash}</h1>
    `;
  }

  renderPortfolioValue() {
    // let value = calculateHoldings()
    portfolioValue.innerHTML = `
    <h2 class="subtitle">Current Portfolio Value</h2>
    <h1 class="title is-1">$0</h1>
    `;
  }
}
