import { Dialog, Divider, IconButton } from "@mui/material";
import React from "react";
import { FaXmark } from "react-icons/fa6";
import dayjs from "dayjs";

function DeltailRequest({ open, setOpen, req }) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
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
          <div className="flex-auto text-zinc-900">Hạn thanh toán :</div>
          <div className="flex-auto text-right text-stone-500">
            {dayjs(req?.expiration_date).format("DD-MM-YYYY")}
          </div>
        </div>
        <div className="flex gap-5 justify-between  text-base leading-6 ">
          <div className="flex-auto text-zinc-900">Ngày thanh toán :</div>
          <div className="flex-auto text-right text-stone-500">
            {req?.payment_date !== null
              ? dayjs(req?.payment_date).format("DD-MM-YYYY")
              : "Chưa có"}
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

        <div className="flex gap-5 justify-between  text-base leading-6 ">
          <div className="flex-auto text-zinc-900">
            Phương thức thanh toán :
          </div>
          <div className="flex-auto text-right text-stone-500">
            {req?.payment_method !== "" ? req.payment_method : "Chưa có"}
          </div>
        </div>

        <div className="flex gap-5 justify-between  text-base leading-6 ">
          <div className="text-zinc-900">Trạng thái :</div>
          {req?.status === "PENDING" ? (
            <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap rounded bg-red-500 bg-opacity-20 px-2 py-1">
              Chưa thanh toán
            </div>
          ) : req?.status === "PAID" ? (
            <div className="w-fit text-green-600 text-xs leading-5 whitespace-nowrap rounded bg-green-600 bg-opacity-20 px-2 py-1">
              Đã thanh toán
            </div>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
}

export default DeltailRequest;
