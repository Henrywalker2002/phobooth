import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function AddressAlert({ open, setOpen }) {
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
        Bạn cần cập nhật địa chỉ cá nhân trước khi đặt hàng.
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            navigate("/profile");
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
          Hồ sơ cá nhân
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddressAlert;
