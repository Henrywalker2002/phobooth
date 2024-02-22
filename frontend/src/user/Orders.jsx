import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Orders() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  // Collapsible table
  const [orders, setOrders] = React.useState([]);

  useEffect(() => {
    axios
      .get("/order/", {
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrders(res?.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    function getPrice(item) {
      if (item.price) {
        return item.price;
      }
      return item.item.min_price + " - " + item.item.max_price;
    }

    return (
      <React.Fragment>
        <TableRow
          onClick={() => navigate("/order/detail/" + row.id)}
          sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              {open ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightOutlinedIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell align="left" sx={{ color: "#3F41A6" }}>
            {row?.studio?.friendly_name}
          </TableCell>
          <TableCell align="left">{row.quantity}</TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {row.status}
            </div>
          </TableCell>
          <TableCell align="left">
            {row.total_price || "Chưa cập nhật"}
          </TableCell>
          <TableCell align="left">
            <Button
              variant="outlined"
              sx={{
                borderRadius: "43px",
                borderColor: "#3F41A6",
                color: "#3F41A6",
                padding: "0 5px",
                textTransform: "none",
                width: "100px",
                "&:hover": {
                  bgcolor: "#F6F5FB",
                  borderColor: "#3F41A6",
                },
              }}
            >
              Hủy đơn
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* <Typography variant="h6" gutterBottom component="div">
                  Chi tiết
                </Typography> */}
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#808080" }}>
                        TÊN SẢN PHẨM
                      </TableCell>
                      <TableCell sx={{ color: "#808080" }}>PHÂN LOẠI</TableCell>
                      <TableCell align="left" sx={{ color: "#808080" }}>
                        DANH MỤC
                      </TableCell>
                      <TableCell align="left" sx={{ color: "#808080" }}>
                        SỐ LƯỢNG
                      </TableCell>
                      <TableCell align="left" sx={{ color: "#808080" }}>
                        GIÁ (VNĐ)
                      </TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.order_item?.map((detailedRow, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          <div className="items-stretch flex gap-5">
                            <img
                              loading="lazy"
                              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                              className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                            />
                            <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                              {detailedRow.item?.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{detailedRow.type || "Gia đình"}</TableCell>
                        <TableCell align="left">
                          {detailedRow.category}
                        </TableCell>
                        <TableCell align="left">
                          {detailedRow.quantity}
                        </TableCell>
                        <TableCell align="left">
                          {" "}
                          {getPrice(detailedRow)}{" "}
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            variant="text"
                            sx={{
                              color: "#3F41A6",
                              textTransform: "none",
                              "&:hover": {
                                bgcolor: "#F6F5FB",
                                borderRadius: "43px",
                              },
                            }}
                          >
                            Đánh giá
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* yêu cầu thanh toán */}
                <div className="flex flex-col gap-3 my-5 ml-4">
                  <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
                    Yêu cầu thanh toán mới nhất
                  </div>
                  <div className="max-w-[430px] border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex gap-5 p-2.5 rounded-lg border-solid">
                    <div className=" flex grow basis-[0%] flex-col pr-2 py-px">
                      <div className="text-[#808080] text-base font-medium leading-6">
                        Thanh toán lần 3
                      </div>
                      <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap mt-1.5">
                        200,000
                      </div>
                      <div className="flex justify-start gap-4 mt-2.5">
                        <div className="text-zinc-500 text-sm leading-5 self-center whitespace-nowrap my-auto">
                          Thời hạn :
                        </div>
                        <div className="text-zinc-900 text-sm leading-5 self-center my-auto">
                          30-10-2023
                        </div>
                        <div className="w-[90px] max-h-5 text-red-500 text-xs leading-5 whitespace-nowrap rounded bg-red-500 bg-opacity-20 px-3">
                          Còn 3 ngày
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      sx={{
                        justifyContent: "center",
                        alignSelf: "center",
                        textTransform: "none",
                        borderRadius: "43px",
                        color: "#F6F5FB",
                        bgcolor: "#3F41A6",
                        width: "110px",
                        height: "28px",
                        "&:hover": {
                          bgcolor: "#3F41A6B2",
                        },
                      }}
                    >
                      Thanh toán
                    </Button>
                  </div>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Navbar />

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
          href="/"
          // onClick={handleClick}
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
          Quản lý đơn hàng
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-10">
        Quản lý đơn hàng
      </div>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: "1250px",
          margin: "20px auto",
          border: "0.5px solid #d6d3d1",
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ color: "#3F41A6" }}>MÃ ĐƠN HÀNG</TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                NHÀ CUNG CẤP
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                SỐ LƯỢNG SẢN PHẨM
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                TRẠNG THÁI
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                GIÁ (VNĐ)
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                HÀNH ĐỘNG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((row) => <Row key={row?.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell />
                <TableCell>Chưa có đơn hàng</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Orders;
