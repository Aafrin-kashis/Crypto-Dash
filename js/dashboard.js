import { fetchCoin, fetchHistory, fetchUSDToINR, fetchMarketData } from "./api.js";
import {saveFavorite, loadFavorites, removeFavorite} from "./utils.js";

const search = document.getElementById("search");
const results = document.getElementById("results");
const favList = document.getElementById("favList");
const usdInput = document.getElementById("usdInput");
const convertBtn = document.getElementById("convertBtn");
const inrResult = document.getElementById("inrResult");
const gainers = document.getElementById("gainers");
const losers = document.getElementById("losers");
const searchBtn = document.getElementById("searchBtn");

let chart;

// Handle search
async function searchCoin(){

const coin = search.value.trim().toLowerCase();

if(!coin) return;

try{

const data = await fetchCoin(coin);

renderResult(data);

renderChart(coin);

}

catch(error){

results.innerHTML =
'<p class="error">Coin not found</p>';

}

}

search.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

searchCoin();

}

});

searchBtn.addEventListener("click",()=>{

searchCoin();

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

async function renderChart(coin){

const history=await fetchHistory(coin);

const prices=history.prices.map(p=>p[1]);

const labels=history.prices.map(p=>new Date(p[0]).toLocaleDateString());

const isUp=prices.at(-1)>=prices[0];

const color=isUp?"#16a34a":"#dc2626";

const ctx=document.getElementById("priceChart").getContext("2d");

if(chart) chart.destroy();

chart=new Chart(ctx,{
type:"line",
data:{
labels,
datasets:[{
label:`${coin.toUpperCase()} Price`,
data:prices,
borderColor:color,
backgroundColor:isUp?"rgba(22,163,74,.15)":"rgba(220,38,38,.15)",
borderWidth:3,
fill:true,
tension:.4,
pointRadius:4,
pointBackgroundColor:color
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{
display:true,
position:"top"
}
},
scales:{
x:{
grid:{
display:false
}
},
y:{
grid:{
color:"#e5e7eb"
}
}
}
}
});

}

function renderFavorites(){

const favs=loadFavorites();

favList.innerHTML="";

favs.forEach((coin)=>{

const item=document.createElement("div");

item.className="fav-item";

item.innerHTML=`
<span>${coin}</span>
<button class="deleteFav">✕</button>
`;

item.querySelector("span").addEventListener(
"click",
async()=>{

const data=await fetchCoin(coin);

renderResult(data);

renderChart(coin);

});

item.querySelector(".deleteFav").addEventListener(
"click",
(e)=>{

e.stopPropagation();

removeFavorite(coin);

renderFavorites();

});

favList.appendChild(item);

});

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


const sorted = coins.sort(
(a,b)=>
b.price_change_percentage_24h -
a.price_change_percentage_24h
);


const topGainers = sorted.slice(0,6);

const topLosers = sorted.slice(-6);



gainers.innerHTML = topGainers
.map(createMarketCard)
.join("");



losers.innerHTML = topLosers
.map(createMarketCard)
.join("");

document.querySelectorAll(".star").forEach((star)=>{

star.addEventListener("click",(e)=>{

e.stopPropagation();

const coinId=star.dataset.id;

const favs=loadFavorites();

if(favs.includes(coinId)){

removeFavorite(coinId);

star.textContent="☆";

}else{

saveFavorite(coinId);

star.textContent="★";

}

renderFavorites();

});

});

}

catch(error){

gainers.innerHTML="Unable to load data";
losers.innerHTML="Unable to load data";

}

}



function createMarketCard(coin){

const favs=loadFavorites();

const isFav=favs.includes(coin.id);

const change=coin.price_change_percentage_24h.toFixed(2);

return`

<div class="crypto-card">

<div class="coin-header">

<img src="${coin.image}">

<div>

<h3>${coin.name}</h3>

<span>${coin.symbol.toUpperCase()}</span>

</div>

<button
class="star"
data-id="${coin.id}"
>
${isFav?"★":"☆"}
</button>

</div>

<h2>$${coin.current_price.toLocaleString()}</h2>

<p class="${change>=0?"profit":"loss"}">

${change>=0?"▲":"▼"} ${change}%

</p>

<div class="coin-info">

<div>

<small>Market Cap</small>

<p>$${(coin.market_cap/1e9).toFixed(2)}B</p>

</div>

<div>

<small>Volume</small>

<p>$${(coin.total_volume/1e9).toFixed(2)}B</p>

</div>

<div>

<small>Rank</small>

<p>#${coin.market_cap_rank}</p>

</div>

</div>

</div>

`;

}



renderMarketWidget();