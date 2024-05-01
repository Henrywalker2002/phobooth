import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  TextField,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { FaXmark } from "react-icons/fa6";
import no_avt from "../../assets/blank-avatar.png";
import {
  CurrencyFormatter,
  TimeDateFormatter,
  TimeDateFormatterAfterXDays,
} from "../../util/Format";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function Reject({
  open,
  setOpen,
  noti,
  studio,
  setOpenSBar,
  setMsg,
  setReload,
  setOrderReload,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [reason, setReason] = useState("");

  const handleRejectChange = () => {
    axiosPrivate
      .patch(`/order-history/${noti.id}/`, {
        status: "REJECTED",
        denied_reason: reason,
      })
      .then((res) => {
        console.log(res.data);
        setMsg("Từ chối cập nhật thành công!");

        setOpen(false);
        setOpenSBar(true);
        setReload(true);
        setOrderReload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog
      sx={{ minWidth: "300px" }}
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
    >
      <DialogTitle>
        <div className=" shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Từ chối cập nhật
          </div>
          <IconButton
            sx={{ padding: 0 }}
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
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <div className="flex max-w-[380px] flex-col">
          {noti.fields === "order_item" ? (
            <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
              <ListItemAvatar>
                <Avatar
                  alt={studio?.friendly_name}
                  src={studio?.avatar ?? no_avt}
                />
              </ListItemAvatar>
              <ListItemText>
                <div className="flex-auto my-auto text-wrap whitespace-normal pr-5">
                  <span className="font-semibold text-indigo-800">
                    {studio?.friendly_name}{" "}
                  </span>
                  <span className="text-neutral-600">thêm sản phẩm mới</span>
                </div>

                <div className="flex gap-2  items-center leading-6">
                  <div className=" text-zinc-800 font-semibold flex gap-2">
                    {noti?.new_value?.item_name}
                    <span className="w-fit h-fit text-indigo-800 font-normal text-sm leading-4 rounded bg-indigo-100 px-2 py-1">
                      x {noti?.new_value?.quantity}
                    </span>
                    {noti?.new_value?.price && (
                      <span className=" text-stone-500">:</span>
                    )}
                  </div>
                  <div className=" text-zinc-00">
                    {noti?.new_value?.price &&
                      CurrencyFormatter(noti?.new_value?.price)}
                  </div>
                </div>
              </ListItemText>
            </ListItem>
          ) : (
            <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
              <ListItemAvatar>
                <Avatar
                  alt={studio?.friendly_name}
                  src={studio?.avatar ?? no_avt}
                />
              </ListItemAvatar>
              <ListItemText>
                <div className="flex-auto my-auto text-wrap whitespace-normal pr-5">
                  <span className="font-semibold text-indigo-800">
                    {studio?.friendly_name}{" "}
                  </span>
                  <span className="text-neutral-600">cập nhật </span>
                  <span className="font-semibold text-zinc-800">
                    {noti?.fields === "total_price" ? "giá tổng" : noti?.fields}
                  </span>
                </div>

                <div className="flex gap-2 text-indigo-800 leading-[150%] mt-2">
                  <div className="w-fit h-7 text-indigo-800 text-sm leading-5 justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                    {CurrencyFormatter(noti?.old_value)}
                  </div>
                  <EastIcon sx={{ color: "#3F41A6" }} />
                  <div className="w-fit h-7 text-indigo-800 text-sm leading-5 justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                    {CurrencyFormatter(noti?.new_value)}
                  </div>
                </div>
              </ListItemText>
            </ListItem>
          )}

          <Divider sx={{ marginY: "10px" }} />
          <div className="flex gap-4 text-sm leading-6 px-2">
            <div className="flex gap-2 flex-col text-black">
              <div>Thời gian cập nhật :</div>
              <div className="">Thời hạn phản hồi :</div>
            </div>
            <div className="flex gap-2 flex-col self-start text-stone-500">
              <div>{TimeDateFormatter(noti?.created_at)}</div>
              <div>{TimeDateFormatterAfterXDays(noti?.created_at, 3)}</div>
            </div>
          </div>
          <div className="text-zinc-900 text-sm leading-5 mt-2 px-2">
            Lí do từ chối *
          </div>
          <TextField
            required
            name="description"
            multiline
            onChange={(e) => setReason(e.target.value)}
            value={reason}
            //   placeholder="Nhập lí do từ chối cập nhật..."
            rows={3}
            sx={{
              width: "100%",
              marginY: "10px",
              paddingX: "8px",
            }}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <div className="flex gap-5 justify-center mx-auto my-2">
          <Button
            variant="outlined"
            onClick={() => setReason("")}
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "fit-content",
              padding: "5px 20px",

              borderRadius: "20px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={handleRejectChange}
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
            Từ chối
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default Reject;
