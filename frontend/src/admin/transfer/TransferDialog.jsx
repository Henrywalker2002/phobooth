import React, { useEffect, useState } from "react";
import { Button, Dialog, Divider, IconButton, TextField } from "@mui/material";
import { FaXmark } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import BankList from "./BankList";


const handleBankName = (bankCode) => {
  if (!bankCode) return "";
  const bankList = BankList;
  const bank = bankList.find((item) => item.bin === bankCode);
  return `${bank.code} - ${bank.name}`;
}


function TransferDialog({ open, setOpen, requestId, tranferList, setTransferList }) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const axiosPrivate = useAxiosPrivate();

  const [requestInfor, setRequestInfor] = useState({});
  const [data, setData] = useState({status : "DONE"});
  const [error, setError] = useState({});

  useEffect(() => {
    axiosPrivate.get(`/draw-money/${requestId}/`).then((res) => {
      setRequestInfor(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [requestId])

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleConfirmTransfer = () => {
    if (!data.transation_id) {
      setError({ transation_id: "Mã giao dịch không được để trống" });
      return;
    }
    axiosPrivate.patch(`/draw-money/${requestId}/`, data).then((res) => {
      setTransferList(tranferList.map((item) => item.id === requestId ? res.data : item));
      setOpen(false);
    }).catch((err) => {
      console.log(err);
    });
  }

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
          <div className="text-right text-stone-500">{requestInfor.studio?.friendly_name}</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Ngân hàng :</div>
          <div className="text-right text-stone-500">{handleBankName(requestInfor.studio?.bank_bin)}</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Số tài khoản :</div>
          <div className="text-right text-stone-500">{requestInfor.studio?.account_number}</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Tên người thụ hưởng:</div>
          <div className="text-right text-stone-500">{requestInfor.studio?.account_name}</div>
        </div>

        <div className="flex gap-5 justify-between items-center text-base leading-6 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-zinc-900">Số tiền yêu cầu :</div>
          <div className="text-right text-stone-500">
            {formatter.format(requestInfor.amount)}
          </div>
        </div>

        <div className="flex gap-5 justify-between items-center bg-white max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto text-base font-medium leading-6 text-zinc-900">
            Mã giao dịch :
          </div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name = "transation_id"
            sx={{
              "& .MuiInputBase-input": {
                height: "43px",
                boxSizing: "border-box",
              },

              width: "170px",
              boxSizing: "border-box",
            }}
            onChange={handleChange}
            error={error.transation_id ? true : false}
            helperText={error.transation_id}
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
          onClick={handleConfirmTransfer}
        >
          Xác nhận đã chuyển
        </Button>
      </div>
    </Dialog>
  );
}

export default TransferDialog;
