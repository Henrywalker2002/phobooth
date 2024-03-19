import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

function VariationAlert({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          width: "380px",
        },
      }}
    >
      <DialogContent>
        Bạn cần cập nhật giá trị cho Phân loại 1 trước!
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          sx={{
            // textTransform: "none",
            color: "#3F41A6",
            borderRadius: "20px",
            // marginRight: "10px",
          }}
        >
          Quay lại
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VariationAlert;
