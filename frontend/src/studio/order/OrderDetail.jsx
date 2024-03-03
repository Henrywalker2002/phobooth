import React, { useEffect, useState } from "react";
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
  Paper,
  Button,
  Checkbox,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
  Snackbar,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddIcon from "@mui/icons-material/Add";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StudioNavbar from "../../components/StudioNavbar";
import AddOrderItem from "./AddOrderItem";
import EditOrderItem from "./EditOrderItem";
import DeleteOrderItem from "./DeleteOrderItem";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function OrderDetail(props) {
  // global
  let { id } = useParams(props, "id");
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // Dialog
  const [openAddItem, setOpenAddItem] = useState(false);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [openDelItem, setOpenDelItem] = useState(false);
  // Snackbar
  const [openStatusSBar, setOpenStatusSbar] = useState(false);
  const [statusMsg, setStatusMsg] = useState(false);
  // local
  const [order, setOrder] = useState({});

  const [selectedItem, setSelectedItem] = useState({});
  const [delivery, setDelivery] = useState(false);
  const [status, setStatus] = useState("ORDERED"); // [1, 2, 3]
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const getOrderDetail = () => {
    axiosPrivate
      .get(`/order/${id}`)
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  // Open Status SnackBar Success/Err
  const handleOpenStatusSBar = (msg) => {
    setStatusMsg(msg);
    setOpenStatusSbar(true);
  };

  // Close Status SnackBar Success/Err
  const handleCloseStatusSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenStatusSbar(false);
  };

  // status selector
  const handleUpdateStatus = (event) => {
    let newStatus = event.target.value;
    axiosPrivate
      .patch(`/order/${id}/`, {
        status: newStatus,
      })
      .then((res) => {
        handleOpenStatusSBar("Cập nhật trạng thái thành công !");
        setStatus(res.data.status);
      })
      .catch((err) => {
        console.log(err);
        handleOpenStatusSBar(err.response.data.status[0]);
      });
  };

  // Edit Order Item Dialog
  const handleOpenEditItem = (item) => {
    // console.log(item);
    setSelectedItem(item);
    setOpenEditItem(true);
  };

  // Delete Order Item Dialog
  const handleOpenDelItem = (item) => {
    setSelectedItem(item);
    setOpenDelItem(true);
  };

  // Need Delivery
  const handleNeedDelivery = (e) => {
    if (e.target.checked) setDelivery(true);
    else setDelivery(false);
  };

  // Collapsible table
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
              <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                {row.item?.name}
              </div>
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {row.item?.type}
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
            <IconButton>
              <MdEdit
                onClick={() => handleOpenEditItem(row)}
                style={{ width: "22px", height: "22px", color: "#C5CEE0" }}
              />
            </IconButton>
            <IconButton onClick={() => handleOpenDelItem(row)}>
              <MdDeleteOutline
                style={{ width: "22px", height: "22px", color: "#C5CEE0" }}
              />
            </IconButton>
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
          // href="/orders"
          onClick={() => navigate("/studio/orders", { replace: true })}
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
          #{order?.id}
        </Typography>
      </Breadcrumbs>

      <TableContainer
        component={Paper}
        sx={{
          width: "1200px",
          margin: "30px auto",
          marginBottom: "200px",
          border: "0.5px solid #d6d3d1",
        }}
      >
        <div className="items-stretch shadow-sm bg-white flex justify-between gap-5 px-12 py-4 rounded-lg">
          <div className="text-indigo-800 text-xl font-semibold leading-8 whitespace-nowrap">
            {order?.order_item?.length} sản phẩm
          </div>

          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenAddItem(true);
            }}
            sx={{
              textTransform: "none",
              color: "#3F41A6",
              "&:hover": {
                bgcolor: "#E2E5FF",
              },
            }}
          >
            Thêm sản phẩm
          </Button>
        </div>
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell sx={{ maxWidth: "50px" }} />
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                SẢN PHẨM
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                PHÂN LOẠI
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                DANH MỤC
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                SỐ LƯỢNG
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                GIÁ ĐƠN VỊ
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {order.order_item?.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>

        <div className="self-center w-full max-w-[1200px] mt-5 mb-7">
          <div className="flex justify-start gap-[440px] px-16">
            <div className="flex flex-col items-stretch w-[200px]">
              <div className="flex grow flex-col items-stretch px-5">
                <div className="items-center flex justify-between gap-4 pr-20">
                  <div className="text-indigo-950 text-sm font-medium leading-4 tracking-wide uppercase grow whitespace-nowrap my-auto">
                    Vận chuyển
                  </div>
                  <Checkbox
                    sx={{
                      "&.Mui-checked": {
                        color: "#3F41A6",
                      },
                    }}
                    onChange={handleNeedDelivery}
                    inputProps={{ "aria-label": "Checkbox demo" }}
                  />
                </div>
                <div className="text-indigo-950 text-sm font-medium leading-4 tracking-wide uppercase whitespace-nowrap mt-4">
                  Trạng thái đơn hàng
                </div>
                {/* Selector */}
                <TextField
                  id="outlined-status"
                  select
                  value={status}
                  onChange={handleUpdateStatus}
                  sx={{
                    marginTop: "10px",
                    "& .MuiOutlinedInput-root": {
                      height: "35px",
                    },
                    "& fieldset": {
                      height: "40px",
                    },
                  }}
                >
                  <MenuItem value={"ORDERED"}>Đã đặt</MenuItem>
                  <MenuItem value={"IN_PROCESS"}>Đang tiến hành</MenuItem>
                  {delivery ? (
                    <MenuItem value={"SHIPPING"}>Vận chuyển</MenuItem>
                  ) : null}
                  <MenuItem value={"COMPLETED"}>Hoàn thành</MenuItem>
                </TextField>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[300px]">
              <div className="items-stretch flex justify-between gap-5 px-5 max-md:mt-10">
                <div className="text-indigo-950 text-lg leading-7 whitespace-nowrap">
                  Tổng cộng
                </div>
                <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
                  {order.total_price
                    ? formatter.format(order.total_price)
                    : "Chưa cập nhật"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TableContainer>

      {/* Update Status successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openStatusSBar}
        autoHideDuration={3000}
        onClose={handleCloseStatusSBar}
        message={statusMsg}
      />

      {/* Dialog Edit */}
      <EditOrderItem
        open={openEditItem}
        setOpen={setOpenEditItem}
        orderItem={selectedItem}
        setOrder={setOrder}
      />
      {/* Dialog Add */}
      <AddOrderItem
        open={openAddItem}
        setOpen={setOpenAddItem}
        getOrderDetail={getOrderDetail}
        orderId={Number(id)}
      />
      {/* Dialog Delete */}
      <DeleteOrderItem
        open={openDelItem}
        setOpen={setOpenDelItem}
        orderItem={selectedItem}
        setOrder={setOrder}
      />
    </div>
  );
}

export default OrderDetail;
