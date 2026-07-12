const API_URL = "https://api.coingecko.com/api/v3";

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