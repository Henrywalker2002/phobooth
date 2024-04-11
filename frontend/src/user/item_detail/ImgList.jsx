import React, { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

function ImgList({ pictures }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ImageListItem
        sx={{
          width: "100%",
          height: "120px",
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
          "& .MuiImageListItem-img": {
            height: "120px",
          },
        }}
      >
        <img
          width="98"
          height="105"
          className="rounded-[5px]"
          src={pictures[3]?.picture}
          loading="lazy"
        />
        <ImageListItemBar
          // title="Xem thêm"
          subtitle="Xem thêm"
          sx={{ height: "40px", borderRadius: "5px" }}
          actionIcon={
            <IconButton
              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
              onClick={() => setOpen(true)}
            >
              <FaRegArrowAltCircleRight />
            </IconButton>
          }
        />
      </ImageListItem>

      {/* Dialog Album */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "800px",
            height: "500px",
          },
        }}
      >
        <DialogTitle>Danh sách hình ảnh của sản phẩm</DialogTitle>
        <DialogContent dividers={true}>
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-wrap gap-6">
              {pictures.length > 0
                ? pictures.map((pic, i) => (
                    <img
                      key={i}
                      className="w-[112px] h-[110px]"
                      src={pic?.picture}
                      // alt={item.title}
                      loading="lazy"
                    />
                  ))
                : "No image"}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              // textTransform: "none",
              color: "#3F41A6",
            }}
            onClick={() => setOpen(false)}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ImgList;
