import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Rating,
  Slider,
  TextField,
  styled,
} from "@mui/material";
import { useEffect } from "react";
import axios from "../../api/axios";

const PriceSlider = styled(Slider)({
  color: "#3F41A6",
  height: 5,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: "15px",
    width: "15px",
    backgroundColor: "#fff",
    border: "2px solid #3F41A6",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
});

function Filter() {
  const ratings = [
    { value: 5, label: "5.0" },
    { value: 4, label: "từ 4.0 trở lên" },
    { value: 3, label: "từ 3.0 trở lên" },
    { value: 2, label: "từ 2.0 trở lên" },
    { value: 1, label: "từ 1.0 trở lên" },
  ];
  const [categories, setCategories] = useState([]);

  const [priceRange, setPriceRange] = useState([200000, 500000]);

  const handlePriceRangeSlider = (event, newValue) => {
    setPriceRange(newValue);
  };
  const handlePriceRangeInput = (e, index) => {
    let newRange = [...priceRange];
    newRange[index] = e.target.value;
    setPriceRange(newRange);
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  function valuetext(value) {
    return `${formatter.format(value)}`;
  }

  useEffect(() => {
    axios
      .get("/category")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="max-w-[300px] flex flex-col gap-5 mt-16">
      {/* Danh mục */}
      <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
        <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
          Danh mục :
        </div>
        <FormGroup>
          {categories?.map((category, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: "#3F41A6",
                    },
                  }}
                />
              }
              label={category.title}
              sx={{
                color: "#666",

                "& .MuiTypography-root": {
                  fontSize: "14px",
                },
              }}
            />
          ))}
        </FormGroup>
      </div>

      {/* Giá */}
      <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
        <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
          Giá cả :
        </div>

        <PriceSlider
          getAriaLabel={() => "Price range"}
          value={priceRange}
          onChange={handlePriceRangeSlider}
          valueLabelFormat={valuetext}
          valueLabelDisplay="auto"
          shiftStep={300000}
          step={100000}
          marks
          min={100000}
          max={2000000}
          sx={{
            "& .MuiSlider-thumb": {
              height: 24,
              width: 24,
              backgroundColor: "#fff",
              border: "2px solid currentColor",
              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "inherit",
              },
              "&::before": {
                display: "none",
              },
            },
          }}
        />

        <div className="justify-start items-center flex gap-2">
          <div className="text-zinc-900 text-base leading-5">Giá cả :</div>
          <TextField
            required
            variant="outlined"
            name="min_price"
            onChange={(e) => handlePriceRangeInput(e, 0)}
            value={priceRange[0]}
            sx={{
              "& .MuiInputBase-input": {
                height: "30px",
                boxSizing: "border-box",
              },
              width: "100px",
              marginY: "10px",
            }}
          />
          <div className="text-black text-base leading-5 my-auto">-</div>
          <TextField
            required
            variant="outlined"
            name="max_price"
            onChange={(e) => handlePriceRangeInput(e, 1)}
            value={priceRange[1]}
            sx={{
              "& .MuiInputBase-input": {
                height: "30px",
                boxSizing: "border-box",
              },
              width: "100px",
              marginY: "10px",
            }}
          />
        </div>
      </div>

      {/* Đánh giá */}
      <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
        <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
          Đánh giá :
        </div>
        <FormGroup>
          {ratings.map((rating, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: "#3F41A6",
                    },
                  }}
                />
              }
              label={
                <div className="flex items-center gap-1">
                  <Rating
                    name="read-only"
                    value={rating.value}
                    readOnly
                    size="small"
                  />
                  <div className="text-sm">{rating.label}</div>
                </div>
              }
              sx={{
                color: "#666",

                "& .MuiTypography-root": {
                  fontSize: "14px",
                },
              }}
            />
          ))}
        </FormGroup>
      </div>
    </div>
  );
}

export default Filter;
