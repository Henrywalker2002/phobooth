import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudioNavbar from "../../../components/StudioNavbar";
import {
  Breadcrumbs,
  Button,
  // Divider,
  // InputAdornment,
  Link,
  // Paper,
  Snackbar,
  // TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "../../../api/axios";
import EditService from "./EditService";
import EditProduct from "./EditProduct";
import EditPkg from "./EditPkg";

function EditItem() {
  let { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  //   local
  const [categories, setCategories] = useState([]);
  const [openSBar, setOpenSBar] = useState(false);

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
          Cập nhật sản phẩm
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-start whitespace-nowrap ml-[200px] my-5">
        Cập nhật sản phẩm
      </div>

      {/* Form edit item */}
      {/* Thông tin cơ bản */}
      {state?.typ === "SERVICE_PACK" ? (
        <EditPkg
          id={id}
          setOpenSBar={setOpenSBar}
          categories={categories?.filter(
            (category) => category.type === "SERVICE"
          )}
        />
      ) : state?.typ === "PRODUCT" ? (
        <EditProduct
          id={id}
          setOpenSBar={setOpenSBar}
          categories={categories?.filter(
            (category) => category.type === "PRODUCT"
          )}
        />
      ) : (
        <EditService
          id={id}
          setOpenSBar={setOpenSBar}
          categories={categories?.filter(
            (category) => category.type === "SERVICE"
          )}
        />
      )}

      {/* Thông tin vận chuyển */}
      {/* <Paper
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
              required={item?.type === "PRODUCT" ? true : false}
              id="outlined-start-adornment"
              name="weight"
              //   value={transInfo.weight ? transInfo.weight : ""}
              //   onChange={updateTransInfo}
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
                required={item?.type === "PRODUCT" ? true : false}
                name="height"
                // value={transInfo.height ? transInfo.height : ""}
                // onChange={updateTransInfo}
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
                required={item?.type === "PRODUCT" ? true : false}
                id="outlined-start-adornment"
                name="length"
                // value={transInfo.length ? transInfo.length : ""}
                // onChange={updateTransInfo}
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
                required={item?.type === "PRODUCT" ? true : false}
                id="outlined-start-adornment"
                placeholder="Rộng"
                // value={transInfo.width ? transInfo.width : ""}
                name="width"
                // onChange={updateTransInfo}
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
        </Paper> */}

      {/* Add successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
        message="Cập nhật sản phẩm thành công !"
      />
    </div>
  );
}

export default EditItem;
