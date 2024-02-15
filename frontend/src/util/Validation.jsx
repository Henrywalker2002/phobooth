// Validate fixed price
export const validFixedPrice = (price) => {
  if (!price || isNaN(price) || price == 0) return false;
  return true;
};

export const validRangePrice = (min_price, max_price) => {
  if (max_price < min_price) return false;
  return true;
};
