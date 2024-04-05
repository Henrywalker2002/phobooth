import React, { useEffect, useState } from "react";
import StaffNavbar from "../../components/StaffNavbar";
import {
  Breadcrumbs,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Box,
  Snackbar,
  Pagination,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import { RiSearchLine } from "react-icons/ri";
// import axios from "../api/axios";
import { translateType } from "../../util/Translate";
import CreateCategory from "./CreateCategory";
import EditCategory from "./EditCategory";
import DelCategory from "./DelCategory";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function Categories() {
  // global
  const axiosPrivate = useAxiosPrivate();
  // dialog
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openDelCategory, setOpenDelCategory] = useState(false);
  const [openDelSBar, setOpenDelSBar] = useState(false);

  //   local
  const [serCategories, setSerCategories] = useState([]);
  const [proCategories, setProCategories] = useState([]);
  const [typ, setType] = useState("SERVICE");
  const [selectedCategory, setSelectedCategory] = useState({});

  // pagination
  const itemsPage = 5;
  const [serPageCount, setSerPageCount] = useState(1);
  const [proPageCount, setProPageCount] = useState(1);

  // service category list
  useEffect(() => {
    axiosPrivate
      .get(`/category/?limit=${itemsPage}&offset=0&type=SERVICE`)
      .then((res) => {
        console.log(res.data);
        setSerPageCount(Math.ceil(res.data.count / itemsPage));
        setSerCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [openSBar, openDelSBar, typ]);

  // get service categories for each page
  const getSerCategoryForPage = (e, page) => {
    console.log(page);
    let offset = itemsPage * (page - 1);
    axiosPrivate
      .get(`/category/?limit=${itemsPage}&offset=${offset}&type=SERVICE`)
      .then((res) => {
        console.log(res.data);
        let currCount = Math.ceil(res.data.count / itemsPage);
        if (currCount !== serPageCount) setSerPageCount(currCount);
        setSerCategories(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // product category list
  useEffect(() => {
    axiosPrivate
      .get(`/category/?limit=${itemsPage}&offset=0&type=PRODUCT`)
      .then((res) => {
        console.log(res.data);
        setProPageCount(Math.ceil(res.data.count / itemsPage));
        setProCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [openSBar, openDelSBar, typ]);

  // get product categories for each page
  const getProCategoryForPage = (e, page) => {
    console.log(page);
    let offset = itemsPage * (page - 1);
    axiosPrivate
      .get(`/category/?limit=${itemsPage}&offset=${offset}&type=PRODUCT`)
      .then((res) => {
        console.log(res.data);
        let currCount = Math.ceil(res.data.count / itemsPage);
        if (currCount !== proPageCount) setProPageCount(currCount);
        setProCategories(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeTab = (event, newValue) => {
    console.log(newValue);
    setType(newValue);
  };

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSBar(false);
  };

  const handleCloseDelSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDelSBar(false);
  };

  return (
    <div>
      <StaffNavbar />

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
          // onClick={() => navigate("/", { replace: true })}
        >
          <HomeOutlinedIcon />
        </Link>

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Quản lý danh mục
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-2">
        Quản lý danh mục
      </div>

      <div className="flex gap-5 items-center w-fit mx-auto my-5">
        <TextField
          id="input-with-icon-textfield"
          sx={{
            "& .MuiInputBase-input": {
              padding: "10px 12px",
              width: "400px",
              height: "40px",
              boxSizing: "border-box",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton sx={{ padding: 0 }}>
                  <RiSearchLine className="w-5 h-5" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />

        <Button
          variant="contained"
          onClick={() => {
            setOpenCreateCategory(true);
          }}
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "165px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Tab loại sản phẩm */}
      <TabContext value={typ}>
        <Box>
          <TabList
            onChange={handleChangeTab}
            centered
            sx={{
              "&.MuiTabs-root .MuiTabs-scroller .MuiTabs-indicator": {
                bgcolor: "#3F41A6",
                width: "90px",
              },
            }}
          >
            <Tab
              label="Dịch vụ"
              value="SERVICE"
              sx={{
                textTransform: "none",
                fontSize: "17px",
                "&.Mui-selected": {
                  color: "#3F41A6",
                },
              }}
            />
            <Tab
              label="Hàng hóa"
              value="PRODUCT"
              sx={{
                textTransform: "none",
                fontSize: "17px",
                "&.Mui-selected": {
                  color: "#3F41A6",
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="SERVICE">
          {/* Service Table */}
          <TableContainer
            component={Paper}
            sx={{ margin: "20px auto", maxWidth: "1000px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ color: "#3F41A6", width: "140px" }}>
                    MÃ DANH MỤC
                  </TableCell>
                  <TableCell sx={{ color: "#3F41A6", width: "250px" }}>
                    TÊN DANH MỤC
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "200px" }}
                  >
                    PHÂN LOẠI
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "250px" }}
                  >
                    MÔ TẢ
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "140px" }}
                  >
                    HÀNH ĐỘNG
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serCategories.length > 0 ? (
                  serCategories.map((category, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {category.id}
                      </TableCell>
                      <TableCell align="left">
                        <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow my-auto truncate max-w-[200px]">
                          {category.title}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                          {translateType(category.type)}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="truncate max-w-[250px]">
                          {category.description}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="flex gap-1">
                          <IconButton
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpenEditCategory(true);
                            }}
                          >
                            <ModeEditIcon style={{ color: "#666666" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpenDelCategory(true);
                            }}
                          >
                            <DeleteOutlineIcon style={{ color: "#666666" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No Complain</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination For Service */}
          <Pagination
            count={serPageCount}
            onChange={getSerCategoryForPage}
            sx={{
              margin: "0 auto",
              width: "fit-content",
              "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
                {
                  bgcolor: "#E2E5FF",
                },
            }}
          />
        </TabPanel>
        <TabPanel value="PRODUCT">
          {/* Product Table */}
          <TableContainer
            component={Paper}
            sx={{ margin: "20px auto", maxWidth: "1000px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ color: "#3F41A6", width: "140px" }}>
                    MÃ DANH MỤC
                  </TableCell>
                  <TableCell sx={{ color: "#3F41A6", width: "250px" }}>
                    TÊN DANH MỤC
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "200px" }}
                  >
                    PHÂN LOẠI
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "250px" }}
                  >
                    MÔ TẢ
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "140px" }}
                  >
                    HÀNH ĐỘNG
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proCategories.length > 0 ? (
                  proCategories.map((category, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {category.id}
                      </TableCell>
                      <TableCell align="left">
                        <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow my-auto truncate max-w-[200px]">
                          {category.title}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                          {translateType(category.type)}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="truncate max-w-[250px]">
                          {category.description}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="flex gap-1">
                          <IconButton
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpenEditCategory(true);
                            }}
                          >
                            <ModeEditIcon style={{ color: "#666666" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpenDelCategory(true);
                            }}
                          >
                            <DeleteOutlineIcon style={{ color: "#666666" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No Complain</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination For Product */}
          <Pagination
            count={proPageCount}
            onChange={getProCategoryForPage}
            sx={{
              margin: "0 auto",
              width: "fit-content",
              "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
                {
                  bgcolor: "#E2E5FF",
                },
            }}
          />
        </TabPanel>
      </TabContext>

      {/* Create Category Dialog */}
      <CreateCategory
        open={openCreateCategory}
        setOpen={setOpenCreateCategory}
        setOpenSBar={setOpenSBar}
      />

      {/* Edit Category Dialog */}
      <EditCategory
        open={openEditCategory}
        setOpen={setOpenEditCategory}
        setOpenSBar={setOpenSBar}
        category={selectedCategory}
      />

      {/* Delete Category Dialog */}
      <DelCategory
        open={openDelCategory}
        setOpen={setOpenDelCategory}
        setOpenSBar={setOpenDelSBar}
        category={selectedCategory}
      />

      {/* Update (Add + Edit) successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
        message="Cập nhật danh mục thành công !"
      />

      {/* Delete successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openDelSBar}
        autoHideDuration={2000}
        onClose={handleCloseDelSBar}
        message="Xóa danh mục thành công !"
      />
    </div>
  );
}

export default Categories;
