import React from "react";
import { Paper, Divider, TextField, Button } from "@mui/material";
import { IoIosSend } from "react-icons/io";

function Comment() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-5 items-center">
          <div className="text-base font-medium leading-7 text-black">
            Scarlet withch
          </div>
          <div className="text-sm leading-5 text-neutral-500">
            6 Tháng 5 2023
          </div>
        </div>
        <div className="w-full text-sm leading-5 text-zinc-500">
          Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet at
          posuere ac, viverra at mauris. Maecenas tincidunt ligula a sem
          vestibulum pharetra. Maecenas auctor tortor lacus, nec laoreet nisi
          porttitor vel.{" "}
        </div>
        <Divider sx={{ marginTop: "10px" }} />
      </div>

      <div className="flex flex-col gap-2 ">
        <div className="flex gap-5 items-center">
          <div className="text-base font-medium leading-7 text-black">
            Golanginya
          </div>
          <div className="text-sm leading-5 text-neutral-500">
            20 Tháng 11 2023
          </div>
        </div>
        <div className="w-full text-sm leading-5 text-zinc-500">
          Antesit mauris elementum sollicitudin arcu sit suspendisse pretium.
          Nisl egestas fringilla justo bibendum.
        </div>
        <Divider sx={{ marginTop: "10px" }} />
      </div>

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
