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
  Alert,
  AlertTitle,
  Tooltip,
} from "@mui/material";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddIcon from "@mui/icons-material/Add";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import StudioNavbar from "../../components/StudioNavbar";
import AddOrderItem from "./AddOrderItem";
import EditOrderItem from "./EditOrderItem";
import DeleteOrderItem from "./DeleteOrderItem";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Payment from "./Payment";
import { translateErrStatusOrder } from "../../util/Translate";

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
        // console.log(res.data);
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
    setStatusMsg(translateErrStatusOrder(msg));
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
        console.log(res.data);
        handleOpenStatusSBar("Cập nhật trạng thái thành công !");
        setStatus(res.data.status);
        setOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.status) {
          handleOpenStatusSBar(err.response.data.status[0]);
        } else {
          handleOpenStatusSBar(err.response.data.detail);
        }
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

  // disable btn
  const EditIconButton = ({ row }) => {
    if (order.status !== "ORDERED") {
      return (
        <Tooltip
          title={"Bạn chỉ được cập nhật khi đơn đang trạng thái 'Đã đặt'"}
        >
          <span>
            <IconButton disabled>
              <MdEdit
                style={{
                  width: "22px",
                  height: "22px",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
      );
    }
    return (
      <IconButton onClick={() => handleOpenEditItem(row)}>
        <MdEdit
          style={{
            width: "22px",
            height: "22px",
          }}
        />
      </IconButton>
    );
  };

  const DelIconButton = ({ row }) => {
    // console.log(row);
    if (order.status !== "ORDERED") {
      return (
        <Tooltip title={"Bạn chỉ được xóa khi đơn đang trạng thái 'Đã đặt'"}>
          <span>
            <IconButton disabled>
              <MdDeleteOutline
                style={{
                  width: "22px",
                  height: "22px",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
      );
    }
    return (
      <IconButton onClick={() => handleOpenDelItem(row)}>
        <MdDeleteOutline
          style={{
            width: "22px",
            height: "22px",
          }}
        />
      </IconButton>
    );
  };

  const AddButton = () => {
    if (order.status !== "ORDERED") {
      return (
        <Tooltip
          title={"Bạn chỉ được thêm sản phẩm khi đơn đang trạng thái 'Đã đặt'"}
        >
          <span>
            <Button
              disabled
              variant="text"
              startIcon={<AddIcon />}
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
          </span>
        </Tooltip>
      );
    }
    return (
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
    );
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
            <EditIconButton row={row} />
            <DelIconButton row={row} />
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

      {/* Detail Order */}
      <TableContainer
        component={Paper}
        sx={{
          width: "1200px",
          margin: "30px auto",
          marginBottom: "50px",
          border: "0.5px solid #d6d3d1",
        }}
      >
        <div className="items-stretch shadow-sm bg-white flex justify-between gap-5 px-12 py-4 rounded-lg">
          <div className="text-indigo-800 text-xl font-semibold leading-8 whitespace-nowrap">
            {order?.order_item?.length} sản phẩm
          </div>

          <AddButton />
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
          {status === "CANCELED" ? (
            <Alert
              sx={{ maxWidth: "1100px", marginX: "auto" }}
              severity="error"
              color="warning"
            >
              Đơn hàng này đã được hủy.
            </Alert>
          ) : (
            <div className="flex justify-start gap-[350px] px-16">
              <div className="flex flex-col items-stretch gap-4 ">
                <div className="flex grow flex-col items-stretch px-5 w-[200px]">
                  <div className="items-center flex justify-between gap-4 pr-20">
                    <div className="text-indigo-800 text-sm font-medium leading-4 tracking-wide uppercase grow whitespace-nowrap my-auto">
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
                  <div className="text-indigo-800 text-sm font-medium leading-4 tracking-wide uppercase whitespace-nowrap mt-4">
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
                    {status == "ORDERED" ? (
                      <MenuItem value={"CANCELED"}>Hủy đơn</MenuItem>
                    ) : null}
                  </TextField>
                </div>
                <Button
                  startIcon={
                    <FaArrowRight style={{ width: "18px", height: "18px" }} />
                  }
                  onClick={() => navigate(`/studio/order/detail/${id}/demo`)}
                  sx={{
                    textTransform: "none",
                    color: "#3F41A6",
                    width: "fit-content",
                    padding: "5px 15px",
                    height: "35px",
                    borderRadius: "5px",
                    fontSize: "15px",
                    "&:hover": {
                      color: "#1A237E",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Cập nhật thành phẩm
                </Button>
              </div>
              <div className="flex flex-col items-stretch gap-5 w-[450px]">
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

                {order.note == null ? null : (
                  <Alert
                    sx={{
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
              </div>
            </div>
          )}
        </div>
      </TableContainer>

      {/* Thông tin vận chuyển */}
      <div className="max-w-[1200px] w-full mx-auto my-10 border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex flex-col items-stretch pb-5 rounded-lg border-solid">
        <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white w-full justify-center pl-6 pr-16 py-5 rounded-lg items-start">
          Thông tin vận chuyển
        </div>
        <div className="flex w-full flex-col items-stretch mt-7 px-9">
          <div className="flex items-stretch justify-between gap-10">
            <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
              <div className="text-neutral-400 text-xs font-medium leading-5 tracking-wide uppercase whitespace-nowrap">
                Tên khách hàng
              </div>
              <div className="mt-2.5 w-full text-base font-medium leading-6 text-indigo-800">
                {order?.customer?.full_name ?? "Chưa cập nhật"}
              </div>
            </div>
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
                {order?.address?.street}, {order?.address?.ward.name_with_type},{" "}
                {order?.address?.district.name_with_type},{" "}
                {order?.address?.province.name_with_type}
              </div>

              <div className="items-stretch flex gap-2 mt-2 pr-20 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
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
            <div className="w-[450px] flex justify-start items-start">
              <div className="max-w-[200px] items-stretch flex basis-[0%] flex-col self-start gap-3">
                <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap self-start">
                  trạng thái vận chuyển
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100  px-2.5 py-1 self-start">
                  Chưa vận chuyển
                </div>
              </div>
            </div>
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
      </div>

      {/* Payment Request */}
      <Payment order={order} setOrder={setOrder} />

      {/* Update Status successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openStatusSBar}
        autoHideDuration={2000}
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
