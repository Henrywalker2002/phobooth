import React from "react";
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

function Reject({ open, setOpen }) {
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
          <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
            <ListItemAvatar>
              <Avatar
                alt="Studio Demo"
                src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
              />
            </ListItemAvatar>
            <ListItemText>
              <div className="flex-auto my-auto text-wrap whitespace-normal pr-5">
                <span className="font-semibold text-indigo-800">
                  Studio Demo{" "}
                </span>
                <span className="text-neutral-600">cập nhật </span>
                <span className="font-semibold text-zinc-800">
                  Thanh trạng thái
                </span>
              </div>

              <div className="flex gap-2 text-indigo-800 leading-[150%] mt-2">
                <div className="w-fit h-7 text-indigo-800 text-sm leading-5 justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                  Đang tiến hành
                </div>
                <EastIcon sx={{ color: "#3F41A6" }} />
                <div className="w-fit h-7 text-indigo-800 text-sm leading-5 justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                  Vận chuyển
                </div>
              </div>
            </ListItemText>
          </ListItem>
          <Divider sx={{ marginY: "10px" }} />
          <div className="flex gap-4 text-sm leading-6 px-2">
            <div className="flex gap-2 flex-col text-black">
              <div>Thời gian cập nhật :</div>
              <div className="">Thời hạn phản hồi :</div>
            </div>
            <div className="flex gap-2 flex-col self-start text-stone-500">
              <div>17:00 Hôm qua</div>
              <div className="">17:00 Ngày mai</div>
            </div>
          </div>
          <div className="text-zinc-900 text-sm leading-5 mt-2 px-2">
            Lí do từ chối *
          </div>
          <TextField
            required
            name="description"
            multiline
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
