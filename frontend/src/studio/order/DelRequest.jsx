import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DelRequest({ open, setOpen, delReq, setOrder, setRequestList }) {
  const axiosPrivate = useAxiosPrivate();

  const handleDelReq = async () => {
    await axiosPrivate
      .delete(`/payment/${delReq.id}/`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
        setRequestList(res.data.payment);

        // setOpenDelSBar(true);
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
        Bạn có muốn xóa yêu cầu thanh toán lần {delReq.no} không?
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
          Hủy
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

export default DelRequest;
