import React from "react";
import { Button, Dialog, Divider, IconButton, TextField } from "@mui/material";
import { FaXmark } from "react-icons/fa6";

function TransferDialog({ open, setOpen }) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <Dialog
      sx={{ minWidth: "500px" }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="w-[500px] shadow-sm bg-white flex items-center justify-between gap-16 px-4 py-2 rounded-lg ">
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
          Chuyển tiền
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
        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Studio :</div>
          <div className="text-right text-stone-500">Studio Demo</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Số tài khoản :</div>
          <div className="text-right text-stone-500">04618763876</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Ngân hàng :</div>
          <div className="text-right text-stone-500">ACB</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Số tiền yêu cầu :</div>
          <div className="text-right text-stone-500">
            {formatter.format(3000000)}
          </div>
        </div>

        <div className="flex gap-5 justify-between items-center bg-white max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-base font-medium leading-6 text-zinc-900">
            Mã giao dịch :
          </div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": {
                height: "43px",
                boxSizing: "border-box",
              },

              width: "170px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      <div className="flex gap-5  mx-auto my-5 text-sm font-semibold leading-4 whitespace-nowrap ">
        <Button
          variant="contained"
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
          Xác nhận đã chuyển
        </Button>
      </div>
    </Dialog>
  );
}

export default TransferDialog;
