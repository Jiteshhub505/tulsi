export const getFavorites = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
};

export const isFavorite = (productId: string): boolean => {
  return getFavorites().includes(productId);
};

export const toggleFavorite = (productId: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const favs = getFavorites();
    let newFavs;
    let added = false;
    if (favs.includes(productId)) {
      newFavs = favs.filter((id) => id !== productId);
    } else {
      newFavs = [...favs, productId];
      added = true;
    }
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    window.dispatchEvent(new Event("favorites-updated"));
    return added;
  } catch {
    return false;
  }
};
