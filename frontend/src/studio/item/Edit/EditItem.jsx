import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudioNavbar from "../../../components/StudioNavbar";
import {
  Alert,
  Breadcrumbs,
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

      {/* Edit successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
      >
        <Alert
          onClose={handleCloseSBar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Cập nhật sản phẩm thành công !
        </Alert>
      </Snackbar>
    </div>
  );
}

export default EditItem;
