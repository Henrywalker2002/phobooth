import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { translateErrStatusOrder } from "../../util/Translate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CancelInOrders({
  open,
  setOpen,
  row,
  setOrders,
  setStatusMsg,
  setOpenActionSBar,
  setDefaultPage,
}) {
  const axiosPrivate = useAxiosPrivate();

  // Open Status SnackBar Success/Err
  const handleOpenStatusSBar = (msg) => {
    setStatusMsg(translateErrStatusOrder(msg));
    setOpenActionSBar(true);
    setOpen(false);
  };

  const handleActionOrder = () => {
    axiosPrivate
      .patch(`/order/${row.id}/`, {
        status: row.action,
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

            row.action === "CANCELED"
              ? setStatusMsg("Hủy đơn hàng thành công!")
              : setStatusMsg("Hoàn thành đơn hàng thành công!");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .then(() => {
        setOpen(false);
        setOpenActionSBar(true);
        setDefaultPage(1);
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
      <DialogContent>
        Bạn có muốn {row.action === "CANCELED" ? "hủy" : "hoàn thành"} đơn hàng
        #{row.id} không?
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
          onClick={() => handleActionOrder()}
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
          {row.action === "CANCELED" ? "Hủy đơn" : "Hoàn thành"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CancelInOrders;