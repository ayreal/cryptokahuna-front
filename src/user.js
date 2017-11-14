class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.cash = data.cash;
    this.portfolios = data.portfolios; // an array
  }

  renderPortfolioValue() {
    debugger;
  }
  renderLiquidAssets() {
    liquidAssets.innerHTML = `
    <h2 class="subtitle">Current Liquid Assets</h2>
    <h1 class="title is-1">$${this.cash}</h1>
      `;
  }
}
