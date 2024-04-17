import React, { useEffect, useState } from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { v4 as uuidv4 } from "uuid";
import { FaXmark } from "react-icons/fa6";
import {
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  Badge,
  DialogContent,
  DialogTitle,
  Rating,
  Alert,
} from "@mui/material";
import { translateType } from "../../util/Translate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function RatingDialog({ open, setOpen, orderItem }) {
  const [imgList, setImgList] = useState([]);
  const [data, setData] = useState({ star: 5 });
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [successRate, setSuccessRate] = useState(false);

  useEffect(() => {
    setData({ star: 5 });
    setImgList([]);
    setError(null);
  }, [open]);
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
    }
  };
  const handleDeleteImg = (id) => {
    const newList = imgList.filter((img) => img.id !== id);
    setImgList(newList);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    let formData = new FormData();
    formData.append("star", data.star);
    formData.append("comment", data.comment);
    for (let img of imgList) {
      formData.append("pictures", img.img_file, img.img_file.name);
    }
    formData.append("order_item", orderItem.id);
    axiosPrivate
      .post("/rate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data);
        setSuccessRate(true);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        var data = err.response.data;
        if (data.order_item) {
          setError("Bạn đã đánh giá sản phẩm này rồi!");
        }
      });
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <div className=" shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
            <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
              Đánh giá
            </div>
            <IconButton
              onClick={() => {
                setImgList([]);
                setOpen(false);
              }}
              sx={{ padding: 0 }}
            >
              <FaXmark />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent
          dividers={true}
          sx={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
          {error ? (
            <Alert severity="error" sx={{ marginBottom: "10px" }}>
              {error}
            </Alert>
          ) : null}
          {successRate ? (
            <Alert
              sx={{ maxWidth: "1000px", marginX: "auto" }}
              severity="success"
              color="success"
            >
              Cảm ơn bạn đã đánh giá sản phẩm!
            </Alert>
          ) : null}
          <div className="min-w-[350px]  bg-white flex flex-col items-stretch rounded-lg border-solid">
            <div className="flex w-full justify-start gap-4 items-center">
              <img
                loading="lazy"
                src={
                  orderItem?.item?.picture
                    ? orderItem?.item?.picture
                    : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                }
                className="aspect-square object-contain object-center w-[60px] h-[60px] rounded-lg overflow-hidden shrink-0 max-w-full"
              />
              <div className=" flex grow basis-[0%] flex-col py-1">
                <div className="justify-center text-yellow-950 text-lg font-semibold">
                  {orderItem?.item?.name}
                </div>
                <div className="min-w-fit z-[1] flex justify-start gap-3 mt-2.5 items-start">
                  <div className="min-w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch  px-2 py-1">
                    {translateType(orderItem?.item?.type)}
                  </div>
                  <div className="min-w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch  px-2 py-1">
                    {orderItem?.item?.category?.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="self-stretch flex items-stretch gap-[130px]">
              <div className="flex basis-[0%] flex-col items-stretch">
                <div className="flex gap-3 items-center my-3">
                  <div className="text-zinc-900 text-sm leading-5">
                    Đánh giá
                  </div>
                  <Rating
                    name="star"
                    precision={1}
                    value={data.star ? data.star : 5}
                    onChange={(event, value) => {
                      setData({ ...data, star: value });
                    }}
                    sx={{ color: "#3F41A6" }}
                  />
                </div>

                <div className="text-zinc-900 text-sm leading-5">Mô tả </div>
                <TextField
                  required
                  name="comment"
                  onChange={handleChange}
                  value={data.comment}
                  multiline
                  rows={3}
                  sx={{
                    width: "380px",
                    marginY: "10px",
                  }}
                />

                <div className="text-zinc-900 text-sm leading-5">Hình ảnh</div>
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
                              <IconButton
                                onClick={() => handleDeleteImg(img.id)}
                              >
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
              Lưu
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RatingDialog;
