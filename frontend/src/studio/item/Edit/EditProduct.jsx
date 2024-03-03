import React, { useEffect, useState } from "react";
import {
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { FaArrowRight } from "react-icons/fa";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function EditProduct({ id, setOpenSBar, categories }) {
  // global
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // dialog
  const [product, setProduct] = useState({});
  const [newInfo, setNewInfo] = useState({});
  const [optList1, setOptList1] = useState([]);
  const [optList2, setOptList2] = useState([]);
  const [optName, setOptName] = useState({});
  const [optValueList, setOptValueList] = useState([]);

  // console.log(product);

  const getVariationInfo = (data) => {
    // option
    if (data.option.length == 2) {
      // option_names
      setOptName({
        feature1: data.option[0].name,
        feature2: data.option[1].name,
      });
      // optionList
      let opt1 = [];
      let opt2 = [];
      for (let value of data.option[0].value) {
        opt1.push({ id: uuidv4(), value });
      }
      setOptList1(opt1);
      for (let value of data.option[1].value) {
        opt2.push({ id: uuidv4(), value });
      }
      setOptList2(opt2);
    } else if (data.option.length == 1) {
      // option_names
      setOptName({
        feature1: data.option[0].name,
      });
      // optionList
      let opt1 = [];
      for (let value of data.option[0].value) {
        opt1.push({ id: uuidv4(), value });
      }
      setOptList1(opt1);
    } else {
      setOptName({});
      setOptList1([{ id: uuidv4() }]);
      setOptList2([{ id: uuidv4() }]);
    }

    // variation
    if (data.variation.length > 0) {
      let varlst = [];
      for (let variation of data.variation) {
        let val1 = variation.value.find(
          (val) => val.option.name === data.option[0].name
        );
        let val2 = variation.value.find(
          (val) => val.option.name === data.option[1].name
        );
        let values = val1 && val2 ? [val1.name, val2.name] : [];
        varlst.push({
          id: variation.id,
          option_values: values,
          price: variation.price,
          stock: variation.stock,
        });
      }
      setOptValueList(varlst);
    }
  };

  // get detail item
  useEffect(() => {
    axiosPrivate
      .get(`/item-product/${id}/`)
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
        getVariationInfo(res.data);
        setNewInfo({});
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // handle variation
  const filteredValueList = (optlist) => {
    let valueList = [];
    optlist.forEach((opt) => {
      if ("value" in opt && opt.value !== "") valueList.push(opt.value);
    });
    return valueList;
  };

  const createVariation = (list1, list2) => {
    let mergedList = [];
    let oldList = [...optValueList];
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

    // update price, stock in old list
    for (let oldVal of oldList) {
      for (let newVal of mergedList) {
        if (
          JSON.stringify(newVal.option_values) ===
          JSON.stringify(oldVal.option_values)
        ) {
          newVal.price = oldVal.price ?? "";
          newVal.stock = oldVal.stock ?? "";
        }
      }
    }
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
  };
  const handleDeleteOpt1 = (id) => {
    const newList = optList1.filter((opt) => opt.id !== id);
    setOptList1(newList);
  };
  const handleDeleteOpt2 = (id) => {
    const newList = optList2.filter((opt) => opt.id !== id);
    setOptList2(newList);
  };

  // update price + stock for variation
  const handleUpdateVariation = (e, id) => {
    const newList = optValueList.map((optValue) =>
      optValue.id === id
        ? {
            ...optValue,
            [e.target.name]: Number(e.target.value),
          }
        : optValue
    );
    // console.log(newList);
    setOptValueList(newList);
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

  // product
  const updateProduct = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  //Edit item
  const handleEditItem = async (e) => {
    e.preventDefault();
    let updateVariation = variationFormatter();
    let updateInfo = { ...newInfo, ...updateVariation };
    console.log(updateInfo);
    axiosPrivate
      .patch(`/item-product/${id}/`, updateInfo)
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
        setNewInfo({});
        // navigate("/studio/items", { replace: true });
      })
      .then(() => {
        setOpenSBar(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form
      onSubmit={handleEditItem}
      className="forms flex flex-col gap-5 items-center pb-5"
    >
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
                  value={newInfo?.name ? newInfo?.name : product?.name}
                  onChange={updateProduct}
                  // error={errMsg.product?.name ? true : false}
                  // helperText={errMsg.product?.name ? errMsg.product.name[0] : ""}
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
                      value={
                        newInfo.category
                          ? newInfo.category
                          : product.category ?? ""
                      }
                      onChange={updateProduct}
                      defaultValue={""}
                      select
                      // error={errMsg.product?.category ? true : false}
                      // helperText={
                      //   errMsg.product?.category ? errMsg.product.category[0] : ""
                      // }
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
                  </div>
                  <div className="flex flex-col justify-center items-stretch self-start basis-0">
                    <div className="text-sm leading-5 text-zinc-900">
                      Giá (VNĐ)
                    </div>
                    <TextField
                      required
                      variant="outlined"
                      name="fixed_price"
                      value={
                        newInfo?.fixed_price
                          ? newInfo.fixed_price
                          : product?.fixed_price
                      }
                      onChange={updateProduct}
                      // error={errMsg.product?.fixed_price ? true : false}
                      // helperText={
                      //   errMsg.product?.fixed_price
                      //     ? errMsg.product.fixed_price[0]
                      //     : ""
                      // }
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
              {/* Phần hình ảnh liên quan */}
            </div>
          </div>
          <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
            Mô tả hàng hóa
          </div>
          <TextField
            required
            id="outlined-multiline-static"
            name="description"
            value={
              newInfo?.description ? newInfo?.description : product?.description
            }
            onChange={updateProduct}
            multiline
            rows={3}
            //   error={errMsg.product?.description ? true : false}
            //   helperText={
            //     errMsg.product?.description ? errMsg.product.description[0] : ""
            //   }
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
                value={optName.feature1 ?? ""}
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
                value={optName.feature2 ?? ""}
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
          <div className="flex flex-col items-start pb-2.5 mt-8 bg-white rounded-lg border border-solid border-slate-100 max-md:max-w-full">
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
              startIcon={<FaArrowRight />}
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
                            value={values.price ?? ""}
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
                            value={values.stock ?? ""}
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

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4  self-center">
        <Button
          variant="outlined"
          onClick={() => {
            setProduct({});
            navigate("/studio/items", { replace: true });
          }}
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
          Quay lại
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
          Lưu thông tin
        </Button>
      </div>
    </form>
  );
}

export default EditProduct;
