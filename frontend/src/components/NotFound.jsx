import React from "react";
import err404 from "../assets/404error.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col h-fit w-fit">
        <div className="h-1/2 flex flex-col items-center gap-3">
          <div className="text-4xl text-sky-500 font-bold tracking-wide">
            Rất tiếc, trang này không tồn tại !
          </div>
          <div className="text-2xl text-neutral-500 font-medium">
            Liên kết bạn đã nhấp vào có thể bị hỏng, hoặc trang này có thể đã
            được gỡ bỏ.
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx = {{
              margin: 5
            }}
          >
            Trở về trang chủ
          </Button>
        </div>
        <div className="h-1/2">
          <img src={err404} className="object-contain" />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
