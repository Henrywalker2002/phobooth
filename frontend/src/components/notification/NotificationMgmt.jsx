import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import {
  Breadcrumbs,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { RiSearchLine } from "react-icons/ri";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import handleContentNotification from "./handleContentNotification";
import CircleIcon from "@mui/icons-material/Circle";
import StudioNavbar from "../StudioNavbar";
import AdminNavbar from "../AdminNavbar";

function Row(props) {
  const navigate = useNavigate();
  const { row } = props;
  return (
    <React.Fragment>
      <TableRow
        onClick={() => navigate("../" + row?.redirect_url, { replace: false })}
        sx={{ borderBottom: "unset", cursor: "pointer" }}
      >
        <TableCell>
          {!row.is_read && (
            <CircleIcon
              sx={{
                color: "#3F41A6",
                width: "10px",
                height: "10px",
                alignSelf: "center",
              }}
            />
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.type}
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.title}
        </TableCell>
        <TableCell align="left">
          <div className=" text-indigo-800 text-sm">{row?.message}</div>
        </TableCell>
        <TableCell align="left">{row?.timestamp}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function NotificationMgmt() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const [notifications, setNotifications] = useState([]);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    axiosPrivate
      .get(`/notification/?limit=5&offset=0`)
      .then((res) => {
        var results = res.data.results;
        console.log(res.data);
        let count = res.data.count;
        setPageCount(Math.ceil(count / 5));
        setNotifications(
          results.map((notification) => handleContentNotification(notification))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getOrdersForPage = (e, page) => {
    let offset = 5 * (page - 1);
    let slug = `/notification/?limit=5&offset=${offset}`;
    // slug = getSlugForFilter(slug);
    axiosPrivate
      .get(slug)
      .then((res) => {
        console.log(res.data);
        let currCount = Math.ceil(res.data.count / 5);
        if (currCount !== pageCount) setPageCount(currCount);
        setNotifications(
          res.data.results.map((notification) =>
            handleContentNotification(notification)
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {state?.role === "admin" ? (
        <AdminNavbar />
      ) : state?.role === "studio" ? (
        <StudioNavbar />
      ) : (
        <Navbar />
      )}

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
          onClick={() => {
            if (state?.role === "admin") navigate("/admin", { replace: true });
            else if (state?.role === "studio")
              navigate("/studio", { replace: true });
            else navigate("/", { replace: true });
          }}
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
          Quản lý thông báo
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-5">
        Quản lý thông báo
      </div>

      {/* Search + Filter */}
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
          //   onClick={() => {
          //     setOpenFilter(true);
          //   }}
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
          width: "1100px",
          margin: "20px auto",
          border: "0.5px solid #d6d3d1",
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ color: "#3F41A6", width: "200px" }}>
                LOẠI THÔNG BÁO
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "200px" }}>
                NGƯỜI GỬI
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                NỘI DUNG
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                THỜI GIAN
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length > 0 ? (
              notifications.map((row) => <Row key={row?.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell />
                <TableCell>Chưa có thông báo nào</TableCell>
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
    </div>
  );
}

export default NotificationMgmt;
