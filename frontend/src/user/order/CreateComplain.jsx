import {
  Dialog,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Badge,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { v4 as uuidv4 } from "uuid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CreateComplain({ open, setOpen, order_id }) {
  // local
  const [imgList, setImgList] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const axiosPrivate = useAxiosPrivate();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateComplain = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("order", order_id);
    if (imgList.length > 0) {
      for (let img of imgList) {
        console.log(img);
        data.append("images", img.img_file, img.img_file.name);
      }
    }
    axiosPrivate.post("/complain/", data, {headers : {'Content-Type': 'multipart/form-data'}})
    .then((res) => {
      console.log(res);
      setOpen(false);
    })
    .catch((err) => {
      console.log(err);
    });
  };
  return (
    <Dialog
      sx={{ minWidth: "400px" }}
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
    >
      <form onSubmit={handleCreateComplain}>
      <DialogTitle>
        <div className=" shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Gửi khiếu nại
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
          <div className="self-stretch flex items-stretch  gap-[130px]">
            <div className="flex basis-[0%] flex-col items-stretch">
              <div className="text-zinc-900 text-sm leading-5">Tiêu đề *</div>
              <TextField
                required
                variant="outlined"
                name="title"
                value = {formData.title}
                onChange = {handleChange}
                error={errors.title ? true : false}
                helperText={errors.title ? errors.title : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "400px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5">Loại *</div>
              <TextField
                required
                id="outlined-select-categories"
                name="type"
                value={formData.type}
                onChange={handleChange}
                error={errors.type ? true : false}
                helperText={errors.type ? errors.type : ""}
                defaultValue=""
                select
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                    paddingY: "12px",
                  },
                  width: "400px",
                  marginY: "10px",
                }}
              >
                <MenuItem value="REFUND">Hoàn tiền</MenuItem>
                <MenuItem value="OTHER">Các loại khác</MenuItem>
              </TextField>

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
                value = {formData.description}
                onChange = {handleChange}
                error={errors.description ? true : false}
                helperText={errors.description ? errors.description : ""}
              />

              <div className="text-zinc-900 text-sm leading-5">
                Hình ảnh liên quan 
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
            Gửi khiếu nại
          </Button>
        </div>
      </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateComplain;
