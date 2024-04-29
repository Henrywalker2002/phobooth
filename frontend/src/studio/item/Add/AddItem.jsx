import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Link,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddProduct from "./AddProduct";
import AddService from "./AddService";
import AddPkg from "./AddPkg";
import StudioNavbar from "../../../components/StudioNavbar";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();
  // local
  const [openSBar, setOpenSBar] = useState(false);
  const item_typ = ["Dịch vụ", "Hàng hóa", "Gói dịch vụ"];
  const [optionTyp, setOptionTyp] = useState("Dịch vụ");
  const [categories, setCategories] = useState([]);

  // category list
  useEffect(() => {
    axios
      .get("/category")
      .then((res) => {
        // console.log(res.data);
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [categories.length]);

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSBar(false);
  };

  // console.log(optionTyp, itemInfo, transInfo);
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
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/studio", { replace: true })}
        >
          <HomeOutlinedIcon />
        </Link>

        <Link
          component="button"
          underline="none"
          key="2"
          color="inherit"
          onClick={() => navigate("/studio/items", { replace: true })}
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
              }}
            >
              {option}
            </MenuItem>
          ))}
        </TextField>

        {optionTyp === "Gói dịch vụ" ? (
          <AddPkg
            categories={categories?.filter(
              (category) => category.type === "SERVICE"
            )}
            setOpenSBar={setOpenSBar}
          />
        ) : optionTyp === "Hàng hóa" ? (
          <AddProduct
            categories={categories?.filter(
              (category) => category.type === "PRODUCT"
            )}
            setOpenSBar={setOpenSBar}
          />
        ) : (
          <AddService
            categories={categories?.filter(
              (category) => category.type === "SERVICE"
            )}
            setOpenSBar={setOpenSBar}
          />
        )}
      </div>

      {/* Add successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={10000}
        onClose={handleCloseSBar}
        message="Thêm sản phẩm thành công !"
      />
    </div>
  );
}

export default AddItem;
