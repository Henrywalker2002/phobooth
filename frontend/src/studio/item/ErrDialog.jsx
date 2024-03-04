import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";

function ErrDialog({ open, setOpen }) {
  return (
    <Dialog open={open}>
      <DialogContent>
        Vui lòng thử lại hoặc liên hệ với chúng tôi nếu vấn đề vẫn còn.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            color: "#fff",
          }}
        >
          Quay lại
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrDialog;
