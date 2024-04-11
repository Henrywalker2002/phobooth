import React from "react";
import { Paper, Divider, TextField, Button } from "@mui/material";
import { IoIosSend } from "react-icons/io";

function handleDate(created_at) {
  const date = new Date(created_at);
  return `${date.getDate()} Tháng ${date.getMonth() + 1} ${date.getFullYear()}`
}

function OneComment({ comment }) {
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex gap-5 items-center">
        <div className="text-base font-medium leading-7 text-black">
          {comment.user?.full_name}
        </div>
        <div className="text-sm leading-5 text-neutral-500">
          {handleDate(comment.created_at)}
        </div>
      </div>
      <div className="w-full text-sm leading-5 text-zinc-500">
        {comment.text}
      </div>
      <Divider sx={{ marginTop: "10px" }} />
    </div>
    )
}

function Comment({commentList, setCommentList}) {
  return (
    <div className="flex flex-col gap-5">

      {commentList.map((comment, index) => {
        return <OneComment key={index} comment={comment} />;
      })}

      <Paper
        sx={{
          width: "800px",
          marginX: "auto",
          border: "1px solid #d6d3d1",
        }}
      >
        <div className="flex flex-col p-2.5 bg-white rounded gap-2">
          <TextField
            name="reply"
            multiline
            rows={2}
            placeholder="Để lại nhận xét của bạn..."
            sx={{
              width: "100%",
            }}
          />

          <div className="flex gap-5 justify-end">
            <Button
              variant="contained"
              startIcon={<IoIosSend style={{ fontSize: "18px" }} />}
              sx={{
                textTransform: "none",
                bgcolor: "#3F41A6",
                width: "fit-content",
                padding: "3px 15px",
                borderRadius: "4px",
                "&:hover": {
                  bgcolor: "#3949AB",
                },
              }}
            >
              Gửi
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default Comment;
