import React, { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { validFixedPrice, validRangePrice } from "../../../util/Validation";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ImgAlert from "../../../components/ImgAlert";
import ErrDialog from "../ErrDialog";

function AddService({ categories, setOpenSBar }) {
  const axiosPrivate = useAxiosPrivate();
  // local
  const [imgList, setImgList] = useState([]);
  const [service, setService] = useState({ type: "SERVICE" });
  // dialog
  const [open, setOpen] = useState(false);
  const [openImgAlert, setOpenImgAlert] = useState(false);
  // error
  const [errMsg, setErrMsg] = useState({});
  const [openErr, setOpenErr] = useState(false);

  // reset
  const resetData = () => {
    setService({ type: "SERVICE" });
    setImgList([]);
    setErrMsg({});
  };

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

  // service
  const updateService = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  // check price for service
  const checkPrice = (item) => {
    if (validFixedPrice(item.min_price) && validFixedPrice(item.max_price)) {
      if (!validRangePrice(item.min_price, item.max_price)) {
        setErrMsg({
          ...errMsg,
          min_price: ["Khoảng giá trị không phù hợp!"],
          max_price: ["Khoảng giá trị không phù hợp!"],
        });
        return false;
      }
    } else {
      if (!validFixedPrice(item.min_price))
        setErrMsg({
          ...errMsg,
          min_price: ["Giá trị không hợp lệ!"],
        });
      if (!validFixedPrice(item.max_price))
        setErrMsg({
          ...errMsg,
          max_price: ["Giá trị không hợp lệ!"],
        });
      return false;
    }
    return true;
  };

  // Add Service
  const handleAddItem = async (e) => {
    e.preventDefault();
    // console.log(service);
    // check imgs are existed
    if (imgList.length < 4 || imgList.length > 5) setOpenImgAlert(true);
    else if (checkPrice(service)) {
      // form-data
      let formData = new FormData();

      // pictures into formdata
      let picList = imgList?.map((img) => img.img_file);
      console.log("imgList", imgList);
      console.log("picList", picList);
      for (const pic of picList) {
        formData.append(`pictures`, pic, pic.name);
      }

      // Service info into formdata
      Object.entries(service).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // check info in formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      axiosPrivate
        .post("/item-service/", formData, {
          headers: {
            ...axiosPrivate.defaults.headers,
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          resetData();
          setOpenSBar(true);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 400) {
            setErrMsg({ ...errMsg, ...err.response.data });
          } else {
            setOpenErr(true);
          }
        });
    }
  };
  return (
    <form
      onSubmit={handleAddItem}
      className="forms flex flex-col gap-2 items-center pb-5"
    >
      {/* Thông tin cơ bản */}
      <Paper
        sx={{
          width: "800px",
          margin: "0 auto",
          border: "1px solid #d6d3d1",
          paddingBottom: "20px",
        }}
      >
        <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start ">
          Thông tin cơ bản
        </div>
        <Divider />
        <div className="flex flex-col items-stretch mt-4 px-6 ">
          <div className="gap-5 flex">
            <div className="flex flex-col items-stretch w-[70%]">
              <div className="flex flex-col items-stretch ">
                <div className="text-zinc-900 text-sm leading-5 ">
                  Tên dịch vụ
                </div>
                <TextField
                  required
                  variant="outlined"
                  name="name"
                  value={service.name ? service.name : ""}
                  onChange={updateService}
                  error={errMsg?.name ? true : false}
                  helperText={errMsg?.name ? errMsg.name[0] : ""}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "350px",
                    marginY: "10px",
                  }}
                />
                <div className="gap-5 flex mt-6">
                  <div className="flex flex-col items-stretch w-[60%]">
                    <div className="justify-center items-stretch flex flex-col">
                      <div className="text-zinc-900 text-sm leading-5">
                        Giá tham khảo (VNĐ)
                      </div>
                      <div className="justify-center items-stretch flex gap-2.5 mt-1.5 pr-4">
                        <TextField
                          required
                          variant="outlined"
                          name="min_price"
                          id="min_price"
                          value={service.min_price ? service.min_price : ""}
                          onChange={updateService}
                          error={errMsg?.min_price ? true : false}
                          helperText={
                            errMsg?.min_price ? errMsg.min_price[0] : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              height: "40px",
                              boxSizing: "border-box",
                            },
                            width: "120px",
                            marginY: "10px",
                          }}
                        />
                        <div className="text-black text-sm leading-5 my-auto">
                          -
                        </div>
                        <TextField
                          required
                          variant="outlined"
                          name="max_price"
                          id="max_price"
                          value={service.max_price ? service.max_price : ""}
                          onChange={updateService}
                          error={errMsg?.max_price ? true : false}
                          helperText={
                            errMsg?.max_price ? errMsg.max_price[0] : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              height: "40px",
                              boxSizing: "border-box",
                            },
                            width: "120px",
                            marginY: "10px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch w-[49%] ml-5 max-md:w-full max-md:ml-0">
                    <div className="items-stretch flex grow flex-col max-md:mt-10">
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">
                          <div className="text-zinc-900 text-sm leading-5">
                            Loại dịch vụ
                          </div>
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="type"
                          onChange={updateService}
                          value={service.type}
                          defaultValue="SERVICE"
                        >
                          <FormControlLabel
                            value="SERVICE"
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#3F41A6",
                                  },
                                }}
                              />
                            }
                            label="Dịch vụ chính"
                            sx={{
                              color: "#666",

                              "& .MuiTypography-root": {
                                fontSize: "14px",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="ACCESSORY"
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#3F41A6",
                                  },
                                }}
                              />
                            }
                            label="Dịch vụ hỗ trợ"
                            sx={{
                              color: "#666",

                              "& .MuiTypography-root": {
                                fontSize: "14px",
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[35%] ml-5">
              <div className="flex grow flex-col items-stretch">
                <div className="text-zinc-900 text-sm leading-5">Danh mục</div>
                <TextField
                  required
                  id="outlined-select-categories"
                  name="category"
                  value={service.category ? service.category : ""}
                  onChange={updateService}
                  select
                  defaultValue=""
                  error={errMsg?.category ? true : false}
                  helperText={errMsg?.category ? errMsg.category[0] : ""}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                      paddingY: "12px",
                    },
                    width: "200px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">--Chọn danh mục--</MenuItem>
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>

                <div className="justify-center text-zinc-900 text-sm mt-4">
                  Hình ảnh liên quan
                </div>
                <div className="flex gap-4">
                  <Button
                    component="label"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      border: "1px solid #E0E0E0",
                      color: "#3F41A6",
                      width: "98px",
                      height: "105px",
                      marginTop: "10px",
                      borderRadius: "5px",
                      paddingX: "10px",
                      "&:hover": {
                        border: "2px solid #3949AB",
                      },
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <RiImageAddFill className="w-11 h-11" />
                      <div className="text-[10px] mt-1">Thêm hình ảnh</div>
                      <div className="text-[10px]">({imgList.length}/5)</div>
                    </div>

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

                  <ImageListItem
                    sx={{
                      display: imgList.length > 0 ? "block" : "none",
                      marginTop: "10px",
                      width: "98px",
                      height: "105px",
                      border: "1px solid #E0E0E0",
                      borderRadius: "5px",
                      "& .MuiImageListItem-img": {
                        height: "105px",
                      },
                    }}
                  >
                    <img
                      width="98"
                      height="105"
                      className="rounded-[5px]"
                      src={imgList[0]?.img_preview}
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
                    <DialogTitle>Danh sách hình ảnh liên quan</DialogTitle>
                    <DialogContent dividers={true}>
                      <div className="flex flex-col gap-5 w-full">
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<IoMdImages />}
                          sx={{
                            textTransform: "none",
                            border: "1px solid #3F41A6",
                            color: "#3F41A6",
                            width: "160px",
                            marginBottom: "20px",
                            borderRadius: "20px",
                            alignSelf: "center",
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
                        <div className="flex flex-wrap gap-6">
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
                                          color: "#1A1a1a",
                                        }}
                                      />
                                    </IconButton>
                                  }
                                  sx={{
                                    bgcolor: "transparent",
                                  }}
                                >
                                  <img
                                    className="w-[112px] h-[110px]"
                                    src={img.img_preview}
                                    // alt={item.title}
                                    loading="lazy"
                                  />
                                </Badge>
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
              </div>
            </div>
          </div>
          <div className="text-zinc-900 text-sm leading-5 mt-12 max-md:max-w-full max-md:mt-10">
            Mô tả dịch vụ
          </div>
          <TextField
            required
            name="description"
            value={service.description ? service.description : ""}
            onChange={updateService}
            multiline
            rows={3}
            error={errMsg?.description ? true : false}
            helperText={errMsg?.description ? errMsg.description[0] : ""}
            sx={{
              width: "730px",
              marginTop: "10px",
            }}
          />
        </div>
      </Paper>

      {/* Img Alert Dialog */}
      <ImgAlert
        open={openImgAlert}
        setOpen={setOpenImgAlert}
        setAddImg={setOpen}
      />

      {/* Other errors */}
      <ErrDialog open={openErr} setOpen={setOpenErr} />

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4 my-2 self-center">
        <Button
          variant="outlined"
          onClick={() => resetData()}
          sx={{
            textTransform: "none",
            border: "1px solid #3F41A6",
            color: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",

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
          type="submit"
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>
    </form>
  );
}

export default AddService;
