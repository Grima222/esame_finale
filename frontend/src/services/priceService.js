export const getPrices = () => {
  return JSON.parse(localStorage.getItem('itemPrices') || '{}');
};

export const setPrice = (id, price) => {
  const prices = getPrices();
  prices[id] = price;
  localStorage.setItem('itemPrices', JSON.stringify(prices));
};

export const deletePrice = (id) => {
  const prices = getPrices();
  delete prices[id];
  localStorage.setItem('itemPrices', JSON.stringify(prices));
};
