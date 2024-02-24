import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

function DeleteOrderItem({ open, setOpen, orderItem, setOrder }) {
  const { auth } = useAuth();
  const handleDeleteItem = () => {
    axios
      .delete(`/order-item/${orderItem.id}/`, {
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      })
      .then((res) => {
        setOrder(res.data);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">XÓA SẢN PHẨM</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Bạn có muốn xóa "{orderItem?.item?.name}" khỏi đơn hàng không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Hủy</Button>
        <Button onClick={handleDeleteItem} autoFocus>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteOrderItem;
