import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

function ImgAlert({ open, setOpen, setAddImg }) {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          width: "900px",
        },
      }}
    >
      <DialogContent>
        Bạn cần cập nhật đủ hình ảnh minh họa cho sản phẩm (tối thiểu 4 hình,
        tối đa 10 hình).
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          sx={{
            // textTransform: "none",
            color: "#3F41A6",
            borderRadius: "20px",
            marginRight: "10px",
          }}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            setAddImg(true);
          }}
          sx={{
            // textTransform: "none",
            bgcolor: "#3F41A6",
            color: "#fff",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Danh sách hình ảnh
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImgAlert;
