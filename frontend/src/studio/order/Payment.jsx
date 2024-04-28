import {
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CreateRequest from "./CreateRequest";
import dayjs from "dayjs";
import EditRequest from "./EditRequest";
import DelRequest from "./DelRequest";
import DeltailRequest from "./DeltailRequest";
import { isBeforeToday } from "../../util/Compare";
import { translateOrderStatus } from "../../util/Translate";

function Payment({ order, setOrder }) {
  // global
  const axiosPrivate = useAxiosPrivate();
  // dialog
  const [openCreateReq, setOpenCreateReq] = useState(false);
  const [openSBar, setOpenSbar] = useState(false);
  const [openEditReq, setOpenEditReq] = useState(false);
  const [openDelReq, setOpenDelReq] = useState(false);
  const [openDetailReq, setOpenDetailReq] = useState(false);

  // local
  const [requestList, setRequestList] = useState([]);
  const [deltailReq, setDetailReq] = useState({});
  const [editReq, setEditReq] = useState({});
  const [delReq, setDelReq] = useState({});
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  useEffect(() => {
    axiosPrivate
      .get(`/order/${order.id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
        setRequestList(res.data.payment);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [order.id, openSBar]);

  const handleOpenDeltailReq = (reqId) => {
    axiosPrivate
      .get(`/payment/${reqId}`)
      .then((res) => {
        console.log(res);
        setDetailReq(res.data);
      })
      .then(() => setOpenDetailReq(true))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenEditReq = (e, reqId) => {
    e.stopPropagation();
    axiosPrivate
      .get(`/payment/${reqId}`)
      .then((res) => {
        console.log(res);
        setEditReq(res.data);
      })
      .then(() => setOpenEditReq(true))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenDelReq = (e, reqId) => {
    e.stopPropagation();
    axiosPrivate
      .get(`/payment/${reqId}`)
      .then((res) => {
        console.log(res);
        setDelReq(res.data);
      })
      .then(() => setOpenDelReq(true))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSbar(false);
  };

  // disable button
  const CreateReqButton = () => {
    if (
      order.status === "CANCELED" ||
      order.status === "ORDERED" ||
      order.status === "COMPLETED" ||
      order.total_price === order.amount_created
    ) {
      return (
        <Tooltip
          title={
            "Bạn không thể cập nhật khi đơn đang trạng thái " +
            `"${translateOrderStatus(order.status)}" ` +
            "hoặc số tiền cần thanh toán đã được tạo hết."
          }
        >
          <span>
            <Button
              disabled
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                bgcolor: "#3F41A6",
                width: "140px",
                height: "35px",
                borderRadius: "20px",
                "&:hover": {
                  bgcolor: "#3949AB",
                },
              }}
            >
              Tạo yêu cầu
            </Button>
          </span>
        </Tooltip>
      );
    }
    return (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateReq(true)}
        sx={{
          textTransform: "none",
          bgcolor: "#3F41A6",
          width: "140px",
          height: "35px",
          borderRadius: "20px",
          "&:hover": {
            bgcolor: "#3949AB",
          },
        }}
      >
        Tạo yêu cầu
      </Button>
    );
  };

  const EditIconButton = ({ row }) => {
    if (row.status === "PAID" || order.status === "CANCELED") {
      return (
        <Tooltip
          title={
            "Bạn không thể cập nhật khi đơn đang trạng thái 'Hủy đơn' hoặc yêu cầu đã được thanh toán."
          }
        >
          <span>
            <IconButton disabled>
              <MdEdit
                style={{
                  width: "22px",
                  height: "22px",
                  // color: row.status === "PAID" ? "#C5CEE0" : "#979797",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
      );
    }
    return (
      <IconButton onClick={(e) => handleOpenEditReq(e, row.id)}>
        <MdEdit
          style={{
            width: "22px",
            height: "22px",
            // color: row.status === "PAID" ? "#C5CEE0" : "#979797",
          }}
        />
      </IconButton>
    );
  };

  const DelIconButton = ({ row }) => {
    if (row.status === "PAID" || order.status === "CANCELED") {
      return (
        <Tooltip
          title={
            "Bạn không thể xóa khi đơn đang trạng thái 'Hủy đơn' hoặc yêu cầu đã được thanh toán."
          }
        >
          <span>
            <IconButton disabled>
              <MdDeleteOutline
                style={{
                  width: "22px",
                  height: "22px",
                  // color: row.status === "PAID" ? "#C5CEE0" : "#979797",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
      );
    }
    return (
      <IconButton onClick={(e) => handleOpenDelReq(e, row.id)}>
        <MdDeleteOutline
          style={{
            width: "22px",
            height: "22px",
            // color: row.status === "PAID" ? "#C5CEE0" : "#979797",
          }}
        />
      </IconButton>
    );
  };

  return (
    <Paper
      sx={{
        width: "100%",
        margin: "30px auto",
        border: "1px solid #d6d3d1",
        paddingBottom: "20px",
      }}
      elevation={3}
    >
      <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start max-md:max-w-full max-md:px-5">
        Yêu cầu thanh toán
      </div>
      <Divider />

      <div className="flex flex-col gap-2 justify-between my-7 px-8  max-w-full w-[1200px] max-md:flex-wrap">
        <div className="flex flex-col max-w-[350px] gap-2">
          <div className="flex gap-5 justify-between leading-[150%]">
            <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
              Số tiền đã thanh toán
            </div>
            <div className="text-lg font-semibold text-green-600">
              {formatter.format(order.amount_paid)}
            </div>
          </div>
          <div className="flex gap-5 justify-between text-sm">
            <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
              Số tiền chưa thanh toán
            </div>
            <div className="text-lg font-semibold text-red-500">
              {formatter.format(order.total_price - order.amount_paid)}
            </div>
          </div>
        </div>

        <div className="flex w-[520px] justify-between items-center">
          <div className="w-[350px] flex gap-5 justify-between text-sm items-center">
            <div className="text-zinc-500 text-sm font-medium font-['Roboto'] uppercase leading-[1.5rem] tracking-wide">
              Số tiền đã tạo yêu cầu
            </div>
            <div className="text-lg font-semibold text-indigo-800">
              {formatter.format(order.amount_created)}
            </div>
          </div>

          <CreateReqButton />
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="collapsible table"
        sx={{
          width: "fit-content",
          border: "0.5px solid #d6d3d1",
          borderRadius: "5px",
          marginX: "auto",
          // marginLeft: "40px",
        }}
      >
        <TableHead sx={{ bgcolor: "#E2E5FF" }}>
          <TableRow>
            <TableCell align="left" sx={{ color: "#3F41A6" }}>
              STT
            </TableCell>
            <TableCell align="left" sx={{ color: "#3F41A6" }}>
              SỐ TIỀN
            </TableCell>
            <TableCell align="left" sx={{ color: "#3F41A6" }}>
              THỜI HẠN
            </TableCell>
            <TableCell align="left" sx={{ color: "#3F41A6" }}>
              TRẠNG THÁI
            </TableCell>
            <TableCell align="left" sx={{ color: "#3F41A6" }}>
              HÀNH ĐỘNG
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requestList?.length > 0 ? (
            requestList?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ borderBottom: "unset", cursor: "pointer" }}
                onClick={() => handleOpenDeltailReq(row.id)}
              >
                <TableCell sx={{ maxWidth: "50px" }}>{row.no}</TableCell>
                <TableCell component="th" scope="row" sx={{ width: "150px" }}>
                  {formatter.format(row.amount)}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ width: "fit-content", paddingRight: "50px" }}
                >
                  <div className="flex gap-3">
                    <div className="text-zinc-900 text-sm leading-5 self-center my-auto">
                      {dayjs(row.expiration_date).format("DD-MM-YYYY")}
                    </div>
                    {isBeforeToday(row.expiration_date) ? (
                      <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-red-500 bg-opacity-20 px-3">
                        Quá hạn
                      </div>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell align="left" sx={{ width: "170px" }}>
                  {row.status === "PENDING" ? (
                    <div className="w-fit text-red-500 text-xs leading-5 whitespace-nowrap rounded bg-red-500 bg-opacity-20 px-2 py-1">
                      Chưa thanh toán
                    </div>
                  ) : row.status === "PAID" ? (
                    <div className="w-fit text-green-600 text-xs leading-5 whitespace-nowrap rounded bg-green-600 bg-opacity-20 px-2 py-1">
                      Đã thanh toán
                    </div>
                  ) : null}
                </TableCell>

                <TableCell align="left" sx={{ width: "130px" }}>
                  <EditIconButton row={row} />
                  <DelIconButton row={row} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No Request</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create New Request */}
      <CreateRequest
        open={openCreateReq}
        setOpen={setOpenCreateReq}
        orderId={order.id}
        setOpenSbar={setOpenSbar}
        total_count={
          requestList.length > 0 ? requestList[requestList.length - 1]?.no : 0
        }
        total_price={order.total_price}
        amount_created={order.amount_created}
      />

      {/* Create Request successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={3000}
        onClose={handleCloseSBar}
        message="Cập nhật yêu cầu thành công"
      />

      {/* Update Request */}
      <EditRequest
        open={openEditReq}
        setOpen={setOpenEditReq}
        editReq={editReq}
        setEditReq={setEditReq}
        setOpenSbar={setOpenSbar}
        total_price={order.total_price}
        amount_created={order.amount_created}
      />

      {/* Delete Request */}
      <DelRequest
        open={openDelReq}
        setOpen={setOpenDelReq}
        delReq={delReq}
        setOrder={setOrder}
        setRequestList={setRequestList}
      />

      {/* Detail Request */}
      <DeltailRequest
        open={openDetailReq}
        setOpen={setOpenDetailReq}
        req={deltailReq}
      />
    </Paper>
  );
}

export default Payment;
