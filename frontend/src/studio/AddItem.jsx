import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Button,
  Divider,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddProduct from "./AddProduct";
import AddService from "./AddService";
import AddPkg from "./AddPkg";
import StudioNavbar from "../components/StudioNavbar";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import OtherErrDialog from "../components/OtherErrDialog";
import Err401Dialog from "../components/Err401Dialog";
import ImgAlert from "../components/ImgAlert";
import { validFixedPrice, validRangePrice } from "../util/Validation";

function AddItem() {
  const { auth } = useAuth();
  // local
  const [openSBar, setOpenSBar] = useState(false);
  const item_typ = ["Dịch vụ", "Hàng hóa", "Gói dịch vụ"];
  const [optionTyp, setOptionTyp] = useState("Dịch vụ");
  const [reset, setReset] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [transInfo, setTransInfo] = useState({});
  const [picList, setPicList] = useState([]);
  // error
  const [errMsg, setErrMsg] = useState({});
  const [openImgAlert, setOpenImgAlert] = useState(false);
  const [addImgFlag, setAddImgFlag] = useState(false);
  const [openErr401, setOpenErr401] = useState(false);
  const [openOtherErr, setOpenOtherErr] = useState(false);

  // category list
  useEffect(() => {
    axios
      .get("/category")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [categories.length]);

  // Update transport Info
  const updateTransInfo = (e) => {
    setTransInfo({ ...transInfo, [e.target.name]: e.target.value });
  };

  // Check price for item
  const checkPrice = (item, typ) => {
    if (typ === "Hàng hóa") {
      if (!validFixedPrice(item.fixed_price)) {
        setErrMsg({
          ...errMsg,
          product: { fixed_price: ["Giá trị không hợp lệ!"] },
        });
        return false;
      }
    } else if (typ === "Gói dịch vụ") {
      if (validFixedPrice(item.min_price) && validFixedPrice(item.max_price)) {
        if (!validRangePrice(item.min_price, item.max_price)) {
          setErrMsg({
            ...errMsg,
            pkg: {
              min_price: ["Khoảng giá trị không phù hợp!"],
              max_price: ["Khoảng giá trị không phù hợp!"],
            },
          });
          return false;
        }
      } else {
        if (!validFixedPrice(item.min_price))
          setErrMsg({
            ...errMsg,
            pkg: { min_price: ["Giá trị không hợp lệ!"] },
          });
        if (!validFixedPrice(item.max_price))
          setErrMsg({
            ...errMsg,
            pkg: { max_price: ["Giá trị không hợp lệ!"] },
          });
        return false;
      }
    } else {
      if (validFixedPrice(item.min_price) && validFixedPrice(item.max_price)) {
        if (!validRangePrice(item.min_price, item.max_price)) {
          setErrMsg({
            ...errMsg,
            service: {
              min_price: ["Khoảng giá trị không phù hợp!"],
              max_price: ["Khoảng giá trị không phù hợp!"],
            },
          });
          return false;
        }
      } else {
        if (!validFixedPrice(item.min_price))
          setErrMsg({
            ...errMsg,
            service: { min_price: ["Giá trị không hợp lệ!"] },
          });
        if (!validFixedPrice(item.max_price))
          setErrMsg({
            ...errMsg,
            service: { max_price: ["Giá trị không hợp lệ!"] },
          });
        return false;
      }
    }
    return true;
  };

  // Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log(itemInfo);
    // check price for item
    checkPrice(itemInfo, optionTyp);
    // check imgs are existed
    if (picList.length < 1) setOpenImgAlert(true);
    else if (checkPrice(itemInfo, optionTyp)) {
      let slug =
        optionTyp === "Gói dịch vụ"
          ? "/item-service-pack/"
          : optionTyp === "Hàng hóa"
          ? "/item-product/"
          : "/item-service/";

      // form-data
      let formData = new FormData();
      console.log(picList);
      for (const pic of picList) {
        formData.append("pictures", pic, pic.name);
      }

      // if service, check type
      if (slug === "/item-service/" && !itemInfo.type) {
        setItemInfo({ ...itemInfo, type: "SERVICE" });
      }
      const info = { ...itemInfo, ...transInfo };
      console.log(info);

      Object.entries(info).forEach(([key, value]) => {
        if (key !== "item") {
          formData.append(key, value);
        } else {
          for (const item of info.item) {
            formData.append("item", item);
          }
        }
      });
      console.log(formData.get("item"));

      axios
        .post(slug, formData, {
          headers: {
            Authorization: `Bearer ${auth.access}`,
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          setItemInfo({});
          setTransInfo({});
          setPicList([]);
          setOpenSBar(true);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 400) {
            let errData = err.response.data;
            if (optionTyp === "Gói dịch vụ") {
              let prevErr = errMsg.pkg ? errMsg.pkg : {};
              setErrMsg({ ...errMsg, pkg: { ...prevErr, ...errData } });
            } else if (optionTyp === "Hàng hóa") {
              let prevErr = errMsg.product ? errMsg.product : {};
              setErrMsg({ ...errMsg, product: { ...prevErr, ...errData } });
            } else {
              let prevErr = errMsg.service ? errMsg.service : {};
              setErrMsg({ ...errMsg, service: { ...prevErr, ...errData } });
            }
          } else if (err.response?.status === 401) {
            setOpenErr401(true);
          } else {
            setOpenOtherErr(true);
          }
        });
    }
  };

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setItemInfo({});
    setTransInfo({});
    setPicList([]);
    setErrMsg({});
    setOpenSBar(false);
  };

  console.log(optionTyp, itemInfo, transInfo);
  return (
    <div>
      <StudioNavbar />

      {/* Breadcumbs */}
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
        }
        aria-label="breadcrumb"
        sx={{
          marginTop: "30px",
          paddingLeft: "120px",
        }}
      >
        <Link
          underline="hover"
          key="1"
          sx={{ color: "#808080" }}
          href="/studio"
          // onClick={handleClick}
        >
          <HomeOutlinedIcon />
        </Link>

        <Link
          underline="hover"
          key="2"
          color="inherit"
          href="/studio/items"
          // onClick={handleClick}
        >
          Quản lý sản phẩm
        </Link>

        <Typography
          key="3"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Thêm sản phẩm
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-start whitespace-nowrap ml-[200px] mt-5">
        Thêm sản phẩm
      </div>

      <div className="self-center flex w-full max-w-[1100px] items-stretch justify-between gap-5 mt-3.5 mx-auto">
        {/* Selector */}
        <TextField
          id="outlined-item-type"
          select
          defaultValue="Dịch vụ"
          sx={{
            "& .MuiInputBase-input": {
              width: "150px",
              height: "50px",
              boxSizing: "border-box",
              paddingY: "13px",
            },
          }}
        >
          {item_typ.map((option, index) => (
            <MenuItem
              key={index}
              value={option}
              onClick={() => {
                setOptionTyp(option);
                setItemInfo({});
                setTransInfo({});
              }}
            >
              {option}
            </MenuItem>
          ))}
        </TextField>

        <form
          onSubmit={handleAddItem}
          className="forms flex flex-col gap-5 items-center pb-5"
        >
          {/* Thông tin cơ bản */}
          {optionTyp === "Gói dịch vụ" ? (
            <AddPkg
              pkgInfo={itemInfo}
              setPkgInfo={setItemInfo}
              categories={categories?.filter(
                (category) => category.type === "SERVICE"
              )}
              setPicList={setPicList}
              reset={reset}
              setReset={setReset}
              errMsg={errMsg}
              addImgFlag={addImgFlag}
              setAddImgFlag={setAddImgFlag}
            />
          ) : optionTyp === "Hàng hóa" ? (
            <AddProduct
              productInfo={itemInfo}
              setProductInfo={setItemInfo}
              categories={categories?.filter(
                (category) => category.type === "PRODUCT"
              )}
              setPicList={setPicList}
              reset={reset}
              setReset={setReset}
              errMsg={errMsg}
              addImgFlag={addImgFlag}
              setAddImgFlag={setAddImgFlag}
            />
          ) : (
            <AddService
              serviceInfo={itemInfo}
              setServiceInfo={setItemInfo}
              categories={categories?.filter(
                (category) => category.type === "SERVICE"
              )}
              setPicList={setPicList}
              reset={reset}
              setReset={setReset}
              errMsg={errMsg}
              addImgFlag={addImgFlag}
              setAddImgFlag={setAddImgFlag}
            />
          )}

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
                required={optionTyp === "Hàng hóa" ? true : false}
                id="outlined-start-adornment"
                name="weight"
                value={transInfo.weight ? transInfo.weight : ""}
                onChange={updateTransInfo}
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
                    <InputAdornment position="end">gr</InputAdornment>
                  ),
                }}
              />
              <div className="text-zinc-900 text-sm leading-5 mt-8 max-md:max-w-full">
                Kích thước dự kiến
              </div>
              <div className="items-stretch flex w-full justify-between gap-5 ">
                <TextField
                  required={optionTyp === "Hàng hóa" ? true : false}
                  name="height"
                  value={transInfo.height ? transInfo.height : ""}
                  onChange={updateTransInfo}
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
                  required={optionTyp === "Hàng hóa" ? true : false}
                  id="outlined-start-adornment"
                  name="length"
                  value={transInfo.length ? transInfo.length : ""}
                  onChange={updateTransInfo}
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
                  required={optionTyp === "Hàng hóa" ? true : false}
                  id="outlined-start-adornment"
                  placeholder="Rộng"
                  value={transInfo.width ? transInfo.width : ""}
                  name="width"
                  onChange={updateTransInfo}
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

          {/* Action Btn */}
          <div className="flex  gap-5 ml-4 my-5 self-center">
            <Button
              variant="outlined"
              onClick={() => {
                setItemInfo({});
                setTransInfo({});
                setPicList([]);
                setErrMsg({});
                setReset(true);
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
      </div>

      {/* Add successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={3000}
        onClose={handleCloseSBar}
        message="Thêm sản phẩm thành công !"
      />

      {/* Img Alert Dialog */}
      <ImgAlert
        open={openImgAlert}
        setOpen={setOpenImgAlert}
        setAddImgFlag={setAddImgFlag}
      />
      {/* Error 401 */}
      <Err401Dialog open={openErr401} setOpen={setOpenErr401} />
      {/* Other errors */}
      <OtherErrDialog open={openOtherErr} setOpen={setOpenOtherErr} />
    </div>
  );
}

export default AddItem;
