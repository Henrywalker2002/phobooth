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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from "@mui/material";
import { IoMdImages } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { FaArrowRight, FaRegArrowAltCircleRight } from "react-icons/fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { v4 as uuidv4 } from "uuid";
import ImgAlert from "../../../components/ImgAlert";
import { validFixedPrice } from "../../../util/Validation";
import VariationAlert from "./VariationAlert";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ErrDialog from "../ErrDialog";

function AddProduct({ categories, setOpenSBar }) {
  // global
  const axiosPrivate = useAxiosPrivate();
  // dialog
  const [open, setOpen] = useState(false);
  const [openImgAlert, setOpenImgAlert] = useState(false);
  const [openVarAlert, setOpenVarAlert] = useState(false);
  // local
  const [product, setProduct] = useState({});
  const [optList1, setOptList1] = useState([{ id: uuidv4() }]);
  const [optList2, setOptList2] = useState([{ id: uuidv4() }]);
  const [optName, setOptName] = useState({});
  const [optValueList, setOptValueList] = useState([]);
  const [imgList, setImgList] = useState([]);
  // error
  const [errMsg, setErrMsg] = useState({});
  const [openErr, setOpenErr] = useState(false);

  // reset
  const resetData = () => {
    setProduct({});
    setImgList([]);
    setOptName({});
    setOptValueList([]);
    setOptList1([{ id: uuidv4() }]);
    setOptList2([{ id: uuidv4() }]);
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

  const filteredValueList = (optlist) => {
    let valueList = [];
    optlist.forEach((opt) => {
      if ("value" in opt && opt.value !== "") valueList.push(opt.value);
    });
    return valueList;
  };

  const createVariation = (list1, list2) => {
    let mergedList = [];
    let valueList1 = filteredValueList(list1);
    let valueList2 = filteredValueList(list2);

    if (valueList1.length > 0 && valueList2.length == 0) {
      mergedList = valueList1.map((value) => {
        return { id: uuidv4(), option_values: [value] };
      });
    } else if (valueList1.length == 0 && valueList2.length > 0) {
      // alert

      setOpenVarAlert(true);
    } else if (valueList1.length > 0 && valueList2.length > 0) {
      valueList1.forEach((value1) => {
        valueList2.forEach((value2) => {
          mergedList.push({ id: uuidv4(), option_values: [value1, value2] });
        });
      });
    } else {
      // alert
      setOpenVarAlert(true);
    }

    // console.log(mergedList);
    setOptValueList(mergedList);
  };

  const handleAddOpt1 = () => {
    const newList = [...optList1, { id: uuidv4() }];
    setOptList1(newList);
  };
  const handleAddOpt2 = () => {
    const newList = [...optList2, { id: uuidv4() }];
    setOptList2(newList);
  };
  const handleUpdateOpt1 = (e, id) => {
    const newList = optList1.map((opt) =>
      opt.id === id
        ? {
            ...opt,
            value: e.target.value,
          }
        : opt
    );
    setOptList1(newList);
    // setOptValueList(mergeVariation(newList, optList2));
  };
  const handleUpdateOpt2 = (e, id) => {
    const newList = optList2.map((opt) =>
      opt.id === id
        ? {
            ...opt,
            value: e.target.value,
          }
        : opt
    );
    setOptList2(newList);
    // setOptValueList(mergeVariation(optList1, newList));
  };
  const handleDeleteOpt1 = (id) => {
    const newList = optList1.filter((opt) => opt.id !== id);
    setOptList1(newList);
  };
  const handleDeleteOpt2 = (id) => {
    const newList = optList2.filter((opt) => opt.id !== id);
    setOptList2(newList);
  };

  // Product Info
  const updateProduct = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // update price + stock for variation
  const handleUpdateVariation = (e, id) => {
    const newList = optValueList.map((optValue) =>
      optValue.id === id
        ? {
            ...optValue,
            [e.target.name]: e.target.value,
          }
        : optValue
    );
    // console.log(newList);
    setOptValueList(newList);
  };

  // Check price for product
  const checkFixedPrice = (item) => {
    if (!validFixedPrice(item.fixed_price)) {
      setErrMsg({
        ...errMsg,
        fixed_price: ["Giá trị không hợp lệ!"],
      });
      return false;
    }
    return true;
  };

  // Check Stock for variation
  const checkStock = (stock) => {
    if (stock && (isNaN(stock) || stock === "")) return false;
    return true;
  };

  // Check price for variation
  const checkPrice = (price) => {
    if (price && (isNaN(price) || price == 0 || price === "")) return false;
    return true;
  };

  // formatter variation data
  const variationFormatter = () => {
    let option_names = [];
    let variation = [];
    if (optValueList.length > 0) {
      // option_names
      if (optValueList[0].option_values.length == 1)
        option_names.push(optName.feature1);
      else option_names = [optName.feature1, optName.feature2];
      // variation
      variation = optValueList.map((optVal) => {
        delete optVal.id;
        return optVal;
      });
    }
    let result = {
      option: {
        option_names: option_names,
        variation: variation,
      },
    };
    return result;
  };

  const buildFormData = (formData, obj, parentKey = "") => {
    if (Array.isArray(obj)) {
      obj.forEach((element) => {
        buildFormData(formData, element, parentKey);
      });
    } else if (typeof obj === "object" && !(obj instanceof File)) {
      Object.keys(obj).forEach((key) => {
        buildFormData(
          formData,
          obj[key],
          parentKey ? `${parentKey}.${key}` : key
        );
      });
    } else {
      if (obj == null) {
        return;
      }

      const value =
        typeof obj === "number" || typeof obj === "boolean"
          ? obj.toString()
          : obj;
      formData.append(parentKey, value);
    }
  };

  // Add Product
  const handleAddItem = async (e) => {
    e.preventDefault();
    // check imgs are existed
    if (imgList.length < 4 || imgList.length > 10) setOpenImgAlert(true);
    else if (checkFixedPrice(product)) {
      // format Variation
      let variationInfo = variationFormatter();
      let newProduct = { ...product, ...variationInfo };
      console.log(newProduct);

      // form-data
      let formData = new FormData();
      // pictures into formdata
      let picList = imgList?.map((img) => img.img_file);
      for (const pic of picList) {
        formData.append(`pictures`, pic, pic.name);
      }

      // product info into formdata
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key == "option") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // check info in formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      axiosPrivate
        .post("/item-product/", formData, {
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
        <div className="flex flex-col items-stretch px-7 mt-6">
          <div className="flex gap-5">
            <div className="flex flex-col items-stretch w-[60%]">
              <div className="flex flex-col grow items-stretch max-md:mt-10 max-md:max-w-full">
                <div className="text-sm leading-5 text-zinc-900 max-md:max-w-full">
                  Tên hàng hóa
                </div>
                <TextField
                  required
                  variant="outlined"
                  name="name"
                  value={product?.name ? product.name : ""}
                  onChange={updateProduct}
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
                <div className="flex gap-5 justify-between items-stretch mt-6 w-[350px]">
                  <div className="flex flex-col flex-1 items-stretch">
                    <div className="text-sm leading-5 text-zinc-900">
                      Danh mục
                    </div>
                    <TextField
                      required
                      id="outlined-select-categories"
                      name="category"
                      value={product?.category ? product.category : ""}
                      onChange={updateProduct}
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
                  </div>
                  <div className="flex flex-col justify-center items-stretch self-start basis-0">
                    <div className="text-sm leading-5 text-zinc-900">
                      Giá (VNĐ)
                    </div>
                    <TextField
                      required
                      variant="outlined"
                      name="fixed_price"
                      value={product?.fixed_price ? product.fixed_price : ""}
                      onChange={updateProduct}
                      error={errMsg?.fixed_price ? true : false}
                      helperText={
                        errMsg?.fixed_price ? errMsg.fixed_price[0] : ""
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
            <div className="flex flex-col items-stretch ml-5 w-[40%]">
              <div className="flex flex-col items-stretch">
                <div className="justify-center text-sm text-zinc-900">
                  Hình ảnh hàng hóa
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
                      <div className="text-[10px]">({imgList.length}/10)</div>
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
          <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
            Mô tả hàng hóa
          </div>
          <TextField
            required
            id="outlined-multiline-static"
            name="description"
            value={product?.description ? product.description : ""}
            onChange={updateProduct}
            multiline
            rows={3}
            error={errMsg?.description ? true : false}
            helperText={errMsg?.description ? errMsg.description[0] : ""}
            sx={{
              width: "730px",
              marginTop: "10px",
            }}
          />

          {/* Option_names */}
          <div className="flex gap-5 justify-between items-stretch mt-8">
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">Đặc điểm 1</div>
              <TextField
                variant="outlined"
                value={optName.feature1 ? optName.feature1 : ""}
                onChange={(e) =>
                  setOptName({ ...optName, feature1: e.target.value })
                }
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />
            </div>
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">Đặc điểm 2</div>
              <TextField
                variant="outlined"
                value={optName.feature2 ? optName.feature2 : ""}
                onChange={(e) =>
                  setOptName({ ...optName, feature2: e.target.value })
                }
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />
            </div>
          </div>

          {/* Option_values */}
          <div className="flex gap-5 justify-between items-stretch mt-6 max-w-full text-sm text-zinc-900">
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">
                Phân loại 1
                <IconButton onClick={handleAddOpt1}>
                  <AddCircleOutlineIcon
                    sx={{ width: "20px", height: "20px" }}
                  />
                </IconButton>
              </div>
              {optList1.length > 1 ? (
                optList1.map((opt) => (
                  <div className="flex items-center gap-5" key={opt.id}>
                    <TextField
                      variant="outlined"
                      value={opt.value ? opt.value : ""}
                      onChange={(e) => handleUpdateOpt1(e, opt.id)}
                      sx={{
                        "& .MuiInputBase-input": {
                          height: "45px",
                          boxSizing: "border-box",
                        },
                        width: "250px",
                        marginY: "10px",
                      }}
                    />
                    <IconButton onClick={() => handleDeleteOpt1(opt.id)}>
                      <DeleteOutlineIcon sx={{ color: "#3F41A6" }} />
                    </IconButton>
                  </div>
                ))
              ) : (
                <TextField
                  variant="outlined"
                  value={optList1[0]?.value ? optList1[0].value : ""}
                  onChange={(e) => handleUpdateOpt1(e, optList1[0].id)}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "250px",
                    marginY: "10px",
                  }}
                />
              )}
            </div>
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">
                Phân loại 2
                <IconButton onClick={handleAddOpt2}>
                  <AddCircleOutlineIcon
                    sx={{ width: "20px", height: "20px" }}
                  />
                </IconButton>
              </div>
              {optList2.length > 1 ? (
                optList2.map((opt) => (
                  <div className="flex items-center gap-5" key={opt.id}>
                    <TextField
                      variant="outlined"
                      value={opt.value ? opt.value : ""}
                      onChange={(e) => handleUpdateOpt2(e, opt.id)}
                      sx={{
                        "& .MuiInputBase-input": {
                          height: "45px",
                          boxSizing: "border-box",
                        },
                        width: "250px",
                        marginY: "10px",
                      }}
                    />
                    <IconButton onClick={() => handleDeleteOpt2(opt.id)}>
                      <DeleteOutlineIcon sx={{ color: "#3F41A6" }} />
                    </IconButton>
                  </div>
                ))
              ) : (
                <TextField
                  variant="outlined"
                  value={optList2[0]?.value ? optList2[0].value : ""}
                  onChange={(e) => handleUpdateOpt2(e, optList2[0].id)}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "250px",
                    marginY: "10px",
                  }}
                />
              )}
            </div>
          </div>

          {/* Variation */}
          <div className="flex flex-col items-start gap-1 pb-2.5 mt-8 bg-white ">
            <Button
              sx={{
                textTransform: "none",
                color: "#3F41A6",
                "&:hover": {
                  color: "#1A237E",
                  bgcolor: "transparent",
                },
              }}
              onClick={() => createVariation(optList1, optList2)}
              startIcon={<FaArrowRight className="w-5 h-4" />}
            >
              Tạo tất cả các biến thể của sản phẩm
            </Button>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#3F41A6",
                      }}
                    >
                      Phân loại 1
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        display:
                          optValueList[0]?.option_values.length == 1
                            ? "none"
                            : "table-cell",
                        color: "#3F41A6",
                      }}
                    >
                      Phân loại 2
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#3F41A6" }}>
                      Giá tiền
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#3F41A6" }}>
                      Số lượng
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optValueList.length > 0 ? (
                    optValueList.map((values, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {values?.option_values ? values.option_values[0] : ""}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            display:
                              values?.option_values?.length == 1
                                ? "none"
                                : "table-cell",
                          }}
                        >
                          {values?.option_values ? values.option_values[1] : ""}
                        </TableCell>

                        <TableCell align="left">
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            name="price"
                            onChange={(e) =>
                              handleUpdateVariation(e, values.id)
                            }
                            error={!checkPrice(values.price) ? true : false}
                            helperText={
                              checkPrice(values.price)
                                ? ""
                                : "Nhập giá hợp lệ !"
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
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            name="stock"
                            onChange={(e) =>
                              handleUpdateVariation(e, values.id)
                            }
                            error={!checkStock(values.stock) ? true : false}
                            helperText={
                              checkStock(values.stock)
                                ? ""
                                : "Nhập số lượng hợp lệ !"
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
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>No Option</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
            required
            id="outlined-start-adornment"
            name="weight"
            value={product.weight ? product.weight : ""}
            onChange={updateProduct}
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
              required
              name="height"
              value={product.height ? product.height : ""}
              onChange={updateProduct}
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
              required
              id="outlined-start-adornment"
              name="length"
              value={product.length ? product.length : ""}
              onChange={updateProduct}
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
              required
              id="outlined-start-adornment"
              placeholder="Rộng"
              value={product.width ? product.width : ""}
              name="width"
              onChange={updateProduct}
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

      {/* Variation Alert Dialog */}
      <VariationAlert open={openVarAlert} setOpen={setOpenVarAlert} />

      {/* Other errors */}
      <ErrDialog open={openErr} setOpen={setOpenErr} />

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

export default AddProduct;
