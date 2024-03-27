import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Button,
} from "@mui/material";
import { FaXmark } from "react-icons/fa6";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { isBefore } from "../../util/Compare";

function Filter({ open, setOpen, filterVal, setFilterVal }) {
  // local
  const statusList = [
    { label: "Đã đặt", value: "ORDERED" },
    { label: "Đang tiến hành", value: "IN_PROCESS" },
    { label: "Vận chuyển", value: "SHIPPING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Hủy đơn", value: "CANCELED" },
  ];
  const [newFilterVal, setNewFilterVal] = useState({});

  const checkDateFrom = (date_from) => {
    if (date_from !== undefined) {
      console.log(date_from);
      if (newFilterVal.date_end && isBefore(newFilterVal.date_end, date_from)) {
        return "Giá trị không hợp lệ.";
      } else if (
        filterVal.date_end &&
        isBefore(filterVal.date_end, date_from)
      ) {
        return "Giá trị không hợp lệ.";
      }
    }
    return "";
  };

  const checkDateEnd = (date_end) => {
    if (date_end) {
      if (
        newFilterVal.date_from &&
        isBefore(date_end, newFilterVal.date_from)
      ) {
        return "Giá trị không hợp lệ.";
      } else if (
        filterVal.date_from &&
        isBefore(date_end, filterVal.date_from)
      ) {
        return "Giá trị không hợp lệ.";
      }
    }
    return "";
  };

  const handleChangeFilter = (e) => {
    setNewFilterVal({ ...newFilterVal, [e.target.name]: e.target.value });
  };

  // Filter List
  const handleFilterOrder = () => {
    console.log(filterVal);
    console.log(newFilterVal);
    if (Object.keys(newFilterVal).length > 0) setFilterVal(newFilterVal);
    setOpen(false);
  };

  return (
    <Dialog
      sx={{ minWidth: "400px" }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>
        <div className="shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Bộ lọc
          </div>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <FaXmark />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        dividers={true}
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <div className="min-w-[350px] flex flex-col gap-4 px-7">
          <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
            <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
              Trạng thái :
            </div>
            <FormGroup>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="status"
                onChange={handleChangeFilter}
                defaultValue={filterVal.status}
              >
                {statusList.map((status, i) => (
                  <FormControlLabel
                    key={i}
                    value={status.value}
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#3F41A6",
                          },
                        }}
                      />
                    }
                    label={status.label}
                    sx={{
                      color: "#666",

                      "& .MuiTypography-root": {
                        fontSize: "14px",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormGroup>
          </div>

          <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
            <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
              Thời gian :
            </div>
            <div className="text-stone-500 text-[13px] leading-6 pl-2 ">
              Lưu ý: Ngày bắt đầu phải trước ngày kết thúc.
            </div>
            <div className="flex flex-col pl-2 gap-5">
              <div className="flex justify-between items-center ">
                <div className="text-base leading-6 text-zinc-900">
                  Từ ngày :
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="date_from"
                    sx={{
                      width: "170px",
                      "& .MuiInputBase-input": {
                        height: "40px",
                        boxSizing: "border-box",
                      },
                    }}
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      if (value)
                        setNewFilterVal({
                          ...newFilterVal,
                          date_from: value.format("YYYY-MM-DD"),
                        });
                    }}
                    defaultValue={
                      filterVal.date_from ? dayjs(filterVal.date_from) : null
                    }
                    slotProps={{
                      textField: {
                        helperText: `${checkDateFrom(
                          newFilterVal.date_from ?? filterVal.date_from
                        )}`,
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="flex justify-between items-center ">
                <div className="text-base leading-6 text-zinc-900">
                  Đến ngày :
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="date_end"
                    sx={{
                      width: "170px",
                      "& .MuiInputBase-input": {
                        height: "40px",
                        boxSizing: "border-box",
                      },
                    }}
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      if (value)
                        setNewFilterVal({
                          ...newFilterVal,
                          date_end: value.format("YYYY-MM-DD"),
                        });
                    }}
                    defaultValue={
                      filterVal.date_end ? dayjs(filterVal.date_end) : null
                    }
                    slotProps={{
                      textField: {
                        helperText: `${checkDateEnd(
                          newFilterVal.date_end ?? filterVal.date_end
                        )}`,
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <div className="flex gap-5 justify-center mx-auto my-2">
          <Button
            variant="outlined"
            onClick={() => {
              setFilterVal({});
              setNewFilterVal({});
              setOpen(false);
            }}
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "120px",

              borderRadius: "20px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy bộ lọc
          </Button>
          <Button
            disabled={
              checkDateFrom(newFilterVal.date_from ?? filterVal.date_from) !==
              ""
            }
            variant="contained"
            onClick={handleFilterOrder}
            sx={{
              textTransform: "none",
              bgcolor: "#3F41A6",
              width: "fit-content",
              padding: "5px 20px",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#3949AB",
              },
            }}
          >
            Lọc danh sách
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default Filter;
