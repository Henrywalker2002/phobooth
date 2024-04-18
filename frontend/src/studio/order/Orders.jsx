import React, { useState, useEffect } from "react";
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
  Breadcrumbs,
  Link,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { RiSearchLine } from "react-icons/ri";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StudioNavbar from "../../components/StudioNavbar";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Filter from "./Filter";
import { translateOrderStatus, translateType } from "../../util/Translate";
import { DateFormatter } from "../../util/Format";

function Orders() {
  // Collapsible table
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // dialog
  const [openFilter, setOpenFilter] = useState(false);
  // local
  const [pageCount, setPageCount] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [filterVal, setFilterVal] = useState({});
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const getSlugForFilter = (slug) => {
    if (filterVal.status) {
      slug += `&status=${filterVal?.status}`;
    }
    if (filterVal.date_from) {
      slug += `&date_from=${filterVal?.date_from}`;
    }
    if (filterVal.date_end) {
      slug += `&date_end=${filterVal?.date_end}`;
    }
    console.log(slug);
    return slug;
  };

  useEffect(() => {
    let slug = "order/studio/?limit=5&offset=0";
    slug = getSlugForFilter(slug);
    axiosPrivate
      .get(slug)
      .then((res) => {
        // console.log(res.data);
        let count = res.data.count;
        setPageCount(Math.ceil(count / 5));
        setDefaultPage(1);
        setOrders(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filterVal]);

  // get Orders For Each Page
  const getOrdersForPage = (e, page) => {
    let offset = 5 * (page - 1);
    let slug = `/order/studio/?limit=5&offset=${offset}`;
    slug = getSlugForFilter(slug);
    axiosPrivate
      .get(slug)
      .then((res) => {
        // console.log(res.data);
        let currCount = Math.ceil(res.data.count / 5);
        if (currCount !== pageCount) setPageCount(currCount);
        setDefaultPage(page);
        setOrders(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
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

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
      <React.Fragment>
        <TableRow
          hover={true}
          onClick={() => navigate("/studio/order/detail/" + row.id)}
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
          <TableCell align="left">{DateFormatter(row.created_at)}</TableCell>
          <TableCell align="left">{row.order_item.length}</TableCell>
          <TableCell align="left">
            <div className="w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch px-2 py-1">
              {translateOrderStatus(row.status)}
            </div>
          </TableCell>
          <TableCell align="left">
            {row.total_price
              ? formatter.format(row.total_price)
              : "Chưa cập nhật"}
          </TableCell>
          <TableCell align="left">
            {row.status === "ORDERED" ? (
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
                    borderRadius: "10px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ color: "#808080" }}>
                        TÊN HÀNG HÓA
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
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
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
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
          cursor: "pointer",
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
                NGÀY ĐẶT
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                SỐ LƯỢNG HÀNG HÓA
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
                <TableCell>Chưa có đơn hàng</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Filter Dialog */}
      <Filter
        open={openFilter}
        setOpen={setOpenFilter}
        filterVal={filterVal}
        setFilterVal={setFilterVal}
      />

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
    </div>
  );
}

export default Orders;
