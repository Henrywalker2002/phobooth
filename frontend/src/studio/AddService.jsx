import React, { useEffect, useState } from "react";
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
  Input,
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

function AddService({ serviceInfo, setServiceInfo, categories }) {
  // const categories = ["Gia đình", "Doanh nhân", "Trẻ em", "Đám cưới"];

  const [imgList, setImgList] = useState([]);
  const [open, setOpen] = useState(false);

  // Img List
  const handleUpdateImgList = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files.length > 0) {
      let newList = [...imgList];
      newList.push({
        id: uuidv4(),
        img_preview: URL.createObjectURL(e.target.files[0]),
        img_file: e.target.files[0],
      });
      setImgList(newList);
    }
  };
  const handleDeleteImg = (id) => {
    const newList = imgList.filter((img) => img.id !== id);
    setImgList(newList);
  };

  // service
  const updateServiceInfo = (e) => {
    setServiceInfo({ ...serviceInfo, [e.target.name]: e.target.value });
  };
  console.log(serviceInfo);
  return (
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
                id="outlined-basic"
                variant="outlined"
                name="name"
                onChange={updateServiceInfo}
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
                        id="outlined-basic"
                        variant="outlined"
                        name="min_price"
                        onChange={updateServiceInfo}
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
                        id="outlined-basic"
                        variant="outlined"
                        name="max_price"
                        onChange={updateServiceInfo}
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
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="type"
                        onChange={updateServiceInfo}
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
                id="outlined-select-categories"
                name="category"
                onChange={updateServiceInfo}
                select
                defaultValue=""
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
                    <div className="text-[10px]">(0/5)</div>
                  </div>

                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpdateImgList}
                    sx={{
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
                    src={
                      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                    }
                    // alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    // title="Xem thêm"
                    subtitle="Xem thêm"
                    sx={{ height: "40px" }}
                    actionIcon={
                      <IconButton
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        // aria-label={`info about ${item.title}`}
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
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUpdateImgList}
                          sx={{
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
                        textTransform: "none",
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
          id="outlined-multiline-static"
          name="description"
          onChange={updateServiceInfo}
          multiline
          rows={3}
          sx={{
            width: "730px",
            marginTop: "10px",
          }}
        />
      </div>
    </Paper>
  );
}

export default AddService;
