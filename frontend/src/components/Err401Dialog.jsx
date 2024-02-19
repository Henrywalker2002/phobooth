import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Err401Dialog({ open, setOpen }) {
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
      <DialogContent>
        Bạn cần đăng nhập để thực hiện chức năng này.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            navigate("/");
          }}
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            borderRadius: "20px",
            marginRight: "10px",
          }}
        >
          Quay lại trang chủ
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            navigate("/login");
          }}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            color: "#fff",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Đăng nhập
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Err401Dialog;
