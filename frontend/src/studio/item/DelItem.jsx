import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function DelItem({ open, setOpen, item, setOpenDelSBar, reset, setReset }) {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  let slug;
  if (item?.type === "SERVICE_PACK") slug = "/item-service-pack/";
  else if (item?.type === "PRODUCT") slug = "/item-product/";
  else slug = "/item-service/";

  const delItem = async () => {
    await axiosPrivate
      .delete(`${slug}${item.id}/`)
      .then((res) => {
        // console.log(res.data);
        setOpen(false);
        setOpenDelSBar(true);
        setReset(!reset);
        navigate("/studio/items");
      })
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
        Bạn có muốn xóa sản phẩm "{item?.name}" không?
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
          onClick={() => delItem()}
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

export default DelItem;
