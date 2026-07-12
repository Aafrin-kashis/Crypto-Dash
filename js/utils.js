export function saveFavorite(coin) {
  const favs = loadFavorites();
  if (!favs.includes(coin)) favs.push(coin);
  localStorage.setItem("favorites", JSON.stringify(favs));
}

export function loadFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}