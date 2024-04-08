import {
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import Reject from "./Reject";

function UpdateHistory() {
  const [openReject, setOpenReject] = useState(false);
  return (
    <Paper
      sx={{
        width: "fit-content",
        minWidth: "350px",
        border: "1px solid #d6d3d1",
      }}
    >
      <div className="flex justify-between items-center px-5 py-3 leading-[150%] max-w-[400px]">
        <div className="text-lg font-semibold text-zinc-800">
          Lịch sử cập nhật
        </div>
        <div className="text-sm text-neutral-600">2 cập nhật</div>
      </div>

      <Divider />

      <List
        sx={{
          width: "fit-content",
          maxWidth: 400,
          bgcolor: "background.paper",
        }}
      >
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt="Studio Demo"
              src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
            />
          </ListItemAvatar>
          <ListItemText>
            <div className="flex-auto my-auto">
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

            <div className="flex gap-2 my-3 text-sm leading-6">
              <div className="flex gap-1 flex-col text-black">
                <div>Thời gian cập nhật :</div>
                <div className="">Thời hạn phản hồi :</div>
              </div>
              <div className="flex gap-1 flex-col self-start text-stone-500">
                <div>17:00 Hôm qua</div>
                <div className="">17:00 Ngày mai</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outlined"
                onClick={() => setOpenReject(true)}
                sx={{
                  textTransform: "none",
                  border: "1px solid #3F41A6",
                  color: "#3F41A6",
                  width: "fit-content",
                  padding: "3px 13px",
                  fontSize: "12px",
                  borderRadius: "20px",
                  "&:hover": {
                    border: "1px solid #3949AB",
                  },
                }}
              >
                Từ chối
              </Button>
            </div>
          </ListItemText>
        </ListItem>
        <Divider component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt="Studio Demo"
              src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
            />
          </ListItemAvatar>
          <ListItemText>
            <div className="flex-auto my-auto">
              <span className="font-semibold text-indigo-800">
                Studio Demo{" "}
              </span>
              <span className="text-neutral-600">bổ sung </span>
              <span className="font-semibold text-zinc-800 ">sản phẩm</span>
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

            <div className="flex gap-2 my-3 text-sm leading-6">
              <div className="flex gap-1 flex-col text-black">
                <div>Thời gian cập nhật :</div>
                <div className="">Thời hạn phản hồi :</div>
              </div>
              <div className="flex gap-1 flex-col self-start text-stone-500">
                <div>17:00 17 tháng 11 2023</div>
                <div className="">17:00 Hôm nay</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setOpenReject(true)}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  border: "1px solid #3F41A6",
                  color: "#3F41A6",
                  width: "fit-content",
                  padding: "3px 13px",
                  fontSize: "12px",
                  borderRadius: "20px",
                  "&:hover": {
                    border: "1px solid #3949AB",
                  },
                }}
              >
                Từ chối
              </Button>
            </div>
          </ListItemText>
        </ListItem>
      </List>

      {/* Reject Dialog */}
      <Reject open={openReject} setOpen={setOpenReject} />
    </Paper>
  );
}

export default UpdateHistory;
