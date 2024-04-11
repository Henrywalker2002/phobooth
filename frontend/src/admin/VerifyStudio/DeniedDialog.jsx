import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { FaXmark } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

export default function DeniedDialog(props) {
  const { open, setOpen, id, name } = props;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    status: "REJECTED",
    denied_reason: "denied_reason",
  });

  const sendDenied = async () => {
    await axiosPrivate
      .patch(`/studio-document/${id}/`, payload)
      .then((response) => {
        navigate(`/admin/verify-studio`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Dialog
      sx={{ minWidth: "400px" }}
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
    >
      <DialogTitle>
        <div className=" shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Từ chối xác thực
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
          minWidth: "500px",
        }}
      >
        <div className="flex gap-2 mb-4 ">
          <div className="text-zinc-900 text-base leading-5">Studio : </div>
          <div className="text-sm font-semibold text-indigo-800">{name}</div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="text-zinc-900 text-base leading-5">
            Lí do từ chối *
          </div>
          <TextField
            required
            name="description"
            multiline
            fullWidth
            //   placeholder="Nhập lí do từ chối cập nhật..."
            rows={3}
            sx={{
              width: "100%",
            }}
            onChange={(event) => {
              setPayload({ ...payload, denied_reason: event.target.value });
            }}
          />
        </div>
        <div>
          {/* <Typography>Lý do từ chối: </Typography>
          <TextField
            style={{ width: "500px" }}
            variant="outlined"
            required
            multiline
            rows={4}
            fullWidth
            placeholder="Ghi lý do của bạn"
            onChange={(event) => {
              setPayload({ ...payload, denied_reason: event.target.value });
            }}
          /> */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            border: "1px solid #3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            borderRadius: "20px",
            "&:hover": {
              border: "1px solid #3949AB",
            },
          }}
          onClick={() => {
            setOpen(false);
          }}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
          onClick={() => {
            sendDenied();
            setOpen(false);
          }}
        >
          Từ chối
        </Button>
      </DialogActions>
    </Dialog>
  );
}
