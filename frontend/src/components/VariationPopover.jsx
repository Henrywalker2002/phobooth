import * as React from "react";
import { Popover, Button, Chip } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import find_varation from "../util/FindVariation";

function SelectionChip({ options, handleChipClick, selectedChip }) {
  return (
    <div className="flex flex-col gap-4">
      {options?.map((opt, index) => (
        <div key={index} className="flex gap-5">
          <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap my-auto">
            {opt.name ? opt.name + " :" : ""}
          </div>
          <div className="flex gap-3 flex-wrap">
            {opt.value?.map((val, i) => {
              return index === 0 ? (
                <Chip
                  key={i}
                  label={val}
                  onClick={() => handleChipClick(val, index)}
                  variant="outlined"
                  sx={{
                    padding: "5px 5px",
                    bgcolor: `${selectedChip.opt1 === val ? "#3F41A6" : ""}`,
                    color: `${selectedChip.opt1 === val ? "#fff" : ""}`,
                    "&:hover": {
                      bgcolor: "#E2E5FF",
                    },
                  }}
                />
              ) : (
                <Chip
                  key={i}
                  label={val}
                  onClick={() => handleChipClick(val, index)}
                  variant="outlined"
                  sx={{
                    padding: "5px 5px",
                    bgcolor: `${selectedChip.opt2 === val ? "#3F41A6" : ""}`,
                    color: `${selectedChip.opt2 === val ? "#fff" : ""}`,
                    "&:hover": {
                      bgcolor: "#E2E5FF",
                    },
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function VariationPopover({
  open,
  handleClose,
  anchorEl,
  item_id,
  variation,
  setVariation,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [option, setOption] = React.useState([]);
  const [item, setItem] = React.useState({});
  React.useEffect(() => {
    axiosPrivate.get(`/item/${item_id}/`).then((res) => {
      setOption(res.data.option);
      setItem(res.data);
    });
  }, [item_id]);

  const [selectedChip, setSelectedChip] = React.useState({});
  const handleChipClick = (val, index) => {
    if (index === 0) setSelectedChip({ ...selectedChip, opt1: val });
    else setSelectedChip({ ...selectedChip, opt2: val });
    let selectedVariation = find_varation(
      val,
      index,
      item.variation,
      option.length,
      selectedChip
    );
    setVariation({ ...variation, [item_id]: selectedVariation });
    console.log({ ...variation, [item_id]: selectedVariation });
  };

  return (
    <Popover
      id="popover-variation"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
          Loại hàng hóa
        </div>
        {option.length > 0 ? (
          <SelectionChip
            options={option}
            handleChipClick={handleChipClick}
            selectedChip={selectedChip}
          />
        ) : (
          <div className="text-zinc-900 text-sm leading-5">
            Sản phẩm này không có phân loại
          </div>
        )}
      </div>
    </Popover>
  );
}
