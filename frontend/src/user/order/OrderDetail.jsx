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
  Stepper,
  StepLabel,
  Divider,
  Breadcrumbs,
  Link,
  Pagination,
  Snackbar,
  Alert,
  AlertTitle,
  Tooltip,
} from "@mui/material";
import { FaArrowRight } from "react-icons/fa6";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ColoredStep } from "../../styles/Styles";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import { daysleftCount } from "../../util/Compare";
import CancelOrder from "./CancelOrder";
import ReqPaying from "./ReqPaying";
import DeltailRequest from "../../studio/order/DeltailRequest";
import CreateComplain from "./complain/CreateComplain";
import { translateOrderStatus, translateType } from "../../util/Translate";
import RatingDialog from "./RatingDialog";
import UpdateHistory from "./UpdateHistory";

function OrderDetail() {
  // global
  let { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // dialog + Snackbar
  const [openCancel, setOpenCancel] = useState(false);
  const [openCancelSBar, setOpenCancelSBar] = useState(false);
  const [openDetailReq, setOpenDetailReq] = useState(false);
  const [openPayingReq, setOpenPayingReq] = useState(false);
  const [openCreateComplain, setOpenCreateComplain] = useState(false);

  const [openRating, setOpenRating] = useState(false);
  // local
  const [reload, setReload] = useState(false);

  const [order, setOrder] = useState({});
  const [requestList, setRequestList] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedReq, setSelectedReq] = useState({});
  const [selectedItem, setSelectedItem] = useState({});

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // button component
  const CancelButton = () => {
    if (order.status === "CANCELED" || order.status === "COMPLETED") {
      return (
        <Tooltip
          title={
            "Bạn không thể hủy khi đơn đang trạng thái " +
            translateOrderStatus(order.status)
          }
        >
          <span>
            <Button
              disabled
              variant="outlined"
              sx={{
                borderRadius: "43px",
                borderColor: "#3F41A6",
                color: "#3F41A6",
                padding: "5px 25px",
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
          </span>
        </Tooltip>
      );
    }
    return (
      <Button
        onClick={() => setOpenCancel(true)}
        variant="outlined"
        sx={{
          borderRadius: "43px",
          borderColor: "#3F41A6",
          color: "#3F41A6",
          padding: "5px 25px",
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
    );
  };

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

  const getActiveStep = (orderInfo) => {
    if (orderInfo.status === "ORDERED") return 0;
    else if (orderInfo.status === "IN_PROCESS") return 1;
    else if (orderInfo.status === "SHIPPPING") return 2;
    else if (orderInfo.status === "COMPLETED") return 3;
    else return 0;
  };

  useEffect(() => {
    axiosPrivate
      .get(`/order/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
        setReload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  useEffect(() => {
    axiosPrivate
      .get(`/payment/?order=${id}&limit=1&offset=0`)
      .then((res) => {
        // console.log(res.data);
        let count = res.data.count;
        setPageCount(Math.ceil(count / 1));
        setRequestList(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getReqsForPage = (e, page) => {
    let offset = 1 * (page - 1);
    axiosPrivate
      .get(`/payment/?order=${id}&limit=1&offset=${offset}`)
      .then((res) => {
        console.log(res.data);
        let currCount = Math.ceil(res.data.count / 1);
        if (currCount !== pageCount) setPageCount(currCount);
        setRequestList(res.data.results);
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
    setOpenStatusSbar(false);
  };

  // Collapsible table
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ borderBottom: "unset" }}>
          <TableCell sx={{ maxWidth: "50px" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightOutlinedIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="items-stretch flex gap-5">
              <img
                loading="lazy"
                src={
                  row.item?.picture
                    ? row.item?.picture
                    : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                }
                className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full rounded-lg"
              />

              <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-normal truncate my-auto rounded-lg">
                {row.item?.name}
              </div>
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {translateType(row.item?.type)}
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {row.item?.category?.title}
            </div>
          </TableCell>
          <TableCell align="left">{row.quantity}</TableCell>
          <TableCell align="left">{getPrice(row)}</TableCell>
          <TableCell align="left">
            {order.status === "COMPLETED" ? (
              <Button
                onClick={() => {
                  setSelectedItem(row);
                  setOpenRating(true);
                }}
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
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <div className="flex flex-col gap-3 my-5 ml-16">
                  <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
                    Thông tin thêm
                  </div>
                  {/* Nội dung thông tin thêm */}
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  //   status process
  const steps = ["Đã đặt", "Đang tiến hành", "Vận chuyển", "Hoàn thành"];
  // console.log(order?.order_item);
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

          paddingLeft: "70px",
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

        <Link
          component="button"
          underline="none"
          key="2"
          color="inherit"
          // href="/orders"
          onClick={() => navigate("/orders", { replace: true })}
        >
          Quản lý đơn hàng
        </Link>

        <Typography
          key="3"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Đơn hàng #{order?.id}
        </Typography>
      </Breadcrumbs>

      <div className="flex justify-between items-start mt-5 px-16">
        <div className="flex flex-col gap-5">
          {/* Order Detail */}
          <TableContainer
            component={Paper}
            sx={{
              width: "950px",
              border: "0.5px solid #d6d3d1",
            }}
          >
            <div className="items-stretch shadow-sm bg-white flex justify-between gap-5 px-16 py-4 rounded-lg">
              <div className="text-indigo-800 text-xl font-semibold leading-8 whitespace-nowrap">
                {order?.studio?.friendly_name}
              </div>
              <div className="text-neutral-600 text-sm leading-5 self-center whitespace-nowrap my-auto">
                {order?.order_item?.length} sản phẩm
              </div>
            </div>
            <Table aria-label="collapsible table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell sx={{ maxWidth: "50px" }} />
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "250px" }}
                  >
                    SẢN PHẨM
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "150px" }}
                  >
                    PHÂN LOẠI
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "150px" }}
                  >
                    DANH MỤC
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    SỐ LƯỢNG
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#3F41A6" }}>
                    GIÁ ĐƠN VỊ
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order?.order_item?.length > 0 ? (
                  order?.order_item.map((item) => (
                    <Row key={item.id} row={item} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell>Chưa có đơn hàng</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Note from customer */}
            {order.note == null ? null : (
              <Alert
                sx={{
                  width: "85%",
                  marginX: "auto",
                  marginY: "30px",
                  bgcolor: "#E7EAFF",
                  color: "#3F41A6",
                }}
                icon={
                  <StickyNote2OutlinedIcon
                    sx={{ color: "#3F41A6" }}
                    fontSize="inherit"
                  />
                }
                severity="info"
              >
                <AlertTitle>Ghi chú</AlertTitle>
                {order.note}
              </Alert>
            )}

            {/* Status bar */}
            <Box
              sx={{
                width: "100%",
                marginY: "50px",
              }}
            >
              {order.status !== "CANCELED" ? (
                <Stepper activeStep={getActiveStep(order)} alternativeLabel>
                  {steps.map((label, i) => (
                    <ColoredStep key={i}>
                      <StepLabel>{label}</StepLabel>
                    </ColoredStep>
                  ))}
                </Stepper>
              ) : (
                <Alert
                  sx={{ maxWidth: "1000px", marginX: "auto" }}
                  severity="error"
                  color="warning"
                >
                  Đơn hàng này đã được hủy.
                </Alert>
              )}
            </Box>
            {/* payment request, complain + invoice */}
            <div className="w-full max-w-[1200px] mt-8 mb-7">
              <div className="flex justify-around">

                {/* payment request + complain + demo*/}
                <div className="flex flex-col w-[437px] gap-12">
                  {/* payment request */}
                  <div className="items-stretch flex flex-col px-5 gap-2">
                    <div className="text-neutral-400 text-sm font-medium leading-4 tracking-wide uppercase">
                      Yêu cầu thanh toán mới nhất
                    </div>

                    <div className="flex flex-col my-3 h-fit">

                      {requestList.length > 0
                        ? requestList?.map((req) => {
                            if (req.status === "PENDING")
                              return (
                                <Paper
                                  key={req.id}
                                  sx={{
                                    width: "fit-content",
                                    border: "0.5px solid #d6d3d1",
                                    alignItems: "stretch",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "30px",
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                  }}
                                >
                                  <div className="items-stretch flex grow  flex-col py-px gap-2.5">
                                    <div className="text-zinc-500 text-base font-medium leading-6">
                                      Thanh toán lần {req.no}
                                    </div>
                                    <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap ">
                                      {formatter.format(req.amount)}
                                    </div>
                                    <div className="flex  gap-3 ">
                                      <div className="text-zinc-500 text-sm leading-5 self-center whitespace-nowrap my-auto">
                                        Thời hạn :
                                      </div>
                                      <div className="text-zinc-900 text-sm leading-5 self-center my-auto">
                                        {dayjs(req.expiration_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </div>
                                      <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-red-500 bg-opacity-20 px-3">
                                        {daysleftCount(req.expiration_date) > 0
                                          ? `Còn ${daysleftCount(
                                              req.expiration_date
                                            )} ngày`
                                          : "Quá hạn"}
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      setSelectedReq(req);
                                      setOpenPayingReq(true);
                                    }}
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
                              );
                            else if (req.status === "PAID")
                              return (
                                <Paper
                                  onClick={() => {
                                    setSelectedReq(req);
                                    setOpenDetailReq(true);
                                  }}
                                  key={req.id}
                                  sx={{
                                    width: "fit-content",
                                    border: "0.5px solid #d6d3d1",
                                    alignItems: "stretch",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "30px",
                                    borderRadius: "8px",

                                    padding: "10px 15px",

                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="items-stretch flex grow basis-[0%] flex-col pr-12 py-px max-md:pr-5">
                                    <div className="text-zinc-500 text-base font-medium leading-6">
                                      Thanh toán lần {req.no}
                                    </div>
                                    <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap mt-1.5">
                                      {formatter.format(req.amount)}
                                    </div>
                                    <div className="flex items-stretch gap-2.5 mt-3">
                                      <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                                        Ngày thanh toán :
                                      </div>
                                      <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap self-start">
                                        {dayjs(req.payment_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-green-800 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-green-600 bg-opacity-20 self-center my-auto px-3 py-1">
                                    Đã thanh toán
                                  </div>
                                </Paper>
                              );
                          })
                        : "Chưa có yêu cầu thanh toán!"}
                    </div>

                    {/* Pagination */}
                    {requestList.length > 0 && (
                      <Pagination
                        count={pageCount}
                        onChange={getReqsForPage}
                        sx={{
                          margin: "0 auto",
                          width: "fit-content",
                          "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
                            {
                              bgcolor: "#E2E5FF",
                            },
                        }}
                      />
                    )}
                  </div>
                  {/* Complain */}
                  <div className="items-stretch flex flex-col px-5">
                    <div className="text-neutral-400 text-sm font-medium leading-4 tracking-wide uppercase">
                      Khiếu nại
                    </div>

                    <div className="flex flex-col mt-2 gap-5 h-[120px]">
                      {order.complain !== null ? (
                        <Paper
                          sx={{
                            width: "fit-content",
                            border: "0.5px solid #d6d3d1",
                            alignItems: "stretch",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "20px",
                            borderRadius: "8px",

                            padding: "10px 15px",

                            cursor: "pointer",
                          }}
                        >
                          <div className="items-stretch flex grow basis-[0%] flex-col gap-1 pr-12 py-px max-md:pr-5">
                            <div className="text-zinc-500 text-base font-medium leading-6">
                              {order?.complain?.title}
                            </div>
                            <div className="flex items-stretch gap-2.5">
                              <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                                Ngày gửi :
                              </div>
                              <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap self-start">
                                {dayjs(order?.complain?.created_at).format(
                                  "DD-MM-YYYY"
                                )}
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <Button
                                variant="text"
                                onClick={() =>
                                  navigate(
                                    `/complain/detail/${order?.complain?.id}`,
                                    {
                                      state: { orderId: id },
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
                          {order?.complain?.status === "PENDING" ? (
                            <div className="w-fit text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                              Chờ xử lý
                            </div>
                          ) : order?.complain?.status === "RESOLVED" ? (
                            <div className="w-fit text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                              Đã giải quyết
                            </div>
                          ) : order?.complain?.status === "IN_PROGRESS" ? (
                            <div className="w-fit text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                              Đang xử lý
                            </div>
                          ) : null}
                        </Paper>
                      ) : (
                        "Chưa có khiếu nại!"
                      )}
                    </div>
                  </div>
                  {/* Demo */}
                  <div className="items-stretch flex flex-col px-5 gap-2">
                    <div className="text-neutral-400 text-sm font-medium leading-4 tracking-wide uppercase">
                      Thành phẩm
                    </div>
                    <Button
                      startIcon={
                        <FaArrowRight

                          style={{ width: "18px", height: "16px" }}

                        />
                      }
                      onClick={() => navigate(`/order/${id}/demo`)}
                      sx={{
                        textTransform: "none",
                        color: "#3F41A6",
                        width: "fit-content",

                        padding: "5px",

                        height: "35px",
                        borderRadius: "5px",
                        fontSize: "15px",
                        "&:hover": {
                          color: "#1A237E",
                          bgcolor: "transparent",
                        },

                      }}
                    >
                      Xem thành phẩm
                    </Button>
                  </div>
                </div>

                {/* invoice */}
                <div className="flex flex-col w-[342px]">
                  <div className="border border-[color:var(--gray-scale-gray-100,#E6E6E6)] flex w-full flex-col pt-5 pb-2.5 rounded-md border-solid">
                    <div className="flex  justify-between gap-5 px-5">
                      <div className=" flex grow basis-[0%] flex-col self-start">
                        <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                          Mã đơn :
                        </div>
                        <div className="text-zinc-900 text-sm leading-5 mt-1.5">
                          {order.id}
                        </div>
                      </div>
                      <Divider orientation="vertical" flexItem></Divider>

                      <div className="items-stretch z-[1] flex grow basis-[0%] flex-col pr-8 self-start max-md:pr-5">
                        <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                          hóa đơn :
                        </div>
                        <div className="text-indigo-400 text-sm font-medium leading-4 underline whitespace-nowrap mt-1.5">
                          Xuất hóa đơn
                        </div>
                      </div>
                    </div>
                    <div className="bg-neutral-200 self-stretch shrink-0 h-px mt-4" />
                    <div className="items-stretch self-stretch flex flex-col px-5 py-4">
                      <div className="justify-between items-stretch flex gap-5 pb-3">
                        <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                          Tổng thành phần :
                        </div>
                        <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                          {order.total_price == null
                            ? "Chưa cập nhật"
                            : formatter.format(order.total_price)}
                        </div>
                      </div>
                      <div className="justify-between items-stretch flex gap-5 py-3">
                        <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                          Phí vận chuyển :
                        </div>
                        <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                          Chưa có
                        </div>
                      </div>
                      <div className="bg-neutral-200 shrink-0 h-px" />
                      <div className="justify-between items-stretch flex gap-5 py-3">
                        <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                          Khuyến mãi từ PhoBooth:
                        </div>
                        <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                          {order.discount_price == null
                            ? "Chưa có"
                            : formatter.format(order.discount_price)}
                        </div>
                      </div>
                      <div className="justify-between items-stretch flex gap-5 py-3">
                        <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                          Khuyến mãi từ Studio Demo:
                        </div>
                        <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                          {order.discount_price == null
                            ? "Chưa có"
                            : formatter.format(order.discount_price)}
                        </div>
                      </div>
                      <div className="bg-neutral-200 shrink-0 h-px" />
                      <div className="bg-neutral-200 shrink-0 h-px" />
                      <div className="justify-between items-stretch flex gap-5 py-3">
                        <div className="text-zinc-900 text-lg leading-7 whitespace-nowrap">
                          Tổng cộng
                        </div>
                        <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
                          {order.total_price == null
                            ? "Chưa cập nhật"
                            : formatter.format(order.total_price)}
                        </div>
                      </div>
                      <div className="bg-neutral-200 shrink-0 h-0.5" />
                      <div className="justify-between items-stretch flex gap-5 py-3">
                        <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                          Đã thanh toán
                        </div>
                        <div className="text-indigo-800 text-sm font-medium leading-5 whitespace-nowrap">
                          {order.amount_paid > 0 ? "-" : ""}
                          {formatter.format(order.amount_paid)}
                        </div>
                      </div>

                      <div className="bg-neutral-200 z-[1] shrink-0 h-0.5" />
                      <div className="justify-between items-stretch flex gap-5 pt-3">
                        <div className="text-zinc-900 text-lg leading-7 whitespace-nowrap">
                          Còn lại
                        </div>
                        <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
                          {formatter.format(
                            order.total_price - order.amount_paid
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Btn */}
                    <div className=" mx-auto my-2 flex justify-center gap-5">
                      <CancelButton />

                      <Button
                        variant="contained"
                        disabled={order?.complain == null ? false : true}
                        onClick={() => setOpenCreateComplain(true)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "43px",
                          color: "#F6F5FB",
                          bgcolor: "#3F41A6",
                          width: "fit-content",
                          padding: "5px 25px",
                          "&:hover": {
                            bgcolor: "#3F41A6B2",
                          },
                        }}
                      >
                        Khiếu nại
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TableContainer>

          {/* Thông tin vận chuyển */}
          <Paper
            sx={{
              width: "950px",
              margin: "10px auto",
              border: "1.5px solid #d6d3d1",
              paddingBottom: "20px",
            }}
            elevation={2}
          >
            <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start ">
              Thông tin cơ bản
            </div>
            <Divider />
            <div className="flex w-full flex-col items-stretch mt-7 px-9">
              <div className="flex items-stretch justify-between gap-10">
                <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                    Tên khách hàng
                  </div>

                  <div className="mt-2.5 w-full text-base font-medium leading-6 text-indigo-800">
                    {order?.customer?.full_name ?? "Chưa cập nhật"}
                  </div>
                </div>
              </div>
              <div className="flex items-stretch justify-between gap-5 mt-6 ">
                <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                    số điện thoại
                  </div>
                  <div className="mt-2.5 w-full text-sm font-medium leading-5 text-zinc-900">
                    Chưa cập nhật
                  </div>
                </div>
              </div>
              <div className="flex items-stretch justify-between gap-5 mt-6 ">
                <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap max-md:max-w-full">
                    Địa chỉ
                  </div>

                  <div className="mt-2.5 w-full text-sm font-medium leading-5 text-zinc-900">
                    {order?.address?.street},{" "}
                    {order?.address?.ward.name_with_type},{" "}
                    {order?.address?.district.name_with_type},{" "}
                    {order?.address?.province.name_with_type}
                  </div>

                  <div className="items-stretch flex gap-2 mt-1 pr-20 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/da55b028eb8eefc7a61e4d1e5ccc2031cf3efeae8bb767ce6ad3a7eb23e6b619?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                      className="aspect-square object-contain object-center w-6 overflow-hidden self-center shrink-0 max-w-full my-auto"
                    />
                    <div className="text-zinc-500 text-sm leading-5 my-auto">
                      Phí vận chuyển :
                    </div>
                    <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 aspect-[2.1379310344827585] px-2 py-1">
                      20,000
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap mt-9 self-start">
                trạng thái vận chuyển
              </div>
              <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 mt-1 px-2.5 py-1 self-start">
                Chưa vận chuyển
              </div>
              <Button
                disabled={order.status === "CANCELED" ? true : false}
                variant="contained"
                sx={{
                  marginTop: "30px",
                  textTransform: "none",
                  borderRadius: "43px",
                  color: "#F6F5FB",
                  bgcolor: "#3F41A6",
                  width: "130px",
                  "&:hover": {
                    bgcolor: "#3F41A6B2",
                  },
                }}
              >
                Lưu thông tin
              </Button>
            </div>
          </Paper>
          {/* <div className="max-w-[1200px] w-full mx-auto my-10 border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex flex-col items-stretch pb-5 rounded-lg border-solid">
            <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white w-full justify-center pl-6 pr-16 py-5 rounded-lg items-start">
              Thông tin vận chuyển
            </div>
            <div className="flex w-full flex-col items-stretch mt-7 px-9">
              <div className="flex items-stretch justify-between gap-10">
                <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                    Tên khách hàng
                  </div>

                  <div className="mt-2.5 w-full text-base font-medium leading-6 text-indigo-800">
                    {order?.customer?.full_name ?? "Chưa cập nhật"}
                  </div>
                </div>
              </div>
              <div className="flex items-stretch justify-between gap-5 mt-6 ">
                <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                    số điện thoại
                  </div>
                  <div className="mt-2.5 w-full text-sm font-medium leading-5 text-zinc-900">
                    Chưa cập nhật
                  </div>
                </div>
              </div>
              <div className="flex items-stretch justify-between gap-5 mt-6 ">
                <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap max-md:max-w-full">
                    Địa chỉ
                  </div>

                  <div className="mt-2.5 w-full text-sm font-medium leading-5 text-zinc-900">
                    {order?.address?.street},{" "}
                    {order?.address?.ward.name_with_type},{" "}
                    {order?.address?.district.name_with_type},{" "}
                    {order?.address?.province.name_with_type}
                  </div>

                  <div className="items-stretch flex gap-2 mt-1 pr-20 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/da55b028eb8eefc7a61e4d1e5ccc2031cf3efeae8bb767ce6ad3a7eb23e6b619?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                      className="aspect-square object-contain object-center w-6 overflow-hidden self-center shrink-0 max-w-full my-auto"
                    />
                    <div className="text-zinc-500 text-sm leading-5 my-auto">
                      Phí vận chuyển :
                    </div>
                    <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 aspect-[2.1379310344827585] px-2 py-1">
                      20,000
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap mt-9 self-start">
                trạng thái vận chuyển
              </div>
              <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 mt-1 px-2.5 py-1 self-start">
                Chưa vận chuyển
              </div>
              <Button
                disabled={order.status === "CANCELED" ? true : false}
                variant="contained"
                sx={{
                  marginTop: "30px",
                  textTransform: "none",
                  borderRadius: "43px",
                  color: "#F6F5FB",
                  bgcolor: "#3F41A6",
                  width: "130px",
                  "&:hover": {
                    bgcolor: "#3F41A6B2",
                  },
                }}
              >
                Lưu thông tin
              </Button>
            </div>
          </div> */}
        </div>
        <UpdateHistory />
      </div>

      {/* Create Complain */}
      <CreateComplain
        open={openCreateComplain}
        setOpen={setOpenCreateComplain}
        order_id={id}
        setReload={setReload}
      />

      {/* Rating Item */}
      <RatingDialog
        open={openRating}
        setOpen={setOpenRating}
        orderItem={selectedItem}
      />

      {/* Paying */}
      <ReqPaying
        open={openPayingReq}
        setOpen={setOpenPayingReq}
        req={selectedReq}
        setReload={setReload}
      />

      {/* Detail Request */}
      <DeltailRequest
        open={openDetailReq}
        setOpen={setOpenDetailReq}
        req={selectedReq}
      />

      {/* Cancel Order */}
      <CancelOrder
        open={openCancel}
        setOpen={setOpenCancel}
        id={id}
        setOrder={setOrder}
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

export default OrderDetail;
