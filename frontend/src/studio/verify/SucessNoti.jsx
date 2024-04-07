import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function SucessNoti({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          width: "500px",
        },
      }}
    >
      <DialogContent>Bạn đã gửi yêu cầu xác thực thành công.</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            navigate("/studio/profile");
          }}
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            borderRadius: "20px",
            marginRight: "10px",
          }}
        >
          Quay lại
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SucessNoti;
