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
