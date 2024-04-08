import {
  Dialog,
  IconButton,
  TextField,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Badge,
} from "@mui/material";
import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { v4 as uuidv4 } from "uuid";

function AddImg({ open, setOpen }) {
  const [imgList, setImgList] = useState([]);

  //   image list
  const handleUpdateImgList = (e) => {
    let imgFiles = e.target.files;
    if (imgFiles.length > 0) {
      let newList = [...imgList];
      for (let imgFile of imgFiles) {
        newList.push({
          id: uuidv4(),
          img_preview: URL.createObjectURL(imgFile),
          img_file: imgFile,
        });
      }
      setImgList(newList);
      // console.log(newList);
    }
  };
  const handleDeleteImg = (id) => {
    const newList = imgList.filter((img) => img.id !== id);
    setImgList(newList);
  };
  return (
    <Dialog
      sx={{ minWidth: "400px" }}
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
    >
      <DialogTitle>
        <div className=" shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Thêm hình ảnh
          </div>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <FaXmark />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        dividers={true}
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <form>
          <div className="self-stretch flex items-stretch  gap-[130px]">
            <div className="flex basis-[0%] flex-col items-stretch">
              <div className="text-zinc-900 text-sm leading-5">Tiêu đề *</div>
              <TextField
                required
                variant="outlined"
                name="title"
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "400px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5">Mô tả *</div>
              <TextField
                required
                name="description"
                multiline
                rows={3}
                sx={{
                  width: "400px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5">
                Thành phẩm *
              </div>
              <div className="flex flex-col gap-7 w-full my-3">
                <div className="flex gap-3 items-center">
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={
                      <FileUploadOutlinedIcon
                        sx={{ width: "16px", height: "16px" }}
                      />
                    }
                    sx={{
                      textTransform: "none",
                      border: "1px solid #3F41A6",
                      color: "#3F41A6",
                      width: "fit-content",
                      fontSize: "12px",
                      borderRadius: "5px",
                      padding: "3px 8px",
                      alignSelf: "start",
                      "&:hover": {
                        border: "1px solid #3949AB",
                      },
                    }}
                  >
                    Thêm hình ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleUpdateImgList}
                      style={{
                        clip: "rect(0 0 0 0)",
                        clipPath: "inset(50%)",
                        height: 1,
                        overflow: "hidden",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        whiteSpace: "nowrap",
                        width: 1,
                      }}
                    />
                  </Button>
                  <div className="text-stone-500 text-[13px] leading-6">
                    {imgList.length > 0
                      ? `Đã thêm ${imgList.length} hình`
                      : "Chưa thêm hình nào!"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 max-w-[400px]">
                  {imgList.length > 0
                    ? imgList.map((img, i) => (
                        <Badge
                          key={i}
                          badgeContent={
                            <IconButton onClick={() => handleDeleteImg(img.id)}>
                              <HighlightOffIcon
                                sx={{
                                  color: "#78716C",
                                }}
                              />
                            </IconButton>
                          }
                          sx={{
                            bgcolor: "transparent",
                          }}
                        >
                          <img
                            className="w-[110px] h-[110px]"
                            src={img.img_preview}
                            // alt={item.title}
                            loading="lazy"
                          />
                        </Badge>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <div className="flex gap-5 justify-center mx-auto my-2">
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "fit-content",
              padding: "5px 20px",

              borderRadius: "20px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            type="submit"
            sx={{
              textTransform: "none",
              bgcolor: "#3F41A6",
              width: "fit-content",
              padding: "5px 20px",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#3949AB",
              },
            }}
          >
            Lưu
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default AddImg;
