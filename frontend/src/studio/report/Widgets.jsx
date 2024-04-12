import React from "react";
import { Paper, Avatar, Rating, Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { RiBarChartFill } from "react-icons/ri";
import StarIcon from "@mui/icons-material/Star";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { FaArrowRight } from "react-icons/fa6";

function Widgets() {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <div className="flex gap-5 px-5 py-2.5 my-5">
      <div className="flex flex-col w-1/5 max-w-[280px] max-h-[100px]">
        <Paper
          elevation={2}
          sx={{
            borderRadius: "8px",
            height: "90px",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <div className="flex py-2 px-3 w-full items-center h-full">
            <div className="flex gap-4 self-center items-center w-fit h-fit my-auto">
              <Avatar sx={{ color: "#3F41A6", bgcolor: "#E2E5FF" }}>
                <AttachMoneyIcon />
              </Avatar>
              <div className="flex flex-col my-auto">
                <div className="text-sm font-medium tracking-tight leading-6 text-slate-400">
                  Doanh thu
                </div>
                <div className="flex gap-1 items-end">
                  <div className="text-xl font-semibold tracking-tight text-indigo-900">
                    {formatter.format(3000000000)}
                  </div>
                  <div className="text-xs tracking-tight leading-5 text-slate-400">
                    / tháng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex flex-col w-1/5 max-w-[280px] max-h-[100px]">
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
                    300000
                  </div>
                  <div className="text-xs tracking-tight leading-5 text-slate-400">
                    đơn
                  </div>
                </div>
                <div className="flex gap-1.5 text-xs tracking-tight leading-5">
                  <div className="font-bold text-teal-500">+23%</div>
                  <div className="text-slate-400">kể từ tháng trước</div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex flex-col w-1/5 max-w-[280px] max-h-[100px]">
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
                    4
                  </div>
                  <Rating
                    name="read-only"
                    value={4}
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

      <div className="flex flex-col w-1/5 max-w-[280px] max-h-[100px]">
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
                    300
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

      <div className="flex flex-col w-1/5 max-w-[280px] max-h-[100px]">
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
                  Số dư
                </div>
                <div className="text-xl font-semibold tracking-tight  text-indigo-900">
                  {formatter.format(3000000)}
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
                >
                  Rút tiền
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default Widgets;
