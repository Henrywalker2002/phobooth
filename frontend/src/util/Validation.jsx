// Validate fixed price
export const validFixedPrice = (price) => {
  if (!price || isNaN(price) || price <= 0 || price == "") return false;
  return true;
};

export const validRangePrice = (min_price, max_price) => {
  if (Number(max_price) < Number(min_price)) return false;
  return true;
};
