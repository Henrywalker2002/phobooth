import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DelCategory({ open, setOpen, setOpenSBar, category }) {
  const axiosPrivate = useAxiosPrivate();
  const handleDelReq = () => {
    axiosPrivate
      .delete(`/category/${category.code_name}/`)
      .then((res) => {
        console.log(res.data);

        setOpenSBar(true);
      })
      .then(() => setOpen(false))
      .catch((err) => {
        console.log(err);
      });
  };
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
        Bạn có muốn xóa danh mục "{category.title}" không?
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
          onClick={() => handleDelReq()}
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
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DelCategory;
