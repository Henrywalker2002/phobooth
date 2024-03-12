// Compare 2 arrays of objects
export const arrayIsEqual = (a1, a2) => {
  if (a1 === a2) return true;
  if (a1.length === a2.length) {
    const excluded = a1.map(
      (obj1) =>
        !a2.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2))
    );
    if (excluded.length > 0) return false;
    else return true;
  }
  return false;
};

// Compare 2 day
export const isBefore = (day1, day2) => {
  const date1 = new Date(day1);
  const date2 = new Date(day2);
  return date1 < date2;
};

// Calculate with today
export const daysleftCount = (date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date);
  const today = new Date().toISOString().slice(0, 10);
  const secondDate = new Date(today);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Compare with today
export const isBeforeToday = (date) => {
  const today = new Date().toISOString().slice(0, 10);
  const date1 = new Date(date);
  const date2 = new Date(today);
  return date1 < date2;
};
