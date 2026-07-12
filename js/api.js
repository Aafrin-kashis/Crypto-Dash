const API_URL = "https://api.coingecko.com/api/v3";
const CURRENCY_API = 
"https://api.exchangerate-api.com/v4/latest/USD";

// Fetch coin data
export async function fetchCoin(coin = "bitcoin") {
  const res = await fetch(`${API_URL}/coins/${coin}`);
  if (!res.ok) throw new Error("Failed to fetch coin data");
  return res.json();
}

// Fetch price history
export async function fetchHistory(coin = "bitcoin") {
  const res = await fetch(`${API_URL}/coins/${coin}/market_chart?vs_currency=usd&days=7`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function fetchUSDToINR(){

  const res = await fetch(CURRENCY_API);

  if(!res.ok){
    throw new Error("Currency fetch failed");
  }

  return res.json();

}