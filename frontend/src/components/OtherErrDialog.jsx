import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function OtherErrDialog({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open}>
      <DialogContent>
        Vui lòng thử lại hoặc liên hệ với chúng tôi nếu vấn đề vẫn còn.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            navigate("/");
          }}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            color: "#fff",
          }}
        >
          Quay lại trang chủ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OtherErrDialog;
