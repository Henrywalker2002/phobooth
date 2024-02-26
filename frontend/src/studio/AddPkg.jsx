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
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import { IoMdImages } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

import AddItemForPkg from "./AddItemForPkg";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function AddPkg({
  pkgInfo,
  setPkgInfo,
  categories,
  setPicList,
  reset,
  setReset,
  errMsg,
  addImgFlag,
  setAddImgFlag,
}) {
  // global
  const axiosPrivate = useAxiosPrivate();

  // navigation
  const [open, setOpen] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);

  // local
  const [imgList, setImgList] = useState([]);
  const [serviceList, setServiceList] = useState({});
  const [accsList, setAccsList] = useState({});
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState({});

  // reset
  useEffect(() => {
    if (reset) {
      setImgList([]);
      setServiceList({ ...serviceList, selected: [] });
      setAccsList({ ...serviceList, selected: [] });
      setProductList({ ...serviceList, selected: [] });
      setTotalPrice({});
      setReset(false);
    }
  }, [reset]);

  // Image List
  useEffect(() => {
    let picList = imgList?.map((img) => img.img_file);
    setPicList(picList);
  }, [imgList]);

  const handleUpdateImgList = (e) => {
    // console.log(e.target.files[0]);
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

  // selection list
  useEffect(() => {
    axiosPrivate
      .get("/item-service/")
      .then((res) => {
        // console.log(res.data.results);
        setServiceList({
          ...serviceList,
          selectList: res.data.results.filter(
            (item) => item.type === "SERVICE"
          ),
        });
        setAccsList({
          ...accsList,
          selectList: res.data.results.filter(
            (item) => item.type === "ACCESSORY"
          ),
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axiosPrivate
      .get("/item-product/")
      .then((res) => {
        // console.log(res.data.results);
        setProductList({ ...productList, selectList: res.data.results });
      })
      .catch((err) => console.log(err));
  }, []);

  // pkg
  const updatePkgInfo = (e) => {
    setPkgInfo({ ...pkgInfo, [e.target.name]: e.target.value });
  };

  // get price
  const getPrice = (list1, list2, list3) => {
    // reduce
    let fixed_price = list3.reduce(
      (total, item) => total + Number(item.fixed_price),
      0
    );
    let min_price =
      list1.reduce((total, item) => total + Number(item.min_price), 0) +
      list2.reduce((total, item) => total + Number(item.min_price), 0) +
      fixed_price;
    let max_price =
      list1.reduce((total, item) => total + Number(item.max_price), 0) +
      list2.reduce((total, item) => total + Number(item.max_price), 0) +
      fixed_price;
    // console.log(fixed_price, min_price, max_price);
    setTotalPrice({ min_price, max_price });
  };

  // item list for package
  useEffect(() => {
    let list1 = serviceList.selected ? serviceList.selected : [];
    let list2 = accsList.selected ? accsList.selected : [];
    let list3 = productList.selected ? productList.selected : [];
    getPrice(list1, list2, list3);
    let itemList = [...list1, ...list2, ...list3];
    let idList = itemList.map((item) => item.id);
    setPkgInfo({ ...pkgInfo, item: idList });
  }, [serviceList.selected, accsList.selected, productList.selected]);

  const removeSelected = (id, typ) => {
    if (typ === "SERVICE") {
      const newList = serviceList.selected.filter((item) => item.id !== id);
      setServiceList({ ...serviceList, selected: newList });
    } else if (typ === "ACCESSORY") {
      const newList = accsList.selected.filter((item) => item.id !== id);
      setAccsList({ ...accsList, selected: newList });
    } else {
      const newList = productList.selected.filter((item) => item.id !== id);
      setProductList({ ...productList, selected: newList });
    }
  };

  // console.log(pkgInfo, productList);

  return (
    <Paper
      sx={{
        width: "800px",
        margin: "10px auto",
        border: "1px solid #d6d3d1",
        paddingBottom: "20px",
      }}
    >
      <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start ">
        Thông tin cơ bản
      </div>
      <Divider />
      <div className="flex flex-col items-stretch px-6 mt-6 ">
        <div className="flex gap-5 ">
          <div className="flex flex-col items-stretch w-[60%] ">
            <div className="flex flex-col grow items-stretch">
              <div className="text-sm leading-5 text-zinc-900 max-md:max-w-full">
                Tên gói dịch vụ
              </div>
              <TextField
                required
                variant="outlined"
                name="name"
                value={pkgInfo.name ? pkgInfo.name : ""}
                onChange={updatePkgInfo}
                error={errMsg.pkg?.name ? true : false}
                helperText={errMsg.pkg?.name ? errMsg.pkg.name[0] : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "400px",
                  marginY: "10px",
                }}
              />

              <div className="text-sm leading-5 text-zinc-900">Danh mục</div>
              <TextField
                required
                id="outlined-select-categories"
                name="category"
                value={pkgInfo.category ? pkgInfo.category : ""}
                onChange={updatePkgInfo}
                defaultValue=""
                select
                error={errMsg.pkg?.category ? true : false}
                helperText={errMsg.pkg?.category ? errMsg.pkg.category[0] : ""}
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
                <MenuItem value="">--Chọn danh mục--</MenuItem>
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className="flex flex-col items-stretch ml-5 w-[40%] max-md:ml-0 max-md:w-full">
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
                    <div className="text-[10px]">({imgList.length}/10)</div>
                  </div>

                  <Input
                    required
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
                        onClick={() => setOpen(true)}
                      >
                        <FaRegArrowAltCircleRight />
                      </IconButton>
                    }
                  />
                </ImageListItem>

                {/* Dialog Album */}
                <Dialog
                  open={addImgFlag ? addImgFlag : open}
                  onClose={() => {
                    setOpen(false);
                    setAddImgFlag(false);
                  }}
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
                        // textTransform: "none",
                        color: "#3F41A6",
                      }}
                      onClick={() => {
                        setOpen(false);
                        setAddImgFlag(false);
                      }}
                    >
                      Đóng
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
          Mô tả gói dịch vụ
        </div>
        <TextField
          required
          id="outlined-multiline-static"
          name="description"
          value={pkgInfo.description ? pkgInfo.description : ""}
          onChange={updatePkgInfo}
          multiline
          rows={3}
          error={errMsg.pkg?.description ? true : false}
          helperText={errMsg.pkg?.description ? errMsg.pkg.description[0] : ""}
          sx={{
            width: "750px",
            marginTop: "10px",
          }}
        />
        <div className="mt-8 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:items-stretch">
            {/* Dich vu chinh */}
            <div className="flex flex-col items-stretch w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-stretch leading-[150%] max-md:mt-10">
                <div className="justify-center text-sm text-zinc-900">
                  Các dịch vụ chính
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {serviceList.selected?.map((service) => (
                    <Paper
                      key={service.id}
                      className="flex flex-col items-stretch p-2.5 w-full rounded-lg"
                      sx={{
                        border: "1px solid #d6d3d1",
                      }}
                    >
                      <div className="flex gap-5 justify-between items-stretch text-sm font-medium text-zinc-500">
                        <div className="flex-auto">{service.name}</div>
                        <IconButton
                          sx={{
                            padding: 0,
                            border: "0.5px solid #d6d3d1",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={() => removeSelected(service.id, "SERVICE")}
                        >
                          <ClearIcon
                            sx={{
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </IconButton>
                      </div>
                      <div className="flex justify-between items-stretch mt-3 text-indigo-800 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className=" text-xs text-zinc-500">
                            Danh mục :
                          </div>
                          <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                            {service.category.title}
                          </div>
                        </div>
                        <div className="my-auto text-lg font-semibold leading-4">
                          {service.min_price} - {service.max_price}
                        </div>
                      </div>
                    </Paper>
                  ))}
                </div>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog1(true)}
                  sx={{
                    textTransform: "none",
                    border: "1px solid #3F41A6",
                    color: "#3F41A6",
                    marginTop: "16px",
                    borderRadius: "4px",
                    "&:hover": {
                      border: "1px solid #3949AB",
                      bgcolor: "#E2E5FF",
                    },
                  }}
                >
                  Thêm dịch vụ
                </Button>

                {/* Dialog thêm dịch vụ chính */}
                <AddItemForPkg
                  open={openDialog1}
                  setOpen={setOpenDialog1}
                  type="SERVICE"
                  itemList={serviceList}
                  setItemList={setServiceList}
                />
              </div>
            </div>

            {/* Dich vu ho tro */}
            <div className="flex flex-col items-stretch ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-stretch leading-[150%] max-md:mt-10">
                <div className="justify-center text-sm text-zinc-900">
                  Các dịch vụ hỗ trợ
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {accsList.selected?.map((service) => (
                    <Paper
                      key={service.id}
                      className="flex flex-col items-stretch p-2.5 mt-3 w-full rounded-lg"
                      sx={{
                        border: "1px solid #d6d3d1",
                      }}
                    >
                      <div className="flex gap-5 justify-between items-stretch text-sm font-medium text-zinc-500">
                        <div className="flex-auto">{service.name}</div>
                        <IconButton
                          sx={{
                            padding: 0,
                            border: "0.5px solid #d6d3d1",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={() =>
                            removeSelected(service.id, "ACCESSORY")
                          }
                        >
                          <ClearIcon
                            sx={{
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </IconButton>
                      </div>
                      <div className="flex justify-between items-stretch mt-3 text-indigo-800 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className=" text-xs text-zinc-500">
                            Danh mục :
                          </div>
                          <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                            {service.category.title}
                          </div>
                        </div>
                        <div className="my-auto text-lg font-semibold leading-4">
                          {service.min_price} - {service.max_price}
                        </div>
                      </div>
                    </Paper>
                  ))}
                </div>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog2(true)}
                  sx={{
                    textTransform: "none",
                    border: "1px solid #3F41A6",
                    color: "#3F41A6",
                    marginTop: "16px",
                    borderRadius: "4px",
                    "&:hover": {
                      border: "1px solid #3949AB",
                      bgcolor: "#E2E5FF",
                    },
                  }}
                >
                  Thêm dịch vụ
                </Button>

                {/* Dialog thêm dịch vụ hỗ trợ */}

                <AddItemForPkg
                  open={openDialog2}
                  setOpen={setOpenDialog2}
                  type="ACCESSORY"
                  itemList={accsList}
                  setItemList={setAccsList}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-9 flex gap-10 ">
          {/* Hàng hóa */}
          <div className="flex flex-col items-stretch w-6/12 ">
            <div className="flex flex-col grow items-stretch leading-[150%] ">
              <div className="justify-center text-sm text-zinc-900">
                Các hàng hóa
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {productList.selected?.map((product) => (
                  <Paper
                    key={product.id}
                    className="flex flex-col items-stretch p-2.5 mt-3 w-full rounded-lg"
                    sx={{
                      border: "1px solid #d6d3d1",
                    }}
                  >
                    <div className="flex gap-5 justify-between items-stretch text-sm font-medium text-zinc-500">
                      <div className="flex-auto">{product.name}</div>
                      <IconButton
                        sx={{
                          padding: 0,
                          border: "0.5px solid #d6d3d1",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                        }}
                        onClick={() => removeSelected(product.id, "PRODUCT")}
                      >
                        <ClearIcon
                          sx={{
                            width: "15px",
                            height: "15px",
                          }}
                        />
                      </IconButton>
                    </div>
                    <div className="flex justify-between items-stretch mt-3 text-indigo-800 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className=" text-xs text-zinc-500">Danh mục :</div>
                        <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                          {product.category.title}
                        </div>
                      </div>
                      <div className="my-auto text-lg font-semibold leading-4">
                        {product.fixed_price}
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog3(true)}
                sx={{
                  textTransform: "none",
                  border: "1px solid #3F41A6",
                  color: "#3F41A6",
                  marginTop: "16px",
                  borderRadius: "4px",
                  "&:hover": {
                    border: "1px solid #3949AB",
                    bgcolor: "#E2E5FF",
                  },
                }}
              >
                Thêm hàng hóa
              </Button>

              {/* Dialog thêm hàng hóa */}
              <AddItemForPkg
                open={openDialog3}
                setOpen={setOpenDialog3}
                type="PRODUCT"
                itemList={productList}
                setItemList={setProductList}
              />
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="flex flex-col items-stretch w-6/12">
            <div className="justify-center text-sm text-zinc-900">
              Giá tham khảo toàn bộ gói dịch vụ
            </div>
            <div className="justify-start items-stretch flex gap-5">
              <TextField
                required
                variant="outlined"
                name="min_price"
                value={pkgInfo.min_price ? pkgInfo.min_price : ""}
                placeholder={totalPrice.min_price ? totalPrice.min_price : 0}
                onChange={updatePkgInfo}
                error={errMsg.pkg?.min_price ? true : false}
                helperText={
                  errMsg.pkg?.min_price ? errMsg.pkg.min_price[0] : ""
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
              <div className="text-black text-sm leading-5 my-auto">-</div>
              <TextField
                required
                variant="outlined"
                name="max_price"
                value={pkgInfo.max_price ? pkgInfo.max_price : ""}
                placeholder={totalPrice.max_price ? totalPrice.max_price : 0}
                onChange={updatePkgInfo}
                error={errMsg.pkg?.max_price ? true : false}
                helperText={
                  errMsg.pkg?.max_price ? errMsg.pkg.max_price[0] : ""
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
      </div>
    </Paper>
  );
}

export default AddPkg;
