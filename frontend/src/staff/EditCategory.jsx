import {
  Dialog,
  IconButton,
  TextField,
  Button,
  MenuItem,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { translateErrCategory } from "../util/Translate";

function EditCategory({ open, setOpen, setOpenSBar, category }) {
  // global
  const axiosPrivate = useAxiosPrivate();
  // local
  const [newCategory, setNewCategory] = useState({});
  // err
  const [errMsg, setErrMsg] = useState({});

  const handleChangeCategory = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleEditCategory = () => {
    console.log(newCategory);
    if (Object.keys(newCategory).length > 0) {
      axiosPrivate
        .patch(`/category/${category.code_name}/`, newCategory)
        .then((res) => {
          console.log(res);
          setOpen(false);
          setOpenSBar(true);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 400) {
            let newErr = translateErrCategory(err.response.data);
            setErrMsg({ ...errMsg, ...newErr });
          }
        });
    }
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
            Cập nhật danh mục
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
              <div className="text-zinc-900 text-sm leading-5">
                Tên danh mục *
              </div>
              <TextField
                required
                variant="outlined"
                name="title"
                onChange={handleChangeCategory}
                defaultValue={category?.title}
                error={errMsg.title ? true : false}
                helperText={errMsg.title ? errMsg.title[0] : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "400px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5">Phân loại *</div>
              <TextField
                required
                id="outlined-select-categories"
                name="type"
                //   value={service.category ? service.category : ""}
                onChange={handleChangeCategory}
                defaultValue={category?.type}
                error={errMsg.type ? true : false}
                helperText={errMsg.type ? errMsg.type[0] : ""}
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
                <MenuItem value="">--Chọn loại--</MenuItem>
                <MenuItem value="SERVICE">Dịch vụ</MenuItem>
                <MenuItem value="PRODUCT">Hàng hóa</MenuItem>
              </TextField>

              <div className="text-zinc-900 text-sm leading-5">Mô tả *</div>
              <TextField
                required
                name="description"
                multiline
                rows={3}
                onChange={handleChangeCategory}
                defaultValue={category?.description}
                error={errMsg.description ? true : false}
                helperText={errMsg.description ? errMsg.description[0] : ""}
                sx={{
                  width: "400px",
                  marginY: "10px",
                }}
              />
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
            Hủy thông tin
          </Button>

          <Button
            variant="contained"
            onClick={handleEditCategory}
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
            Thêm danh mục
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default EditCategory;
