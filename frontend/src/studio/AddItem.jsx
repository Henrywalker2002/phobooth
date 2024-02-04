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

function AddItem() {
  const { auth } = useAuth();
  const [openSBar, setOpenSBar] = useState(false);
  const item_typ = ["Dịch vụ", "Hàng hóa", "Gói dịch vụ"];
  const [optionTyp, setOptionTyp] = useState("Dịch vụ");
  const [itemInfo, setItemInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [transInfo, setTransInfo] = useState({});

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

  // Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log(itemInfo);
    let slug =
      optionTyp === "Gói dịch vụ"
        ? "/item-service-pack/"
        : optionTyp === "Hàng hóa"
        ? "/item-product/"
        : "/item-service/";
    axios
      .post(
        slug,
        { ...itemInfo, ...transInfo },
        {
          headers: {
            Authorization: `Bearer ${auth.access}`,
            // "Content-Type": "multipart/form-data",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setOpenSBar(true);
      })
      .catch((err) => console.log(err));
  };

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

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

        <div className="forms flex flex-col gap-5 items-center pb-5">
          {/* Thông tin cơ bản */}
          {optionTyp === "Gói dịch vụ" ? (
            <AddPkg
              pkgInfo={itemInfo}
              setPkgInfo={setItemInfo}
              categories={categories?.filter(
                (category) => category.type === "SERVICE"
              )}
            />
          ) : optionTyp === "Hàng hóa" ? (
            <AddProduct
              productInfo={itemInfo}
              setProductInfo={setItemInfo}
              categories={categories?.filter(
                (category) => category.type === "PRODUCT"
              )}
            />
          ) : (
            <AddService
              serviceInfo={itemInfo}
              setServiceInfo={setItemInfo}
              categories={categories?.filter(
                (category) => category.type === "SERVICE"
              )}
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

          <Button
            variant="contained"
            onClick={handleAddItem}
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

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openSBar}
            autoHideDuration={3000}
            onClose={handleCloseSBar}
            message="Thêm sản phẩm thành công !"
          />
        </div>
      </div>
    </div>
  );
}

export default AddItem;
