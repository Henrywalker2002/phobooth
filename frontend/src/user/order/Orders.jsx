import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
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
  Pagination,
  Snackbar,
  TextField,
  InputAdornment,
} from "@mui/material";
import { RiSearchLine } from "react-icons/ri";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { daysleftCount, isBefore } from "../../util/Compare";
import dayjs from "dayjs";
import CancelInOrders from "./CancelInOrders";
import Filter from "./Filter";
import { translateOrderStatus } from "../../util/Translate";

function Orders() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // dialog + Snackbar
  const [openCancel, setOpenCancel] = useState(false);
  const [openCancelSBar, setOpenCancelSBar] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  // Collapsible table
  const [cancelId, setCancelId] = useState();
  const [pageCount, setPageCount] = useState(1);
  const [orders, setOrders] = useState([]);
  const [filterOrders, setFilterOrders] = useState([]);

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  useEffect(() => {
    axiosPrivate
      .get("/order/?limit=5&offset=0")
      .then((res) => {
        console.log(res.data);
        let count = res.data.count;
        setPageCount(Math.ceil(count / 5));
        setOrders(res?.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getOrdersForPage = (e, page) => {
    let offset = 5 * (page - 1);
    axiosPrivate
      .get(`/order/?limit=5&offset=${offset}`)
      .then((res) => {
        // console.log(res.data);
        let currCount = Math.ceil(res.data.count / 5);
        if (currCount !== pageCount) setPageCount(currCount);
        setOrders(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenCancel = (id) => {
    setCancelId(id);
    setOpenCancel(true);
  };

  // Close Cancel Order SnackBar Success/Err
  const handleCloseCancelSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenStatusSbar(false);
  };

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    function getPrice(item) {
      if (item.price) {
        return formatter.format(item.price);
      } else if (item.min_price && item.max_price) {
        return (
          formatter.format(item.min_price) +
          " - " +
          formatter.format(item.max_price)
        );
      }
      return "Chưa cập nhật";
    }

    const getRecentRequest = () => {
      if (row.payment.length > 0) {
        let pendingReqs = row.payment.filter((req) => req.status === "PENDING");
        if (pendingReqs.length > 0) {
          let recentReq = pendingReqs[0];
          pendingReqs.forEach((req) => {
            if (isBefore(req.expiration_date, recentReq.expiration_date))
              recentReq = req;
          });
          return recentReq;
        } else return undefined;
      } else return undefined;
    };

    let recentRequest = getRecentRequest();

    return (
      <React.Fragment>
        <TableRow
          onClick={() => navigate("/order/detail/" + row.id)}
          sx={{ borderBottom: "unset", cursor: "pointer" }}
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
          <TableCell align="left">
            <div className=" text-indigo-800 text-sm">
              {row?.studio?.friendly_name}
            </div>
          </TableCell>
          <TableCell align="left">{row.order_item.length}</TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-center rounded bg-indigo-100 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {translateOrderStatus(row.status)}
            </div>
          </TableCell>
          <TableCell align="left">
            {row.total_price
              ? formatter.format(row.total_price)
              : "Chưa cập nhật"}
          </TableCell>
          <TableCell align="left">
            {row.status === "ORDERED" || row.status === "IN_PROCESS" ? (
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopImmediatePropagation();
                  handleOpenCancel(row.id);
                }}
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
            ) : row.status === "CANCELED" ? null : (
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
                Hoàn thành
              </Button>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <div className="mt-5 text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
                  Danh sách sản phẩm
                </div>
                <Table
                  size="small"
                  sx={{
                    marginTop: "20px",
                    border: "0.5px solid #d6d3d1",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell />
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
                        <TableCell />
                        <TableCell component="th" scope="row">
                          <div className="items-stretch flex gap-5">
                            <img
                              loading="lazy"
                              src={
                                detailedRow.item?.picture
                                  ? detailedRow.item?.picture
                                  : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                              }
                              className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full rounded-lg"
                            />
                            <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                              {detailedRow.item?.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{detailedRow.item?.type}</TableCell>
                        <TableCell align="left">
                          {detailedRow.item?.category?.title}
                        </TableCell>
                        <TableCell align="left">
                          {detailedRow.quantity}
                        </TableCell>
                        <TableCell align="left">
                          {getPrice(detailedRow)}
                        </TableCell>
                        <TableCell align="left">
                          {row.status === "COMPLETED" ? (
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
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* yêu cầu thanh toán */}
                <div className="flex flex-col gap-3 my-5">
                  <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
                    Yêu cầu thanh toán gần nhất
                  </div>
                  {recentRequest ? (
                    <Paper
                      sx={{
                        width: "430px",
                        border: "0.5px solid #d6d3d1",
                        alignItems: "stretch",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "30px",
                        borderRadius: "8px",
                        padding: "15px",
                      }}
                    >
                      <div className="items-stretch flex grow  flex-col py-px gap-2.5">
                        <div className="text-zinc-500 text-base font-medium leading-6">
                          Thanh toán lần {recentRequest.no}
                        </div>
                        <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap ">
                          {formatter.format(recentRequest.amount)}
                        </div>
                        <div className="flex  gap-3 ">
                          <div className="text-zinc-500 text-sm leading-5 self-center whitespace-nowrap my-auto">
                            Thời hạn :
                          </div>
                          <div className="text-zinc-900 text-sm leading-5 self-center my-auto">
                            {dayjs(recentRequest.expiration_date).format(
                              "DD-MM-YYYY"
                            )}
                          </div>
                          <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-red-500 bg-opacity-20 px-3">
                            Còn {daysleftCount(recentRequest.expiration_date)}{" "}
                            ngày
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="contained"
                        sx={{
                          justifyContent: "center",
                          alignSelf: "center",
                          fontSize: "13px",
                          textTransform: "none",
                          borderRadius: "43px",
                          color: "#F6F5FB",
                          bgcolor: "#3F41A6",
                          width: "102px",
                          height: "32px",
                          "&:hover": {
                            bgcolor: "#3F41A6B2",
                          },
                        }}
                      >
                        Thanh toán
                      </Button>
                    </Paper>
                  ) : (
                    "Chưa có yêu cầu cần thanh toán!"
                  )}
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
          cursor: "pointer",
        }}
      >
        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/", { replace: true })}
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

      <div className="flex gap-5 items-center w-fit mx-auto my-3">
        {/* search */}
        <TextField
          id="input-with-icon-textfield"
          placeholder="Tìm kiếm"
          sx={{
            "& .MuiInputBase-input": {
              padding: "10px 12px",
              width: "450px",
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

        {/* filter */}
        <Button
          variant="text"
          endIcon={<TuneOutlinedIcon />}
          onClick={() => {
            setOpenFilter(true);
          }}
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            "&:hover": {
              bgcolor: "#E2E5FF",
            },
          }}
        >
          Bộ lọc
        </Button>
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
                TỔNG GIÁ
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                HÀNH ĐỘNG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterOrders.length > 0 ? (
              filterOrders.map((row) => <Row key={row?.id} row={row} />)
            ) : orders.length > 0 ? (
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

      {/* Pagination */}
      <Pagination
        count={pageCount}
        onChange={getOrdersForPage}
        sx={{
          margin: "0 auto",
          width: "fit-content",
          "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
            {
              bgcolor: "#E2E5FF",
            },
        }}
      />

      {/* Filter Dialog */}
      <Filter
        open={openFilter}
        setOpen={setOpenFilter}
        orders={orders}
        setFilterOrders={setFilterOrders}
      />

      {/* Cancel Order */}
      <CancelInOrders
        open={openCancel}
        setOpen={setOpenCancel}
        id={cancelId}
        setOrders={setOrders}
        setStatusMsg={setStatusMsg}
        setOpenCancelSBar={setOpenCancelSBar}
      />

      {/* Cancel successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openCancelSBar}
        autoHideDuration={2000}
        onClose={handleCloseCancelSBar}
        message={statusMsg}
      />
    </div>
  );
}

export default Orders;
