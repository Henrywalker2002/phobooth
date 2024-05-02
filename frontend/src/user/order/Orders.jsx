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
  Alert,
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
import CancelInOrders from "./CancelInOrders";
import Filter from "./Filter";
import RatingDialog from "./RatingDialog";
import { DateFormatter } from "../../util/Format";
import { translateType } from "../../util/Translate";

function Orders() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // dialog + Snackbar
  const [openCancel, setOpenCancel] = useState(false);
  const [openCancelSBar, setOpenCancelSBar] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [openFilter, setOpenFilter] = useState(false);
  // Collapsible table
  const [cancelId, setCancelId] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [filterVal, setFilterVal] = useState({});
  const [openRating, setOpenRating] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState({});

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const getSlugForFilter = (slug) => {
    if (filterVal.status) {
      slug += `&status=${filterVal?.status}`;
    }
    if (filterVal.studio) {
      slug += `&studio=${filterVal?.studio}`;
    }
    if (filterVal.date_from) {
      slug += `&date_from=${filterVal?.date_from}`;
    }
    if (filterVal.date_end) {
      slug += `&date_end=${filterVal?.date_end}`;
    }
    if (filterVal.search) {
      slug += `&search=${filterVal?.search}`;
    }
    return slug;
  };

  useEffect(() => {
    let slug = "/order/?limit=5&offset=0";
    slug = getSlugForFilter(slug);
    axiosPrivate
      .get(slug)
      .then((res) => {
        let count = res.data.count;
        setPageCount(Math.ceil(count / 5));
        setDefaultPage(1);
        setOrders(res?.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filterVal]);

  const getOrdersForPage = (e, page) => {
    let offset = 5 * (page - 1);
    let slug = `/order/?limit=5&offset=${offset}`;
    slug = getSlugForFilter(slug);
    axiosPrivate
      .get(slug)
      .then((res) => {
        let currCount = Math.ceil(res.data.count / 5);
        if (currCount !== pageCount) setPageCount(currCount);
        setDefaultPage(page);
        setOrders(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Close Cancel Order SnackBar Success/Err
  const handleCloseCancelSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenCancelSBar(false);
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

    // Color for Status
    const displayStatus = (status) => {
      if (status === "ORDERED")
        return (
          <div className="w-fit text-yellow-600 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 px-3 flex justify-center self-center">
            Đã đặt
          </div>
        );
      else if (status === "IN_PROCESS")
        return (
          <div className="w-fit text-blue-600 text-sm leading-6 whitespace-nowrap rounded bg-blue-300 bg-opacity-20 py-1 px-3 flex justify-center self-center">
            Đang tiến hành
          </div>
        );
      else if (status === "COMPLETED")
        return (
          <div className="w-fit text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-300 bg-opacity-20 py-1 px-3 flex justify-center self-center">
            Hoàn thành
          </div>
        );
      else if (status === "CANCELED")
        return (
          <div className="w-fit text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-300 bg-opacity-25 py-1 px-3 flex justify-center self-center">
            Hủy đơn
          </div>
        );
    };

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
          <TableCell align="left">{displayStatus(row.status)}</TableCell>
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
                  e.stopPropagation();
                  setCancelId(row.id);
                  setOpenCancel(true);
                }}
                sx={{
                  borderRadius: "43px",
                  borderColor: "#3F41A6",
                  color: "#3F41A6",
                  padding: "0 15px",
                  textTransform: "none",
                  width: "fit-content",
                  "&:hover": {
                    bgcolor: "#F6F5FB",
                    borderColor: "#3F41A6",
                  },
                }}
              >
                Hủy đơn
              </Button>
            ) : null}
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
                        <TableCell>
                          {translateType(detailedRow.item?.type)}
                        </TableCell>
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
                              onClick={() => {
                                setSelectedOrderItem(detailedRow);
                                setOpenRating(true);
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

                {/* Pay request + complain */}
                <div className="flex justify-between items-start px-16">
                  {/* yêu cầu thanh toán */}
                  <div className="flex flex-col gap-3 my-5">
                    <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
                      Yêu cầu thanh toán gần nhất
                    </div>
                    {recentRequest ? (
                      <Paper
                        sx={{
                          width: "fit-content",
                          minWidth: "350px",
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
                              {DateFormatter(recentRequest.expiration_date)}
                            </div>
                          </div>
                        </div>
                        <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap justify-center rounded bg-red-500 bg-opacity-20 self-center px-3 py-1">
                          {daysleftCount(recentRequest.expiration_date) < 0
                            ? "Quá hạn"
                            : `Còn ${daysleftCount(
                                recentRequest.expiration_date
                              )} ngày`}
                        </div>
                      </Paper>
                    ) : (
                      "Chưa có yêu cầu cần thanh toán!"
                    )}
                  </div>
                  {/* Complain */}
                  <div className="flex flex-col gap-3 my-5">
                    <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
                      Khiếu nại
                    </div>
                    {row.complain !== null ? (
                      <Paper
                        sx={{
                          width: "fit-content",
                          border: "0.5px solid #d6d3d1",
                          alignItems: "stretch",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "20px",
                          borderRadius: "8px",
                          padding: "15px",
                          cursor: "pointer",
                        }}
                      >
                        <div className="items-stretch flex grow basis-[0%] flex-col pr-12 py-px max-md:pr-5">
                          <div className="text-zinc-500 text-base font-semibold leading-6">
                            {row?.complain?.title}
                          </div>
                          <div className="flex items-stretch gap-2.5 mt-2">
                            <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                              Ngày gửi :
                            </div>
                            <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap self-start">
                              {DateFormatter(row?.complain?.created_at)}
                            </div>
                          </div>
                          <div className="flex justify-start mt-1.5">
                            <Button
                              variant="text"
                              onClick={() =>
                                navigate(
                                  `/complain/detail/${row?.complain?.id}`,
                                  {
                                    state: { orderId: row?.id },
                                  }
                                )
                              }
                              sx={{
                                textTransform: "none",
                                color: "#3F41A6",
                                fontSize: "14px",
                                fontWeight: "600px",
                                padding: "0",
                                "&:hover": {
                                  bgcolor: "#E2E5FF",
                                  color: "#1A237E",
                                },
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                        {row?.complain?.status === "PENDING" ? (
                          <div className="w-fit text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                            Chờ xử lý
                          </div>
                        ) : row?.complain?.status === "RESOLVED" ? (
                          <div className="w-fit text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                            Đã giải quyết
                          </div>
                        ) : row?.complain?.status === "IN_PROGRESS" ? (
                          <div className="w-fit text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                            Đang xử lý
                          </div>
                        ) : null}
                      </Paper>
                    ) : (
                      <div className="flex min-w-[330px]">
                        Chưa có khiếu nại!
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  const handleSearch = (e) => {
    if (e.key == "Enter") {
      if (e.target.value) {
        setFilterVal({ ...filterVal, search: e.target.value });
        e.target.value = "";
      }
    }
  };

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

      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-5">
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
          onKeyDown={handleSearch}
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
            {orders.length > 0 ? (
              orders.map((row) => <Row key={row?.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell />
                {/* <TableCell>Chưa có đơn hàng</TableCell> */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={pageCount}
        onChange={getOrdersForPage}
        page={defaultPage}
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
        filterVal={filterVal}
        setFilterVal={setFilterVal}
      />

      {/* Cancel Order */}
      <CancelInOrders
        open={openCancel}
        setOpen={setOpenCancel}
        id={cancelId}
        setOrders={setOrders}
        setStatusMsg={setStatusMsg}
        setOpenCancelSBar={setOpenCancelSBar}
        setDefaultPage={setDefaultPage}
      />

      {/* Cancel successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openCancelSBar}
        autoHideDuration={2000}
        onClose={handleCloseCancelSBar}
      >
        <Alert
          onClose={handleCloseCancelSBar}
          severity={
            statusMsg === "Hủy đơn hàng thành công!" ? "success" : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {statusMsg}
        </Alert>
      </Snackbar>

      {/* Rating Dialog */}
      <RatingDialog
        open={openRating}
        setOpen={setOpenRating}
        orderItem={selectedOrderItem}
      />
    </div>
  );
}

export default Orders;
