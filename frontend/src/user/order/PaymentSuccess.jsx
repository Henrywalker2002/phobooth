import { Avatar, Button, Divider, Paper } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrencyFormatter } from "../../util/Format";
import { FaCircleCheck } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PaymentSuccess() {
  const axiosInstance = useAxiosPrivate();
  const navigate = useNavigate();
  let query = useQuery();
  let refCode = query.get("vnp_TxnRef"),
    amount = query.get("vnp_Amount"),
    transactionNo = query.get("vnp_TransactionNo"),
    transactionDate = query.get("vnp_PayDate");
  
  let orderId = refCode.split("-")[0];
  let paymentId = refCode.split("-")[1];

  useEffect(() => {
    axiosInstance.get("/payment/return/", { params: query }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }, [query]);
  return (
    <div className="w-full mx-auto my-12 flex items-center justify-center">
      <Paper
        sx={{
          width: "500px",
          padding: "20px 40px",
          border: "0.5px solid #d6d3d1",
        }}
        elevation={2}
      >
        <div className="flex flex-col gap-7 ">
          <div className="flex flex-col gap-3 items-center">
            <Avatar sx={{ bgcolor: "#fff", width: "50px", height: "50px" }}>
              <FaCircleCheck className="text-green-600 w-12 h-12" />
            </Avatar>
            <div className="text-xl font-semibold tracking-tight  text-green-400">
              Đã thanh toán thành công
            </div>
          </div>

          <Divider className="border-dashed" />
          <div className="flex flex-col gap-4">
            <div className="flex gap-5 justify-between items-center text-base leading-6">
              <div className="flex-auto text-zinc-900">Đơn hàng :</div>
              <div className="text-right text-stone-500">#{orderId}</div>
            </div>
            <div className="flex gap-5 justify-between items-center text-base leading-6">
              <div className="flex-auto text-zinc-900">
                Yêu cầu thanh toán :
              </div>
              <div className="text-right text-stone-500">#{paymentId}</div>
            </div>

            <div className="flex gap-5 justify-between items-center text-base leading-6">
              <div className="flex-auto text-zinc-900">Mã thanh toán :</div>
              <div className="text-right text-stone-500">{transactionNo}</div>
            </div>

            <div className="flex gap-5 justify-between items-center text-base leading-6">
              <div className="flex-auto text-zinc-900">Ngày thanh toán :</div>
              <div className="text-right text-stone-500">{transactionDate}</div>
            </div>

            <div className="flex gap-5 justify-between items-center text-base leading-6">
              <div className="flex-auto text-zinc-900">
                Số tiền đã thanh toán :
              </div>
              <div className="text-right font-bold text-green-700">
                {CurrencyFormatter(amount / 100) }
              </div>
            </div>
          </div>

          <Button
            variant="outlined"
            color="success"
            sx={{
              textTransform: "none",
              width: "fit-content",
              borderRadius: "56px",
              padding: "5px 20px",
              fontSize: "15px",
              marginX: "auto",
            }}
            onClick= {() => {
              navigate(`/order/detail/${orderId}`);
            }}
          >
            Quay lại đơn hàng
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default PaymentSuccess;
