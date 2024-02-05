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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { IoMdImages } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { v4 as uuidv4 } from "uuid";

function AddProduct({
  productInfo,
  setProductInfo,
  categories,
  setPicList,
  reset,
  setReset,
}) {
  // const categories = ["Khung ảnh", "Ảnh chất lượng cao"];
  const [open, setOpen] = useState(false);
  const [optList1, setOptList1] = useState([{ id: uuidv4() }]);
  const [optList2, setOptList2] = useState([{ id: uuidv4() }]);
  const [optName, setOptName] = useState({});
  const [optValueList, setOptValueList] = useState([]);
  const [imgList, setImgList] = useState([]);

  // Reset
  useEffect(() => {
    if (reset) {
      setImgList([]);
      setOptName({});
      setOptValueList([]);
      setOptList1([{ id: uuidv4() }]);
      setOptList2([{ id: uuidv4() }]);
      setReset(false);
    }
  }, [reset]);

  // Img List
  useEffect(() => {
    let picList = imgList?.map((img) => img.img_file);
    setPicList(picList);
  }, [imgList]);

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

  // Variation
  useEffect(() => {
    setProductInfo({
      ...productInfo,
      option: {
        option_names: [optName.feature1, optName.feature2],
        variation: optValueList,
      },
    });
  }, [optValueList, optName]);

  const splitValueList = (optlist) => {
    let valueList = [];
    optlist.forEach((opt) => {
      if ("value" in opt && opt.value !== "") valueList.push(opt.value);
    });
    return valueList;
  };
  const mergeVariation = (list1, list2) => {
    let mergedList = [];
    let valueList1 = splitValueList(list1);
    let valueList2 = splitValueList(list2);

    if (valueList1.length > 0 && valueList2.length == 0) {
      mergedList = valueList1.map((value) => {
        return { option_values: [value, ""] };
      });
    } else if (valueList1.length == 0 && valueList2.length > 0) {
      mergedList = valueList2.map((value) => {
        return { option_values: ["", value] };
      });
    } else if (valueList1.length > 0 && valueList2.length > 0) {
      valueList1.forEach((value1) => {
        valueList2.forEach((value2) => {
          mergedList.push({ option_values: [value1, value2] });
        });
      });
    }

    console.log(mergedList);
    return mergedList;
  };

  const getNumberOfValues = (lst) => {
    let count = 0;
    lst.forEach((opt) => {
      if ("value" in opt && opt.value !== "") count++;
    });
    return count;
  };
  const handleDeleteVariation1 = (delValue) => {
    let newList = [];
    if (getNumberOfValues(optList1) > 1) {
      newList = optValueList.filter(
        (values) => !values.option_values.includes(delValue)
      );
    } else {
      optValueList.forEach((values) => {
        if (values.option_values.includes(delValue)) {
          if (!values.option_values.includes("")) {
            let newValues = { ...values };
            newValues.option_values[0] = "";
            newList.push(newValues);
          }
        } else {
          newList.push(values);
        }
      });
    }
    setOptValueList(newList);
  };

  const handleDeleteVariation2 = (delValue) => {
    let newList = [];
    console.log(getNumberOfValues(optList2) > 1);
    if (getNumberOfValues(optList2) > 1) {
      newList = optValueList.filter(
        (values) => !values.option_values.includes(delValue)
      );
    } else {
      optValueList.forEach((values) => {
        if (values.option_values.includes(delValue)) {
          if (!values.option_values.includes("")) {
            let newValues = { ...values };
            newValues.option_values[1] = "";
            console.log(newValues);
            newList.push(newValues);
          }
        } else {
          newList.push(values);
        }
      });
    }
    setOptValueList(newList);
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
    setOptValueList(mergeVariation(newList, optList2));
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
    setOptValueList(mergeVariation(optList1, newList));
  };
  const handleDeleteOpt1 = (delOpt) => {
    const newList = optList1.filter((opt) => opt.id !== delOpt.id);
    setOptList1(newList);
    if ("value" in delOpt && delOpt.value !== "")
      handleDeleteVariation1(delOpt.value);
  };
  const handleDeleteOpt2 = (delOpt) => {
    const newList = optList2.filter((opt) => opt.id !== delOpt.id);
    setOptList2(newList);
    if ("value" in delOpt && delOpt.value !== "")
      handleDeleteVariation2(delOpt.value);
  };

  // Product Info
  const updateBasicInfo = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };
  const handleUpdateVariation = (e, selectedOptValue) => {
    const newList = optValueList.map((optValue) =>
      JSON.stringify(optValue.option_values) ===
      JSON.stringify(selectedOptValue)
        ? { ...optValue, [e.target.name]: e.target.value }
        : optValue
    );
    console.log(newList);
    setOptValueList(newList);
  };

  // console.log(optList1, optList2);
  // console.log(optValueList);
  console.log(productInfo);
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
      <div className="flex flex-col items-stretch px-7 mt-6">
        <div className="flex gap-5">
          <div className="flex flex-col items-stretch w-[60%]">
            <div className="flex flex-col grow items-stretch max-md:mt-10 max-md:max-w-full">
              <div className="text-sm leading-5 text-zinc-900 max-md:max-w-full">
                Tên hàng hóa
              </div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                name="name"
                value={productInfo?.name ? productInfo.name : ""}
                onChange={updateBasicInfo}
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
                    id="outlined-select-categories"
                    name="category"
                    value={productInfo?.category ? productInfo.category : ""}
                    onChange={updateBasicInfo}
                    defaultValue=""
                    select
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
                    id="outlined-basic"
                    variant="outlined"
                    name="fixed_price"
                    value={
                      productInfo?.fixed_price ? productInfo.fixed_price : ""
                    }
                    onChange={updateBasicInfo}
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
                    <div className="text-[10px]">({imgList.length}/5)</div>
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
        <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
          Mô tả hàng hóa
        </div>
        <TextField
          id="outlined-multiline-static"
          name="description"
          value={productInfo?.description ? productInfo.description : ""}
          onChange={updateBasicInfo}
          multiline
          rows={3}
          sx={{
            width: "730px",
            marginTop: "10px",
          }}
        />

        {/* Feature */}
        <div className="flex gap-5 justify-between items-stretch mt-8">
          <div className="flex flex-col flex-1 items-stretch">
            <div className="text-sm leading-5 text-zinc-900">Đặc điểm 1</div>
            <TextField
              id="outlined-basic"
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
              id="outlined-basic"
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

        {/* Options */}
        <div className="flex gap-5 justify-between items-stretch mt-6 max-w-full text-sm text-zinc-900">
          <div className="flex flex-col flex-1 items-stretch">
            <div className="text-sm leading-5 text-zinc-900">
              Phân loại 1
              <IconButton onClick={handleAddOpt1}>
                <AddCircleOutlineIcon sx={{ width: "20px", height: "20px" }} />
              </IconButton>
            </div>
            {optList1.length > 1 ? (
              optList1.map((opt, i) => (
                <div className="flex items-center gap-5" key={i}>
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
                  <IconButton onClick={() => handleDeleteOpt1(opt)}>
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
                <AddCircleOutlineIcon sx={{ width: "20px", height: "20px" }} />
              </IconButton>
            </div>
            {optList2.length > 1 ? (
              optList2.map((opt, i) => (
                <div className="flex items-center gap-5" key={i}>
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
                  <IconButton onClick={() => handleDeleteOpt2(opt)}>
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

        <div className="flex flex-col items-stretch pb-2.5 mt-8 bg-white rounded-lg border border-solid border-slate-100 max-md:max-w-full">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ color: "#3F41A6" }}>Phân loại 1</TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
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
                      <TableCell align="left">
                        {values?.option_values ? values.option_values[1] : ""}
                      </TableCell>

                      <TableCell align="left">
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          name="price"
                          onChange={(e) =>
                            handleUpdateVariation(e, values.option_values)
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
                            handleUpdateVariation(e, values.option_values)
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
  );
}

export default AddProduct;
