import React from "react";
import { Paper, Avatar, Rating, Button, Snackbar } from "@mui/material";
import { RiBarChartFill } from "react-icons/ri";
import StarIcon from "@mui/icons-material/Star";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { FaArrowRight } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function Widgets({ studioInfor, setStudioInfor }) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const [openSBar, setOpenSBar] = React.useState(false);
  const [messageBar, setMessageBar] = React.useState("");
  const axiosPrivate = useAxiosPrivate();

  console.log(studioInfor);

  const handleDrawMoney = () => {
    axiosPrivate
      .post("/draw-money/", {})
      .then((res) => {
        setOpenSBar(true);
        setMessageBar("Rút tiền thành công");
        setStudioInfor({ ...studioInfor, account_balance: 0 });
      })
      .catch((res) => {
        console.log(res.data);
        if (res.data.status === 400) {
          if (
            "non_field_errors" in res.data &&
            res.data.non_field_errors[0].includes("account number")
          ) {
            setOpenSBar(true);
            setMessageBar("Chưa có thông tin tài khoản ngân hàng");
          }
        }
      });
  };

  return (
    <div className="w-full flex justify-evenly">
      <div className="flex flex-col w-1/5 max-w-[240px] max-h-[100px]">
        <Paper
          elevation={2}
          sx={{
            borderRadius: "8px",
            height: "90px",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <div className="flex py-2 px-3 w-full items-center h-full">
            <div className="flex gap-4 items-center w-fit">
              <Avatar
                sx={{ color: "#3F41A6", bgcolor: "#E2E5FF", fontSize: "22px" }}
              >
                <RiBarChartFill />
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-medium tracking-tight leading-6 text-slate-400">
                  Lượng đơn hàng
                </div>
                <div className="flex gap-1 items-end">
                  <div className="text-xl font-semibold tracking-tight  text-indigo-900">
                    {studioInfor.number_order_completed}
                  </div>
                  <div className="text-xs tracking-tight leading-5 text-slate-400">
                    đơn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex flex-col w-1/5 max-w-[240px] max-h-[100px]">
        <Paper
          elevation={2}
          sx={{
            borderRadius: "8px",
            height: "90px",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <div className="flex py-2 px-3 w-full items-center h-full">
            <div className="flex gap-4 items-center w-fit">
              <Avatar sx={{ color: "#3F41A6", bgcolor: "#E2E5FF" }}>
                <StarIcon />
              </Avatar>
              <div className="flex flex-col my-auto">
                <div className="text-sm font-medium tracking-tight leading-6 text-slate-400">
                  Đánh giá
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xl text-indigo-900 font-semibold tracking-tight">
                    {studioInfor.star}
                  </div>
                  <Rating
                    name="read-only"
                    value={parseFloat(studioInfor.star)}
                    precision={0.1}
                    readOnly
                    size="medium"
                    sx={{ color: "#3F41A6" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex flex-col w-1/5 max-w-[240px] max-h-[100px]">
        <Paper
          elevation={2}
          sx={{
            borderRadius: "8px",
            height: "90px",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <div className="flex py-2 px-3 w-full items-center h-full">
            <div className="flex gap-4 items-center w-fit">
              <Avatar sx={{ color: "#3F41A6", bgcolor: "#E2E5FF" }}>
                <InventoryIcon />
              </Avatar>
              <div className="flex flex-col my-auto">
                <div className="text-sm font-medium tracking-tight leading-6 text-slate-400">
                  Số lượng sản phẩm
                </div>
                <div className="flex gap-1 items-end">
                  <div className="text-xl font-semibold tracking-tight  text-indigo-900">
                    {studioInfor.total_item}
                  </div>
                  <div className="text-xs tracking-tight leading-5 text-slate-400">
                    sản phẩm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex flex-col w-1/5 max-w-[240px] max-h-[100px]">
        <Paper
          elevation={2}
          sx={{
            borderRadius: "8px",
            height: "90px",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <div className="flex py-2 px-3 w-full items-center h-full">
            <div className="flex gap-4 items-center w-fit">
              <Avatar sx={{ color: "#3F41A6", bgcolor: "#E2E5FF" }}>
                <PriceCheckIcon sx={{ fontSize: "26px" }} />
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-medium tracking-tight leading-6 text-slate-400">
                  Số dư
                </div>
                <div className="text-xl font-semibold tracking-tight  text-indigo-900">
                  {formatter.format(studioInfor.account_balance ?? 0)}
                </div>
                <Button
                  startIcon={
                    <FaArrowRight style={{ width: "15px", height: "12px" }} />
                  }
                  sx={{
                    textTransform: "none",
                    color: "#3F41A6",
                    width: "fit-content",
                    padding: 0,
                    borderRadius: "5px",
                    fontSize: "12px",
                    "&:hover": {
                      color: "#1A237E",
                    },
                  }}
                  disabled={studioInfor.account_balance < 10000}
                  onClick={handleDrawMoney}
                >
                  Rút tiền
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex flex-col w-1/5 max-w-[240px] max-h-[100px]">
        <Paper
          elevation={2}
          sx={{
            borderRadius: "8px",
            height: "90px",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <div className="flex py-2 px-3 w-full items-center h-full">
            <div className="flex gap-4 items-center w-fit">
              <Avatar sx={{ color: "#3F41A6", bgcolor: "#E2E5FF" }}>
                <CurrencyExchangeIcon />
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-medium tracking-tight leading-6 text-slate-400">
                  Số tiền tạm giữ
                </div>
                <div className="text-xl font-semibold tracking-tight  text-indigo-900">
                  {formatter.format(studioInfor.account_balance ?? 0)}
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        message={messageBar}
      />
    </div>
  );
}

export default Widgets;
