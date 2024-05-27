import React from "react";
import { Paper, Divider } from "@mui/material";
import { convertRole, convertTime } from "../admin/complains/helpFunction";
import avatar from "../assets/avatar.png";

export default function ResponseText({ reply }) {
  return (
    <Paper
      sx={{
        width: "100%",
        marginX: "auto",
        border: "1px solid #d6d3d1",
      }}
      key={reply.id}
    >
      <div className="flex flex-col px-10 py-5 bg-white rounded ">
        <div className="flex items-center justify-between w-full ">
          <div className="flex gap-4">
            <img
              loading="lazy"
              srcSet={reply.user?.avatar ?? avatar}
              className="w-11 h-11 rounded-full "
            />
            <div className="flex flex-col justify-around">
              <div className="text-base tracking-wider text-black">
                {reply.user?.full_name}
              </div>
              <div className="text-sm font-medium tracking-wide text-indigo-800">
                {convertRole(reply.user?.role)}
              </div>
            </div>
          </div>
          <div className=" text-xs font-semibold tracking-wide text-indigo-800">
            {convertTime(reply.created_at)}
          </div>
        </div>
        <Divider sx={{ marginY: "10px" }} />

        <div className="text-sm leading-6 text-black">{reply.text}</div>
      </div>
    </Paper>
  );
}
