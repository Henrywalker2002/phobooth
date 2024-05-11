import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button, Dialog, Divider, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import dayjs from "dayjs";

function CreateRequest({
  open,
  setOpen,
  orderId,
  setOpenSbar,
  total_count,
  total_price,
  amount_created,
}) {
  const [error, setError] = useState({
    amount : "Bạn cần nhập số tiền",
  });
  const [newReq, setNewReq] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const today = dayjs(dayjs().format("YYYY-MM-DD"));
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const checkEmptyInput = (val) => {
    if (!val || val == "") return true;
    return false;
  };

  const checkPrice = (price) => {
    if (price) {
      if (isNaN(price) || price <= 0 || price == "") {
        setError({...error, amount: "Giá trị không hợp lệ!"})
      } else if (total_price - amount_created - price < 0) {
        setError({...error, amount: "Giá trị vượt quá số tiền còn lại!"})
      }
      else if (price < 10000) {
        setError({...error, amount: "Số tiền cần thanh toán không thể nhỏ hơn 10,000 VND!"})
      }
      else {
        setError({...error, amount: ""})
      }
    }
    else {
      setError({...error, amount: "Bạn cần nhập số tiền"})
    }
  };

  const handleCreateNewReq = () => {
    let req = { ...newReq, order: orderId };
    console.log(req);

    axiosPrivate
      .post("/payment/", req)
      .then((res) => {
        console.log(res);
        setOpenSbar(true);
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const handleDateChange = (value) => {
    if (value) {
      let selectDate = new Date(value);
      
      if (isNaN(selectDate.getTime())) {
        setError({
          ...error,
          expiration_date: "Ngày không hợp lệ",
        });
        return;
      }
      if (selectDate.getTime() < new Date(today.format("YYYY-MM-DD")).getTime()) {
        setError({
          ...error,
          expiration_date: "Hạn thanh toán không thể nhỏ hơn ngày hiện tại",
        });
        return;
      }
      else {
        setError({
          ...error,
          expiration_date: "",
        })
      };
      setNewReq({
        ...newReq,
        expiration_date: value.format("YYYY-MM-DD"),
      });
      }
    }

    const handleAmountChange = (e) => {
      checkPrice(e.target.value);
      setNewReq({ ...newReq, amount: e.target.value })
    }
  return (
    <Dialog
      sx={{ minWidth: "500px" }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="w-[500px] shadow-sm bg-white flex items-center justify-between gap-16 px-4 py-2 rounded-lg ">
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
          Tạo yêu cầu thanh toán
        </div>
        <IconButton
          onClick={() => {
            setNewReq({});
            setOpen(false);
          }}
        >
          <FaXmark />
        </IconButton>
      </div>
      <Divider />
      <div className="flex flex-col gap-4 py-7 px-7">
        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Thứ tự yêu cầu :</div>
          <div className="text-right text-stone-500">Lần {total_count + 1}</div>
        </div>
        <div className="flex gap-5 justify-between items-center ">
          <div className="flex-auto  text-base leading-6 text-zinc-900">
            Hạn thanh toán:
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              required
              id="expiration_date"
              name="expiration_date"
              sx={{
                width: "170px",
                "& .MuiInputBase-input": {
                  height: "43px",
                  boxSizing: "border-box",
                },
              }}
              format="DD-MM-YYYY"
              minDate={today}
              onChange={handleDateChange}
              value={
                newReq.expiration_date ? dayjs(newReq?.expiration_date) : null
              }
              slotProps={{
                textField: {
                  error: error.expiration_date ? true : false,
                  helperText: error.expiration_date ?? "",
                  id: "expiration_date",
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <div className="flex gap-5 justify-between items-center bg-white max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-base font-medium leading-6 text-zinc-900">
            Số tiền cần thanh toán :
          </div>
          <TextField
            id="amount"
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": {
                height: "43px",
                boxSizing: "border-box",
              },

              width: "170px",
              boxSizing: "border-box",
            }}
            onChange={handleAmountChange}
            value={newReq.amount ?? ""}
            error={error.amount ? true : false}
            helperText={error.amount ?? ""}
          />
        </div>
        <div className="flex gap-5 justify-between items-center bg-white max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-base font-medium leading-6 text-zinc-900">
            Số tiền còn lại :
          </div>
          <div className="text-lg font-semibold leading-5 text-indigo-800">
            {formatter.format(
              error.amount === "" && newReq.amount
                ? total_price - amount_created - newReq.amount
                : total_price - amount_created
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-5  mx-auto my-5 text-sm font-semibold leading-4 whitespace-nowrap max-md:flex-wrap max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <Button
          variant="outlined"
          onClick={() => {
            setNewReq({}); 
            setOpen(false);
          }}
          sx={{
            textTransform: "none",
            border: "1px solid #3F41A6",
            color: "#3F41A6",
            width: "fit-content",
            paddingX: "20px",
            borderRadius: "20px",
            "&:hover": {
              border: "1px solid #3949AB",
            },
          }}
        >
          Hủy yêu cầu
        </Button>

        <Button
          variant="contained"
          disabled={
            checkEmptyInput(newReq.expiration_date) ||
            error.expiration_date !== "" || 
            error.amount !== ""
          }
          onClick={() => {
            handleCreateNewReq();
          }}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            paddingX: "20px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Tạo yêu cầu
        </Button>
      </div>
    </Dialog>
  );
}

export default CreateRequest;
