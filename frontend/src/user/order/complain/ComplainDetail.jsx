import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IoIosSend } from "react-icons/io";
import { useParams, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import avatar from "../../../assets/avatar.png";
import ResponseText from "../../../components/ResponseText";
import { convertRole, convertTime, convertStatus } from "./helpFunction";
import { useCookies } from "react-cookie";
import PaymentList from "../../../components/PaymentList";

const id = window.location.pathname.split("/")[3];
const ws = new WebSocket(`ws://localhost:8000/ws/complain-forum/${id}/`);

function ComplainDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [complainData, setComplainData] = React.useState({});
  const [relies, setRelies] = React.useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [cookies] = useCookies(["userInfo"]);
  const [reply, setReply] = React.useState("");
  const [error, setError] = React.useState("");
  const limit = 20;
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [pageNext, setPageNext] = React.useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = React.useState(false);

  const endOfMessagesRef = React.useRef(null);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log(id);
    axiosPrivate
      .get(`/complain/${id}`)
      .then((res) => {
        console.log(res.data);
        setComplainData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosPrivate
      .get(`/complain-reply/`, {
        params: {
          limit: limit,
          offset: (page - 1) * 10,
          complain: id,
        },
      })
      .then((res) => {
        console.log(res);
        setRelies(res.data.results);
        setPageNext(res.data.next);
        setPageCount(Math.ceil(res.data.count / limit));
      })
      .catch((err) => {
        console.log(err);
      });

    ws.onopen = () => {
      console.log("connected");
    };

    ws.onclose = () => {
      console.log("disconnected");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.reply?.user?.username !== cookies.userInfo?.username) {
        setRelies([...relies, data.reply]);
      }

      window.addEventListener("beforeunload", () => ws.close());
      return () => {
        // Remove the event listener when the component is unmounted
        window.removeEventListener("beforeunload", () => ws.close());
      };
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [pageCount]);

  const handleLoadMoreResponse = (e) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0) {
      if (pageNext) {
        axiosPrivate
          .get(pageNext)
          .then((res) => {
            setRelies([...relies, ...res.data.results]);
            setPageNext(res.data.next);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handleReply = () => {
    if (reply === "") {
      setError("Không thể gửi phản hồi trống");
      return;
    }
    axiosPrivate
      .post(`/complain-reply/`, { complain: id, text: reply })
      .then((res) => {
        setReply("");
        // send data with socket
        var data = {
          type: "reply",
          reply: res.data,
        };
        ws.send(JSON.stringify(data));
        setRelies([...relies, res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeReply = (e) => {
    setReply(e.target.value);
  };

  const handleCompleted = () => {
    axiosPrivate
      .patch(`/complain/${id}/`, { status: "RESOLVED" })
      .then((res) => {
        setComplainData({ ...complainData, status: "RESOLVED" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefund = () => {
    setOpenPaymentDialog(true);
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

        <Link
          component="button"
          underline="none"
          key="3"
          color="inherit"
          // href="/orders"
          onClick={() =>
            navigate(`/order/detail/${state?.orderId}`, { replace: true })
          }
        >
          Đơn hàng #{state?.orderId}
        </Link>

        <Typography
          key="4"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Chi tiết khiếu nại
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-5"></div>

      <Paper
        sx={{
          width: "800px",
          margin: "20px auto",
          border: "1px solid #d6d3d1",
          paddingBottom: "20px",
        }}
      >
        <div className="flex flex-col px-10 py-5 bg-white rounded-md">
          <div className="flex justify-between w-full ">
            <div className="flex gap-4">
              <img
                loading="lazy"
                srcSet={
                  complainData.user?.avatar ? complainData.user?.avatar : avatar
                }
                placeholder="user avatar"
                className="w-11 h-11 rounded-full "
              />
              <div className="flex flex-col justify-around">
                <div className="text-base tracking-wider text-black">
                  {complainData.user?.full_name}
                </div>
                <div className="text-sm font-medium tracking-wide text-indigo-800">
                  {convertRole(complainData.user?.role)}
                </div>
              </div>
            </div>
            <div className=" my-auto text-xs font-semibold tracking-wide text-indigo-800">
              {convertTime(complainData.created_at)}
            </div>
          </div>
          <Divider sx={{ marginY: "20px" }} />

          <div className="flex flex-col gap-5">
            <div className="text-lg font-semibold text-gray-700">
              {complainData.title}
            </div>
            <div className="flex gap-3.5 self-start text-sm leading-5">
              <div className="grow my-auto text-zinc-900">Phân loại :</div>
              <div className="justify-center px-2 py-1 text-indigo-800 bg-indigo-100 rounded">
                {complainData.type === "REFUND" ? "Hoàn tiền" : "Khác"}
              </div>
            </div>

            <div className="flex gap-3.5 self-start text-sm leading-5">
              <div className="grow my-auto text-zinc-900">Trạng thái :</div>

              {complainData?.status === "PENDING" ? (
                <div className="w-fit text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 px-3 flex justify-center self-center">
                  Chờ xử lý
                </div>
              ) : complainData?.status === "RESOLVED" ? (
                <div className="w-fit text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 px-3 flex justify-center">
                  Đã giải quyết
                </div>
              ) : complainData?.status === "IN_PROGRESS" ? (
                <div className="w-fit text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 px-3 flex justify-center">
                  Đang xử lý
                </div>
              ) : null}
            </div>

            <div className="text-sm leading-6 text-black">
              {complainData.description}
            </div>
            {complainData.pictures?.map((picture, i) => {
              return (
                <img
                  key={i}
                  loading="lazy"
                  srcSet={picture.picture}
                  className="max-w-full aspect-[1.92] w-[645px]"
                />
              );
            })}
          </div>
        </div>
      </Paper>

      <div className="text-indigo-800 text-xl font-semibold flex justify-center whitespace-nowrap mt-10">
        Phản hồi khiếu nại
      </div>
      <div className="flex items-center flex-col text-center justify-center gap-5 my-5">
        <div
          className="max-h-screen text-left w-800 flex flex-col gap-5 rounded-lg"
          onScroll={handleLoadMoreResponse}
        >
          {relies.map((reply, i) => {
            return <ResponseText reply={reply} />;
          })}
          <div ref={endOfMessagesRef} />
        </div>

        <Paper
          sx={{
            width: "800px",
            marginX: "auto",
            border: "1px solid #d6d3d1",
          }}
        >
          <div className="flex flex-col px-10 py-5 bg-white rounded">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-4">
                <img
                  loading="lazy"
                  srcSet={
                    cookies.userInfo?.avatar ? cookies.userInfo?.avatar : avatar
                  }
                  className="w-11 h-11 rounded-full "
                />
                <div className="flex flex-col items-start justify-around">
                  <div className="text-base tracking-wider text-black">
                    {cookies.userInfo?.full_name}
                  </div>
                  <div className="text-sm font-medium tracking-wide text-indigo-800">
                    {convertRole(cookies.userInfo?.role)}
                  </div>
                </div>
              </div>
              <div className=" text-xs font-semibold tracking-wide text-indigo-800">
                {convertTime(new Date())}
              </div>
            </div>
            <Divider sx={{ marginY: "10px" }} />

            <TextField
              name="reply"
              multiline
              rows={2}
              placeholder="Để lại phản hồi của bạn..."
              sx={{
                width: "100%",
              }}
              onChange={handleChangeReply}
              value={reply}
              helperText={error ? error : ""}
              error={error ? true : false}
            />

            <div className="flex gap-5 justify-end my-3">
              <Button
                variant="contained"
                startIcon={<IoIosSend style={{ fontSize: "18px" }} />}
                onClick={handleReply}
                sx={{
                  textTransform: "none",
                  bgcolor: "#3F41A6",
                  width: "fit-content",
                  padding: "3px 15px",
                  borderRadius: "4px",
                  "&:hover": {
                    bgcolor: "#3949AB",
                  },
                }}
                disabled={complainData.status == "RESOLVED" || reply === ""}
              >
                Gửi
              </Button>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex justify-center my-5 gap-5">
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 20px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
          onClick={handleCompleted}
          disabled={complainData.status === "RESOLVED"}
        >
          Hoàn tất khiếu nại
        </Button>
      </div>

      <PaymentList
        open={openPaymentDialog}
        setOpen={setOpenPaymentDialog}
        order_id={id}
      />
    </div>
  );
}

export default ComplainDetail;
