import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { translateErrStatusOrder } from "../util/Translate";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function CancelInOrders({
  open,
  setOpen,
  id,
  setOrders,
  setStatusMsg,
  setOpenCancelSBar,
}) {
  const axiosPrivate = useAxiosPrivate();

  // Open Status SnackBar Success/Err
  const handleOpenStatusSBar = (msg) => {
    setStatusMsg(translateErrStatusOrder(msg));
    setOpenCancelSBar(true);
  };

  const handleCancelOrder = () => {
    axiosPrivate
      .patch(`/order/${id}/`, {
        status: "CANCELED",
      })
      .then((res) => {
        console.log(res.data);
      })
      .then(() => {
        axiosPrivate
          .get("/order/?limit=5&offset=0")
          .then((res) => {
            console.log(res.data);
            setOrders(res?.data.results);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .then(() => {
        setOpen(false);
        setOpenCancelSBar(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.status) {
          handleOpenStatusSBar(err.response.data.status[0]);
        } else {
          handleOpenStatusSBar(err.response.data.detail);
        }
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
      <DialogContent>Bạn có muốn hủy đơn hàng #{id} không?</DialogContent>
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
          onClick={() => handleCancelOrder()}
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
          Hủy đơn
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CancelInOrders;
