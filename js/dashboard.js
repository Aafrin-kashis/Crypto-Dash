import { fetchCoin, fetchHistory, fetchUSDToINR, fetchMarketData } from "./api.js";
import { saveFavorite, loadFavorites } from "./utils.js";

const search = document.getElementById("search");
const results = document.getElementById("results");
const favList = document.getElementById("favList");
const usdInput = document.getElementById("usdInput");
const convertBtn = document.getElementById("convertBtn");
const inrResult = document.getElementById("inrResult");
const gainers = document.getElementById("gainers");
const losers = document.getElementById("losers");

let chart;

// Handle search
search.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const coin = search.value.toLowerCase();
    try {
      const data = await fetchCoin(coin);
      renderResult(data);
      renderChart(coin);
    } catch (err) {
      results.innerHTML = `<p class="error">Not found</p>`;
    }
  }
});

function renderResult(data) {
  results.innerHTML = `
    <div class="card">
      <img src="${data.image.small}" alt="${data.name}">
      <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
      <p>Price: $${data.market_data.current_price.usd}</p>
      <p>24h Change: ${data.market_data.price_change_percentage_24h}%</p>
      <button id="favBtn">Add to Favorites</button>
    </div>
  `;
  document.getElementById("favBtn").addEventListener("click", () => {
    saveFavorite(data.id);
    renderFavorites();
  });
}

async function renderChart(coin) {
  const history = await fetchHistory(coin);
  const ctx = document.getElementById("priceChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.prices.map(p => new Date(p[0]).toLocaleDateString()),
      datasets: [{
        label: `${coin} Price`,
        data: history.prices.map(p => p[1]),
        borderColor: "#007BFF",
        fill: false
      }]
    }
  });
}

function renderFavorites() {
  const favs = loadFavorites();
  favList.innerHTML = favs.map(f => `<li>${f}</li>`).join("");
}

// Init favorites
renderFavorites();

convertBtn.addEventListener(
"click",
async()=>{

try{

const data = await fetchUSDToINR();

const usd = usdInput.value;

const rate = data.rates.INR;

const result = usd * rate;


inrResult.innerHTML =
`INR Value: ₹${result.toFixed(2)}`;


}

catch(error){

inrResult.innerHTML =
"Currency conversion failed";

}

});

async function renderMarketWidget(){


try{


const coins = await fetchMarketData();



const sortedCoins = coins.sort(
(a,b)=>
b.price_change_percentage_24h -
a.price_change_percentage_24h
);



const topGainers =
sortedCoins.slice(0,5);



const topLosers =
sortedCoins.slice(-5);



gainers.innerHTML =
topGainers.map(
coin=>`

<div class="market-card">
<img src="${coin.image}">

<div>

<h3>${coin.name}</h3>
<p>
$${coin.current_price}
</p>

<span>
+${coin.price_change_percentage_24h.toFixed(2)}%
</span>

</div>
</div>

`
).join("");


losers.innerHTML =
topLosers.map(
coin=>`

<div class="market-card">
<img src="${coin.image}">
<div>

<h3>${coin.name}</h3>

<p>
$${coin.current_price}
</p>

<span>
${coin.price_change_percentage_24h.toFixed(2)}%
</span>

</div>
</div>

`
).join("");

}

catch(error){

gainers.innerHTML =
"Unable to load market data";

losers.innerHTML =
"Unable to load market data";

}
}
renderMarketWidget();