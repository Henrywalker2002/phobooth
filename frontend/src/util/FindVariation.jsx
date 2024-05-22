const find_varation = (
  value,
  index,
  variations,
  option_length,
  selectedChip
) => {
  let result = null;
  const selection = selectedChip;
  if (index === 0) {
    selection.opt1 = value;
  } else {
    selection.opt2 = value;
  }
  if (option_length === 1) {
    for (let variation in variations) {
      if (variations[variation].value[0].name == value) {
        result = variations[variation];
        break;
      }
    }
  } else {
    for (let variation in variations) {
      if (
        (variations[variation].value[0].name == selection.opt1 &&
          variations[variation].value[1].name == selection.opt2) ||
        (variations[variation].value[0].name == selection.opt2 &&
          variations[variation].value[1].name == selection.opt1)
      ) {
        result = variations[variation];
        break;
      }
    }
  }
  return result;
};

export default find_varation;
