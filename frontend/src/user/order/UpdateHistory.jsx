import {
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Snackbar,
  Pagination,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import Reject from "./Reject";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import no_avt from "../../assets/blank-avatar.png";
import {
  CurrencyFormatter,
  TimeDateFormatter,
  TimeDateFormatterAfterXDays,
} from "../../util/Format";

function UpdateHistory({ order, setOrderReload }) {
  const axiosPrivate = useAxiosPrivate();
  const [openReject, setOpenReject] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);
  const [msg, setMsg] = useState("");
  const [reload, setReload] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);

  const [histList, setHistList] = useState([]);
  const [selectedNoti, setSelectedNoti] = useState({});
  const [count, setCount] = useState(0);
  const itemsLimit = 4;
  console.log(order);

  useEffect(() => {
    axiosPrivate
      .get(`/order-history/?order=${order.id}&limit=${itemsLimit}&offset=0`)
      .then((res) => {
        console.log(res.data);
        setCount(res.data.count);
        setPageCount(Math.ceil(res.data.count / itemsLimit));
        setHistList(res.data.results);
        setDefaultPage(1);
      })
      .catch((err) => {
        console.log(err);
      });
    setReload(false);
  }, [reload]);

  const getHistForPage = (e, page) => {
    let offset = itemsLimit * (page - 1);
    axiosPrivate
      .get(
        `/order-history/?order=${order.id}&limit=${itemsLimit}&offset=${offset}`
      )
      .then((res) => {
        console.log(res.data);
        setCount(res.data.count);
        let currCount = Math.ceil(res.data.count / itemsLimit);
        if (currCount !== pageCount) setPageCount(currCount);
        setHistList(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // handle Accept Change
  const handleAcceptChange = (histId) => {
    axiosPrivate
      .patch(`/order-history/${histId}/`, {
        status: "ACCEPTED",
      })
      .then((res) => {
        console.log(res.data);

        setMsg("Chấp nhận thay đổi thành công!");

        setOpenSBar(true);
        setOrderReload(true);
        setReload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Close Reject/Accept SnackBar Success/Err
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setDefaultPage(1);
    setOpenSBar(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Paper
        sx={{
          width: "fit-content",
          minWidth: "350px",
          border: "1px solid #d6d3d1",
        }}
      >
        <div className="flex justify-between items-center px-5 py-3 leading-[150%] max-w-[400px]">
          <div className="text-lg font-semibold text-zinc-800">
            Lịch sử cập nhật
          </div>
          <div className="text-sm text-neutral-600">{count} cập nhật</div>
        </div>

        <Divider />

        <List
          sx={{
            width: "fit-content",

            bgcolor: "background.paper",
            padding: 0,
          }}
        >
          {histList.length > 0 ? (
            histList.map((hist, i) => (
              <ListItem
                alignItems="flex-start"
                sx={{
                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                }}
                key={i}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={order?.studio?.friendly_name}
                    src={order?.studio?.avatar ?? no_avt}
                  />
                </ListItemAvatar>
                <ListItemText>
                  {hist.fields === "order_item" ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex-auto">
                        <span className="font-semibold text-indigo-800">
                          {order?.studio?.friendly_name}{" "}
                        </span>
                        <span className="text-neutral-600">
                          thêm sản phẩm mới
                        </span>
                      </div>

                      <div className="flex gap-2  items-center leading-6">
                        <div className=" text-zinc-800 font-semibold flex gap-2">
                          {hist?.new_value?.item_name}
                          <span className="w-fit h-fit text-indigo-800 font-normal text-sm leading-4 rounded bg-indigo-100 px-2 py-1">
                            x {hist?.new_value?.quantity}
                          </span>
                          {hist?.new_value?.price && (
                            <span className=" text-stone-500">:</span>
                          )}
                        </div>
                        <div className=" text-zinc-00">
                          {hist?.new_value?.price &&
                            CurrencyFormatter(hist?.new_value?.price)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex-auto">
                        <span className="font-semibold text-indigo-800">
                          {order?.studio?.friendly_name}{" "}
                        </span>
                        <span className="text-neutral-600">cập nhật </span>
                        <span className="font-semibold text-zinc-800">
                          {hist?.fields === "total_price"
                            ? "giá tổng"
                            : hist?.fields}
                        </span>
                      </div>

                      <div className="flex gap-2 text-indigo-800 leading-[150%]">
                        <div className="w-fit h-7 text-indigo-800 text-sm leading-5 justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                          {CurrencyFormatter(hist?.old_value)}
                        </div>
                        <EastIcon sx={{ color: "#3F41A6" }} />
                        <div className="w-fit h-7 text-indigo-800 text-sm leading-5 justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                          {CurrencyFormatter(hist?.new_value)}
                        </div>
                      </div>
                    </div>
                  )}
                  {hist?.status === "PENDING" ? (
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="flex gap-2 text-sm leading-6">
                        <div className="flex gap-1 flex-col text-black">
                          <div>Thời gian cập nhật :</div>
                          <div className="">Thời hạn phản hồi :</div>
                        </div>
                        <div className="flex gap-1 flex-col self-start text-stone-500">
                          <div>{TimeDateFormatter(hist?.created_at)}</div>
                          <div>
                            {TimeDateFormatterAfterXDays(hist?.created_at, 3)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-center">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedNoti(hist);
                            setOpenReject(true);
                          }}
                          sx={{
                            textTransform: "none",
                            border: "1px solid #3F41A6",
                            color: "#3F41A6",
                            width: "fit-content",
                            padding: "3px 13px",
                            fontSize: "12px",
                            borderRadius: "20px",
                            "&:hover": {
                              border: "1px solid #3949AB",
                            },
                          }}
                        >
                          Từ chối
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleAcceptChange(hist.id)}
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            color: "#F6F5FB",
                            bgcolor: "#3F41A6",
                            width: "fit-content",
                            padding: "3px 13px",
                            fontSize: "12px",
                            "&:hover": {
                              bgcolor: "#3949AB",
                            },
                          }}
                        >
                          Chấp nhận
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center text-sm leading-6 mt-4">
                      <div className=" text-zinc-900">Trạng thái :</div>
                      {hist?.status === "REJECTED" ? (
                        <div className="w-fit h-fit text-red-500 text-sm leading-5 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                          Đã từ chối
                        </div>
                      ) : (
                        <div className="w-fit h-fit text-green-600 text-sm leading-5 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                          Đã chấp nhận
                        </div>
                      )}
                    </div>
                  )}
                </ListItemText>
              </ListItem>
            ))
          ) : (
            <div className="my-2 ml-5 text-sm text-neutral-400 h-[400px]">
              Chưa có cập nhật nào
            </div>
          )}
        </List>

        {/* Reject Dialog */}
        <Reject
          open={openReject}
          setOpen={setOpenReject}
          noti={selectedNoti}
          studio={order.studio}
          setOpenSBar={setOpenSBar}
          setMsg={setMsg}
          setReload={setReload}
          setOrderReload={setOrderReload}
        />

        {/* Snackbar */}
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
            {msg}
          </Alert>
        </Snackbar>
      </Paper>

      {/* Pagination */}
      {histList.length > 0 && (
        <Pagination
          count={pageCount}
          onChange={getHistForPage}
          defaultPage={defaultPage}
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
  );
}

export default UpdateHistory;
