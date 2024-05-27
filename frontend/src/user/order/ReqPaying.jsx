import {
  Dialog,
  Divider,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import dayjs from "dayjs";
import { isBeforeToday } from "../../util/Compare";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function ReqPaying({ open, setOpen, req, setReload }) {
  const axiosPrivate = useAxiosPrivate();
  const today = dayjs(dayjs().format("YYYY-MM-DD"));
  const [payMethod, setPayMethod] = useState("");
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handlePaying = () => {
    if (payMethod == "vnpay") {
      axiosPrivate
        .get(`/payment/${req.id}/payment-url/`)
        .then((res) => {
          console.log(res);
          window.open(res.data.url, "_self");
          setReload(true);
        })
        .then(() => setOpen(false))
        .catch((err) => {
          console.log(err);
        });
    } else console.log("Chưa chọn phương thức thanh toán!");
  };
  return (
    <Dialog
      sx={{ minWidth: "400px" }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="w-[450px] shadow-sm bg-white flex items-center justify-between gap-16 px-4 py-2 rounded-lg ">
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
          Yêu cầu thanh toán
        </div>
        <IconButton
          onClick={() => {
            setOpen(false);
          }}
        >
          <FaXmark />
        </IconButton>
      </div>
      <Divider />
      <div className="flex flex-col gap-4 py-5 px-7">
        <div className="flex gap-5 justify-between items-center text-base leading-6">
          <div className="flex-auto text-zinc-900">Thứ tự yêu cầu :</div>
          <div className="text-right text-stone-500">{req?.no}</div>
        </div>

        <div className="flex gap-5 justify-between  text-base leading-6 ">
          <div className="flex-auto text-zinc-900">Ngày thanh toán :</div>
          <div className="flex-auto text-right text-stone-500">
            {today.format("DD-MM-YYYY")}
          </div>
        </div>

        <div className="flex gap-5 justify-between  text-base leading-6 ">
          <div className="flex-auto text-zinc-900">Hạn thanh toán :</div>
          <div className="flex gap-2">
            {isBeforeToday(req?.expiration_date) ? (
              <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap justify-center self-center rounded bg-red-500 bg-opacity-20 px-3 py-[1px]">
                Quá hạn
              </div>
            ) : null}
            <div className="flex-auto text-right text-stone-500">
              {dayjs(req?.expiration_date).format("DD-MM-YYYY")}
            </div>
          </div>
        </div>

        <div className="shrink-0 h-px border border-solid bg-neutral-200 border-neutral-200 " />

        <div className="flex gap-5 justify-between items-center bg-white ">
          <div className="flex-auto text-base leading-6 text-zinc-900">
            Số tiền cần thanh toán :
          </div>
          <div className="text-lg font-semibold leading-5 text-indigo-800">
            {formatter.format(req?.amount)}
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
          <div className="flex-auto text-zinc-900">
            Phương thức thanh toán :
          </div>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="payment-method"
              onChange={(e) => setPayMethod(e.target.value)}
              //   value={service.type}
            >
              <FormControlLabel
                value="cash"
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#3F41A6",
                      },
                    }}
                  />
                }
                label="Tiền mặt (sau khi giao hàng)"
                sx={{
                  color: "#666",

                  "& .MuiTypography-root": {
                    fontSize: "13px",
                  },
                }}
              />
              <FormControlLabel
                value="vnpay"
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#3F41A6",
                      },
                    }}
                  />
                }
                label="VN Pay"
                sx={{
                  color: "#666",

                  "& .MuiTypography-root": {
                    fontSize: "13px",
                  },
                }}
              />
            </RadioGroup>
          </FormControl>
        </div>

        <Button
          variant="contained"
          onClick={handlePaying}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "full-width",
            borderRadius: "56px",
            paddingY: "8px",
            fontSize: "16px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Thanh toán
        </Button>
      </div>
    </Dialog>
  );
}

export default ReqPaying;
