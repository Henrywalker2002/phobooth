import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import { RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import StudioNavbar from "../components/StudioNavbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function ItemMgmt() {
  // global
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // console.log(auth.access);

  // local
  const [value, setValue] = useState("service");
  const [serviceList, setServiceList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [pkgList, setPkgList] = useState([]);

  useEffect(() => {
    axiosPrivate
      .get("/item-service/")
      .then((res) => {
        // console.log(res.data.results);
        setServiceList(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axiosPrivate
      .get("/item-product/")
      .then((res) => {
        // console.log(res.data.results);
        setProductList(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axiosPrivate
      .get("/item-service-pack/")
      .then((res) => {
        // console.log(res.data.results);
        setPkgList(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Quản lý sản phẩm
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-2">
        Quản lý sản phẩm
      </div>

      <div className="flex gap-5 items-center w-fit mx-auto my-5">
        <TextField
          id="input-with-icon-textfield"
          sx={{
            "& .MuiInputBase-input": {
              padding: "10px 12px",
              width: "330px",
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
                <IconButton>
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
            navigate("/studio/items/add");
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
          Thêm sản phẩm
        </Button>
      </div>

      {/* Tab loại sản phẩm */}
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChange}
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
              value="service"
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
              value="product"
              sx={{
                textTransform: "none",
                fontSize: "17px",
                "&.Mui-selected": {
                  color: "#3F41A6",
                },
              }}
            />
            <Tab
              label="Gói dịch vụ"
              value="pkg"
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
        <TabPanel value="service">
          {/* Service Table */}
          <TableContainer
            component={Paper}
            sx={{ width: "900px", margin: "20px auto" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ color: "#3F41A6" }}>DỊCH VỤ</TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    LOẠI DỊCH VỤ
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    DANH MỤC
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    GIÁ THAM KHẢO
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    HÀNH ĐỘNG
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceList.length > 0 ? (
                  serviceList.map((service) => (
                    <TableRow
                      key={service.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <div className="items-stretch flex gap-5">
                          <img
                            loading="lazy"
                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                          />
                          <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                            {service.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                          {service.type == "SERVICE"
                            ? "Dịch vụ chính"
                            : "Dịch vụ hỗ trợ"}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                          {/* {row?.item.category?.title == "family" ? "Gia đình" : ""} */}
                          {service.category?.title}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        {service.min_price && service.max_price
                          ? `${service.min_price} - ${service.max_price}`
                          : ""}
                      </TableCell>
                      <TableCell align="left">
                        <div className="flex gap-1">
                          <IconButton>
                            <ModeEditIcon style={{ color: "#666666" }} />
                          </IconButton>
                          <IconButton>
                            <DeleteOutlineIcon style={{ color: "#666666" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No Service</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value="product">
          {/* Product Table */}
          <TableContainer
            component={Paper}
            sx={{ width: "900px", margin: "20px auto" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ color: "#3F41A6" }}>HÀNG HÓA</TableCell>

                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    DANH MỤC
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    GIÁ
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    HÀNH ĐỘNG
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.length > 0 ? (
                  productList.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <div className="items-stretch flex gap-5">
                          <img
                            loading="lazy"
                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                          />
                          <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                            {product.name}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                          {/* {row?.item.category?.title == "family" ? "Gia đình" : ""} */}
                          {product.category?.title}
                        </div>
                      </TableCell>
                      <TableCell align="left">{product.fixed_price}</TableCell>
                      <TableCell align="left" sx={{ width: "140px" }}>
                        <div className="flex gap-1 w-fit">
                          <IconButton>
                            <ModeEditIcon style={{ color: "#666666" }} />
                          </IconButton>
                          <IconButton>
                            <DeleteOutlineIcon style={{ color: "#666666" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No Product</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value="pkg">
          {/* Package Table */}
          <TableContainer
            component={Paper}
            sx={{ width: "900px", margin: "20px auto" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ color: "#3F41A6" }}>GÓI DỊCH VỤ</TableCell>

                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    DANH MỤC
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    GIÁ
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    HÀNH ĐỘNG
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pkgList.length > 0 ? (
                  pkgList.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <div className="items-stretch flex gap-5">
                          <img
                            loading="lazy"
                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                          />
                          <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                            {pkg.name}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                          {pkg.category.title}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        {pkg.min_price && pkg.max_price
                          ? `${pkg.min_price} - ${pkg.max_price}`
                          : ""}
                      </TableCell>
                      <TableCell align="left" sx={{ width: "140px" }}>
                        <div className="flex gap-1 w-fit">
                          <IconButton>
                            <ModeEditIcon style={{ color: "#666666" }} />
                          </IconButton>
                          <IconButton>
                            <DeleteOutlineIcon style={{ color: "#666666" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No Service Package</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default ItemMgmt;
