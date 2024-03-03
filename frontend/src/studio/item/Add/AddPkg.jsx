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
  InputAdornment,
} from "@mui/material";
import { IoMdImages } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

import AddItemForPkg from "./AddItemForPkg";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ImgAlert from "../../../components/ImgAlert";
import { validFixedPrice, validRangePrice } from "../../../util/Validation";
import OtherErrDialog from "../../../components/OtherErrDialog";

function AddPkg({ categories, setOpenSBar }) {
  // global
  const axiosPrivate = useAxiosPrivate();

  // navigation
  const [open, setOpen] = useState(false);
  const [openImgAlert, setOpenImgAlert] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);

  // local
  const [imgList, setImgList] = useState([]);
  const [pkg, setPkg] = useState({});
  const [serviceList, setServiceList] = useState([]);
  const [accsList, setAccsList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  // error
  const [errMsg, setErrMsg] = useState({});
  const [openOtherErr, setOpenOtherErr] = useState(false);

  // reset
  const resetData = () => {
    setPkg({});
    setImgList([]);
    setServiceList([]);
    setAccsList([]);
    setProductList([]);
    setTotalPrice({});
    setErrMsg({});
  };

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

  // pkg
  const updatePkg = (e) => {
    setPkg({ ...pkg, [e.target.name]: e.target.value });
  };

  // get total price
  const getPrice = (services, accs, products) => {
    // reduce
    let fixed_price = products.reduce(
      (total, item) => total + Number(item.fixed_price),
      0
    );
    let min_price =
      services.reduce((total, item) => total + Number(item.min_price), 0) +
      accs.reduce((total, item) => total + Number(item.min_price), 0) +
      fixed_price;
    let max_price =
      services.reduce((total, item) => total + Number(item.max_price), 0) +
      accs.reduce((total, item) => total + Number(item.max_price), 0) +
      fixed_price;
    // console.log(fixed_price, min_price, max_price);
    setTotalPrice({ min_price, max_price });
  };

  // update for item list (total price (placeholder) + list)
  useEffect(() => {
    let services = serviceList ?? [];
    let accs = accsList ?? [];
    let products = productList ?? [];
    // price
    getPrice(services, accs, products);
    // itemlist
    let itemList = services.concat(accs, products);
    let idList = itemList.map((item) => item.id);
    setPkg({ ...pkg, item: idList });
  }, [serviceList, accsList, productList]);

  // remove selected item
  const removeSelected = (id, typ) => {
    if (typ === "SERVICE") {
      const newList = serviceList.filter((item) => item.id !== id);
      setServiceList(newList);
    } else if (typ === "ACCESSORY") {
      const newList = accsList.filter((item) => item.id !== id);
      setAccsList(newList);
    } else {
      const newList = productList.filter((item) => item.id !== id);
      setProductList(newList);
    }
  };

  // Check price for pkg
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

  // Add Pkg
  const handleAddItem = async (e) => {
    e.preventDefault();
    // check imgs are existed
    if (imgList.length < 4 || imgList.length > 10) setOpenImgAlert(true);
    else if (checkPrice(pkg)) {
      console.log(pkg);
      // form-data
      let formData = new FormData();

      // pictures into formdata
      let picList = imgList?.map((img) => img.img_file);
      for (const picKey in picList) {
        formData.append(
          `pictures[${picKey}]`,
          picList[picKey],
          picList[picKey].name
        );
      }

      // Pkg info into formdata
      Object.entries(pkg).forEach(([key, value]) => {
        if (key == "item") {
          for (const item of pkg.item) {
            formData.append("item", item);
          }
        } else {
          formData.append(key, value);
        }
      });

      // check info in formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      axiosPrivate
        .post("/item-service-pack/", formData, {
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
        });
    }
  };

  return (
    <form
      onSubmit={handleAddItem}
      className="forms flex flex-col gap-5 items-center pb-5"
    >
      {/* Thông tin cơ bản */}
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
                  value={pkg.name ? pkg.name : ""}
                  onChange={updatePkg}
                  error={errMsg?.name ? true : false}
                  helperText={errMsg?.name ? errMsg.name[0] : ""}
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
                  value={pkg.category ? pkg.category : ""}
                  onChange={updatePkg}
                  defaultValue=""
                  select
                  error={errMsg?.category ? true : false}
                  helperText={errMsg?.category ? errMsg.category[0] : ""}
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
          <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
            Mô tả gói dịch vụ
          </div>
          <TextField
            required
            id="outlined-multiline-static"
            name="description"
            value={pkg.description ? pkg.description : ""}
            onChange={updatePkg}
            multiline
            rows={3}
            error={errMsg?.description ? true : false}
            helperText={errMsg?.description ? errMsg.description[0] : ""}
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
                    {serviceList?.map((service) => (
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
                            onClick={() =>
                              removeSelected(service.id, "SERVICE")
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
                              {service.category?.title}
                            </div>
                          </div>
                          <div className="my-auto text-lg font-semibold leading-4">
                            {service.min_price} - {service.max_price}
                          </div>
                        </div>
                      </Paper>
                    ))}

                    {/* Add Btn */}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog1(true)}
                      sx={{
                        textTransform: "none",
                        border: "1px solid #3F41A6",
                        color: "#3F41A6",
                        borderRadius: "4px",
                        "&:hover": {
                          border: "1px solid #3949AB",
                          bgcolor: "#E2E5FF",
                        },
                      }}
                    >
                      Thêm dịch vụ
                    </Button>
                  </div>

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
                    {accsList?.map((service) => (
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
                              {service.category?.title}
                            </div>
                          </div>
                          <div className="my-auto text-lg font-semibold leading-4">
                            {service.min_price} - {service.max_price}
                          </div>
                        </div>
                      </Paper>
                    ))}

                    {/* Add Btn */}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog2(true)}
                      sx={{
                        textTransform: "none",
                        border: "1px solid #3F41A6",
                        color: "#3F41A6",

                        borderRadius: "4px",
                        "&:hover": {
                          border: "1px solid #3949AB",
                          bgcolor: "#E2E5FF",
                        },
                      }}
                    >
                      Thêm dịch vụ
                    </Button>
                  </div>

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
                  {productList?.map((product) => (
                    <Paper
                      key={product.id}
                      className="flex flex-col items-stretch p-2.5 w-full rounded-lg"
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
                          <div className=" text-xs text-zinc-500">
                            Danh mục :
                          </div>
                          <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                            {product.category?.title}
                          </div>
                        </div>
                        <div className="my-auto text-lg font-semibold leading-4">
                          {product.fixed_price}
                        </div>
                      </div>
                    </Paper>
                  ))}

                  {/* Add Btn */}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog3(true)}
                    sx={{
                      textTransform: "none",
                      border: "1px solid #3F41A6",
                      color: "#3F41A6",
                      borderRadius: "4px",
                      "&:hover": {
                        border: "1px solid #3949AB",
                        bgcolor: "#E2E5FF",
                      },
                    }}
                  >
                    Thêm hàng hóa
                  </Button>
                </div>

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
                  value={pkg.min_price ? pkg.min_price : ""}
                  placeholder={totalPrice.min_price ? totalPrice.min_price : ""}
                  onChange={updatePkg}
                  error={errMsg?.min_price ? true : false}
                  helperText={errMsg?.min_price ? errMsg.min_price[0] : ""}
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
                  value={pkg.max_price ? pkg.max_price : ""}
                  placeholder={totalPrice.max_price ? totalPrice.max_price : ""}
                  onChange={updatePkg}
                  error={errMsg?.max_price ? true : false}
                  helperText={errMsg?.max_price ? errMsg.max_price[0] : ""}
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

      {/* Thông tin vận chuyển */}
      <Paper
        sx={{
          width: "800px",
          margin: "10px auto",
          border: "1px solid #d6d3d1",
          paddingBottom: "20px",
        }}
      >
        <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start max-md:max-w-full max-md:px-5">
          Vận chuyển
        </div>
        <Divider />
        <div className="flex flex-col items-stretch mt-6 pl-7 pr-16 max-md:max-w-full max-md:px-5">
          <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap self-start">
            Cân nặng dự kiến (Sau khi đóng gói)
          </div>
          <TextField
            id="outlined-start-adornment"
            name="weight"
            value={pkg.weight ? pkg.weight : ""}
            onChange={updatePkg}
            error={errMsg?.weight ? true : false}
            helperText={errMsg?.weight ? errMsg.weight[0] : ""}
            sx={{
              "& .MuiInputBase-input": {
                height: "45px",
                boxSizing: "border-box",
              },
              width: "180px",
              marginY: "10px",
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">gr</InputAdornment>,
            }}
          />
          <div className="text-zinc-900 text-sm leading-5 mt-8 max-md:max-w-full">
            Kích thước dự kiến
          </div>
          <div className="items-stretch flex w-full justify-between gap-5 ">
            <TextField
              name="height"
              value={pkg.height ? pkg.height : ""}
              onChange={updatePkg}
              error={errMsg?.height ? true : false}
              helperText={errMsg?.height ? errMsg.height[0] : ""}
              id="outlined-start-adornment"
              placeholder="Cao"
              sx={{
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box",
                },
                width: "180px",
                marginY: "10px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
              }}
            />
            <TextField
              id="outlined-start-adornment"
              name="length"
              value={pkg.length ? pkg.length : ""}
              onChange={updatePkg}
              error={errMsg?.length ? true : false}
              helperText={errMsg?.length ? errMsg.length[0] : ""}
              placeholder="Dài"
              sx={{
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box",
                },
                width: "180px",
                marginY: "10px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
              }}
            />
            <TextField
              id="outlined-start-adornment"
              placeholder="Rộng"
              value={pkg.width ? pkg.width : ""}
              name="width"
              onChange={updatePkg}
              error={errMsg?.width ? true : false}
              helperText={errMsg?.width ? errMsg.width[0] : ""}
              sx={{
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box",
                },
                width: "180px",
                marginY: "10px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </Paper>

      {/* Img Alert Dialog */}
      <ImgAlert
        open={openImgAlert}
        setOpen={setOpenImgAlert}
        setAddImg={setOpen}
      />

      {/* Other errors */}
      <OtherErrDialog open={openOtherErr} setOpen={setOpenOtherErr} />

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4 my-5 self-center">
        <Button
          variant="outlined"
          onClick={() => resetData()}
          sx={{
            textTransform: "none",
            border: "1px solid #3F41A6",
            color: "#3F41A6",
            width: "120px",

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
            width: "140px",
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

export default AddPkg;
