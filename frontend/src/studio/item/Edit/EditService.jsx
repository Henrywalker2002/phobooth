import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ImgAlert from "../../../components/ImgAlert";
import { validFixedPrice, validRangePrice } from "../../../util/Validation";
import ErrDialog from "../ErrDialog";

function EditService({ id, setOpenSBar, categories }) {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [service, setService] = useState({});
  const [newInfo, setNewInfo] = useState({});
  // dialog
  const [openImg, setOpenImg] = useState(false);
  const [openImgAlert, setOpenImgAlert] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  // img
  const [imgList, setImgList] = useState([]);
  const [newImgList, setNewImgList] = useState([]);
  const [delImgList, setDelImgList] = useState([]);
  // err
  const [errMsg, setErrMsg] = useState({});

  // get detail item
  useEffect(() => {
    axiosPrivate
      .get(`/item-service/${id}/`)
      .then((res) => {
        console.log(res.data);
        setService(res.data);
        setImgList(res.data.pictures);
        setNewInfo({
          category: res.data.category?.id,
          type: res.data.type,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // service
  const updateService = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  // ImgList
  // Add img into new img list
  const handleAddImgList = (e) => {
    let imgFiles = e.target.files;
    if (imgFiles.length > 0) {
      let newList = [...newImgList];
      for (let imgFile of imgFiles) {
        newList.push({
          id: uuidv4(),
          img_preview: URL.createObjectURL(imgFile),
          img_file: imgFile,
        });
      }
      setNewImgList(newList);
    }
  };

  // delete img in new list
  const handleDeleteNewImg = (id) => {
    const newList = newImgList.filter((img) => img.id !== id);
    setNewImgList(newList);
  };

  // delete img in old list
  const handleDeleteImg = (id) => {
    const newList = imgList.filter((img) => img.id !== id);
    let delIdList = [...delImgList];
    delIdList.push(id);
    setImgList(newList);
    setDelImgList(delIdList);
  };

  // check price for service
  const checkPrice = (item) => {
    if (item.min_price && item.max_price) {
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
    }

    return true;
  };

  //Edit item
  const handleEditItem = async (e) => {
    e.preventDefault();
    // console.log(updateInfo);
    console.log(imgList, newImgList, delImgList);

    let imgCount = imgList.length + newImgList.length;
    if (imgCount < 4 || imgCount > 5) setOpenImgAlert(true);
    else if (checkPrice(newInfo)) {
      let updatedFlag = false;
      // add new img list
      if (newImgList.length > 0) {
        for await (const img of newImgList) {
          // form-data
          let formData = new FormData();
          formData.append(`picture`, img.img_file, img.img_file.name);
          formData.append("item", id);

          await axiosPrivate
            .post("/item-picture/", formData, {
              headers: {
                ...axiosPrivate.defaults.headers,
                "content-type": "multipart/form-data",
              },
            })
            .then((res) => {
              console.log(res.data);
              updatedFlag = true;
            })
            .catch((err) => {
              updatedFlag = false;
              setOpenErr(true);
              console.log(err);
            });
        }
      }

      // delete img list
      if (delImgList.length > 0) {
        for await (let delId of delImgList) {
          console.log(delId);
          await axiosPrivate
            .delete(`/item-picture/${delId}/`)
            .then((res) => {
              console.log(res.data);
              updatedFlag = true;
            })
            .catch((err) => {
              updatedFlag = false;
              setOpenErr(true);
              console.log(err);
            });
        }
      }

      // update other infos
      if (Object.keys(newInfo).length > 0) {
        await axiosPrivate
          .patch(`/item-service/${id}/`, newInfo)
          .then((res) => {
            updatedFlag = true;
          })
          .catch((err) => {
            updatedFlag = false;
            if (err.response?.status === 400) {
              setErrMsg({ ...errMsg, ...err.response.data });
            } else {
              setOpenErr(true);
            }
          });
      }

      // Successful Notice + setup all product info
      if (updatedFlag) {
        await axiosPrivate
          .get(`/item-service/${id}/`)
          .then((res) => {
            console.log(res.data);
            setService(res.data);

            setNewInfo({
              category: res.data.category?.id,
              type: res.data.type,
            });
            setImgList(res.data.pictures);
            setDelImgList([]);
            setNewImgList([]);
            setErrMsg({});
            setOpenSBar(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <form
      onSubmit={handleEditItem}
      className="forms flex flex-col gap-5 items-center pb-5"
    >
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
                  value={newInfo?.name ? newInfo?.name : service?.name}
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
                        Giá đơn vị (VNĐ)
                      </div>
                      <div className="justify-center items-stretch flex gap-2.5 mt-1.5 pr-4">
                        <TextField
                          required
                          variant="outlined"
                          name="min_price"
                          value={
                            newInfo?.min_price
                              ? newInfo?.min_price
                              : service?.min_price
                          }
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
                          value={newInfo?.max_price ?? service?.max_price ?? ""}
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
                          value={
                            newInfo?.type
                              ? newInfo?.type
                              : service?.type ?? null
                          }
                          // defaultValue="SERVICE"
                        >
                          <FormControlLabel
                            value="SERVICE"
                            // checked={newInfo?.type === "SERVICE" ? true : false}
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
                            // checked={newInfo?.type === "ACCESSORY" ? true : false}
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
                  value={
                    newInfo.category
                      ? newInfo.category
                      : service.category?.id ?? ""
                  }
                  onChange={updateService}
                  select
                  defaultValue={""}
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
                  <MenuItem value={""}>--Chọn danh mục--</MenuItem>
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Phần hình ảnh liên quan */}
                <div className="flex flex-col items-stretch text-sm text-zinc-900 max-md:mt-10">
                  <div className="justify-center">Hình ảnh liên quan</div>
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
                        <div className="text-[10px]">
                          ({imgList.length + newImgList.length}/5)
                        </div>
                      </div>

                      <input
                        type="file"
                        id="file-input"
                        name="file-input"
                        multiple
                        accept="image/*"
                        onChange={handleAddImgList}
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
                        display:
                          imgList.length > 0 || newImgList.length > 0
                            ? "block"
                            : "none",
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
                        // alt={item.title}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        // title="Xem thêm"
                        subtitle="Xem thêm"
                        sx={{ height: "40px", borderRadius: "5px" }}
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            // aria-label={`info about ${item.title}`}
                            onClick={() => setOpenImg(true)}
                          >
                            <FaRegArrowAltCircleRight />
                          </IconButton>
                        }
                      />
                    </ImageListItem>

                    {/* Dialog Album */}
                    <Dialog
                      open={openImg}
                      onClose={() => setOpenImg(false)}
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
                              id="file-input"
                              name="file-input"
                              multiple
                              accept="image/*"
                              onChange={handleAddImgList}
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

                          {imgList?.length > 0 || newImgList?.length > 0 ? (
                            <div className="flex flex-wrap gap-6">
                              {/* Old list */}
                              {imgList?.map((img, i) => (
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
                                    src={img.picture}
                                    // alt={item.title}
                                    loading="lazy"
                                  />
                                </Badge>
                              ))}
                              {/* New List */}
                              {newImgList?.map((img, i) => (
                                <Badge
                                  key={i}
                                  badgeContent={
                                    <IconButton
                                      onClick={() => handleDeleteNewImg(img.id)}
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
                              ))}
                            </div>
                          ) : (
                            "No image"
                          )}
                        </div>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          sx={{
                            // textTransform: "none",
                            color: "#3F41A6",
                          }}
                          onClick={() => setOpenImg(false)}
                        >
                          Đóng
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
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
            value={
              newInfo?.description ? newInfo?.description : service?.description
            }
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
        setAddImg={setOpenImg}
      />

      {/* Other errors */}
      <ErrDialog open={openErr} setOpen={setOpenErr} />

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4  self-center">
        <Button
          variant="outlined"
          onClick={() => {
            setService({});
            navigate("/studio/items", { replace: true });
          }}
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
          Quay lại
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
          Lưu thông tin
        </Button>
      </div>
    </form>
  );
}

export default EditService;
