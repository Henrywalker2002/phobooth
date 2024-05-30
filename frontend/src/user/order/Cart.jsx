import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  Avatar,
} from "@mui/material";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ClearIcon from "@mui/icons-material/Clear";
import { useLocation, useNavigate } from "react-router-dom";
import CartContext from "../../context/CartProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { translateType } from "../../util/Translate";
import { useCookies } from "react-cookie";
import no_avt from "../../assets/blank-avatar.png";

function Cart() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["accInfo"]);
  const [openNoItemAlert, setOpenNoItemALert] = useState(false);
  const [items, setItems] = React.useState([]);
  const [order_item, set_order_item] = useState([]);
  const { setItemLists } = useContext(CartContext);
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const [pageCount, setPageCount] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const itemPerPage = 2;

  const getTotalPrice = (lst, typ) => {
    if (lst.length) {
      let result = lst.reduce((total, row) => {
        if (row?.item?.fixed_price) {
          return total + row?.number * row?.item?.fixed_price;
        } else {
          return total + row?.number * row?.item[typ];
        }
      }, 0);
      // console.log(result);
      return result;
    }
    return 0;
  };

  const showTotalPrice = (lst) => {
    let min_price = getTotalPrice(lst, "min_price");
    let max_price = getTotalPrice(lst, "max_price");
    if (min_price === max_price) return formatter.format(min_price);
    else
      return formatter.format(min_price) + " - " + formatter.format(max_price);
  };

  function getPrice(row) {
    if (row?.item?.fixed_price) {
      return formatter.format(row?.item?.fixed_price * row?.number);
    }
    let min_price = row?.item?.min_price * row?.number;
    let max_price = row?.item?.max_price * row?.number;
    return formatter.format(min_price) + " - " + formatter.format(max_price);
  }

  useEffect(() => {
    let slug = `/cart/?limit=${itemPerPage}&offset=0`;
    axiosPrivate
      .get(slug)
      .then((res) => {
        console.log(res.data);
        let count = res.data.count;
        setPageCount(Math.ceil(count / itemPerPage));
        setDefaultPage(1);
        setItems(res.data.results);

        let initialOrderList = res.data.results.map((lst) => {
          return { ...lst, items: [] };
        });
        set_order_item(initialOrderList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getOrdersForPage = (e, page) => {
    let offset = itemPerPage * (page - 1);
    let slug = `/cart/?limit=${itemPerPage}&offset=${offset}`;
    axiosPrivate
      .get(slug)
      .then((res) => {
        console.log(res.data);
        let currCount = Math.ceil(res.data.count / itemPerPage);
        if (currCount !== pageCount) setPageCount(currCount);
        setDefaultPage(page);
        setItems(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkOrderItemExisted = () => {
    for (let lst of order_item) {
      if (lst.items.length > 0) return true;
    }
    return false;
  };

  const handleBooking = () => {
    if (checkOrderItemExisted()) {
      let updateOrderLst = order_item.filter((lst) => lst.items.length > 0);
      setItemLists(
        updateOrderLst.map((lst) => {
          return {
            ...lst,
            address: { ...cookies.accInfo.address },
          };
        })
      );
      navigate("/booking", { state: { from: location } }, { replace: true });
    } else setOpenNoItemALert(true);
  };

  const handleSelectItem = (row, studio) => {
    let selectedLst = order_item.find((lst) => lst.studio.id === studio.id);
    if (!selectedLst) {
      let newOrderItem = [...order_item];
      newOrderItem.push({ studio: studio, items: [row] });
      set_order_item(newOrderItem);
    } else {
      let new_order_item = order_item.map((lst) => {
        if (lst.studio.id === studio.id) {
          let newList = { ...lst };
          newList.items.push(row);
          return newList;
        } else return lst;
      });
      set_order_item(new_order_item);
    }
    // console.log("order_item", order_item);
  };

  const handleRemoveItem = (studioId, rowId) => {
    let selectedLst = order_item.find((lst) => lst.studio.id === studioId);
    if (selectedLst) {
      let new_order_item = order_item.map((lst) => {
        if (lst.studio.id === studioId) {
          let new_items = lst.items.filter((item) => item.id !== rowId);
          let newLst = { ...lst, items: new_items };
          return newLst;
        } else return lst;
      });
      set_order_item(new_order_item);
    }
  };

  //   check selected item in selectList
  const isSelectedItem = (itemId, studioId) => {
    let selectLst = order_item?.find((lst) => lst.studio.id === studioId);
    if (selectLst) {
      let result = selectLst.items.find(
        (order_item) => order_item.id === itemId
      );
      // console.log(selectLst, result);
      if (result) return true;
      else return false;
    } else return false;
  };

  const handleDelete = (id) => {
    axiosPrivate.delete(`/cart/${id}/`).then((res) => {
      window.location.reload();
    });
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
          marginTop: "20px",
          paddingLeft: "100px",
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
          Quản lý giỏ hàng
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap">
        Quản lý giỏ hàng
      </div>
      {/* Tables */}
      <div className="flex flex-col items-center">
        {items?.length > 0 ? (
          <>
            {items.map((lst, index) => (
              <TableContainer
                component={Paper}
                key={index}
                sx={{
                  width: "82%",
                  margin: "15px auto",
                  border: "0.5px solid #d6d3d1",
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                    <TableRow>
                      <TableCell sx={{ width: "5%" }} />
                      <TableCell sx={{ color: "#3F41A6", width: "35%" }}>
                        SẢN PHẨM
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: "#3F41A6", width: "10%" }}
                      >
                        PHÂN LOẠI
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: "#3F41A6", width: "15%" }}
                      >
                        DANH MỤC
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: "#3F41A6", width: "10%" }}
                      >
                        SỐ LƯỢNG
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: "#3F41A6", width: "20%" }}
                      >
                        GIÁ THÀNH PHẦN
                      </TableCell>
                      <TableCell sx={{ width: "5%" }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lst.items.length > 0 ? (
                      lst.items?.map((row, index) => (
                        <TableRow
                          key={index}
                          id={row.item?.id}
                          // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell sx={{ width: "42px" }}>
                            <Checkbox
                              onChange={(e) =>
                                e.target.checked
                                  ? handleSelectItem(row, lst.studio)
                                  : handleRemoveItem(lst.studio.id, row.id)
                              }
                              checked={isSelectedItem(row.id, lst.studio.id)}
                              inputProps={{ "aria-label": "Checkbox demo" }}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#3F41A6",
                                },
                              }}
                            />
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
                            <div className="w-fit h-fit text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                              {translateType(row.item?.type)}
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div className="w-fit h-fit text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                              {row?.item?.category?.title}
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div className="text-zinc-900 text-sm leading-6">
                              {row.number}
                            </div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontWeight: "540",
                              fontSize: "15px",
                            }}
                          >
                            {getPrice(row)}
                            {/* {row.min_price} - {row.max_price} */}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDelete(row.id)}
                              sx={{
                                padding: 0,
                                border: "0.5px solid #d6d3d1",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                              }}
                            >
                              <ClearIcon
                                sx={{
                                  width: "15px",
                                  height: "15px",
                                }}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell />
                        <TableCell>Chưa có sản phẩm trong giỏ hàng</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* More Info */}
                <div className="self-center flex w-full items-stretch justify-between px-[80px] my-3">
                  <div className="max-w-[400px] border border-[color:var(--gray-scale-gray-100,#d6d3d1)] bg-white flex flex-col items-stretch py-3 px-5 rounded-lg border-solid">
                    <div className="flex items-stretch justify-between gap-3">
                      <Avatar
                        alt={lst.studio?.friendly_name}
                        src={lst.studio?.avatar ?? no_avt}
                        sx={{ width: 60, height: 60 }}
                      />
                      <div className="justify-center text-indigo-800 text-lg font-semibold tracking-wider self-center grow shrink basis-auto my-auto">
                        {lst.studio?.friendly_name}

                        <div style={{ color: "#848484", fontSize: "14px" }}>
                          {lst.studio?.type == "STUDIO"
                            ? "Cửa hàng"
                            : "Thợ chụp ảnh"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-stretch justify-between gap-5 mt-2">
                      <Button
                        variant="outlined"
                        startIcon={<IoChatboxEllipses />}
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#3F41A6",
                          color: "#3F41A6",
                          padding: "5px 20px",
                          textTransform: "none",
                          width: "fit-content",
                          "&:hover": {
                            bgcolor: "#F6F5FB",
                            borderColor: "#3F41A6",
                          },
                        }}
                      >
                        Chat ngay
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<MdStorefront />}
                        onClick={() =>
                          navigate(`/studio/${lst.studio.code_name}`)
                        }
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#1A093E",
                          color: "#1A093E",
                          padding: "5px 20px",
                          textTransform: "none",
                          width: "fit-content",
                          "&:hover": {
                            bgcolor: "#F2F2F2",
                            borderColor: "#1A093E",
                          },
                        }}
                      >
                        Xem cửa hàng
                      </Button>
                    </div>
                  </div>
                  <div className="max-w-[500px] self-center flex grow basis-[0%] flex-col items-stretch my-auto px-5">
                    <div className="justify-between bg-white flex">
                      <div className="text-zinc-900 text-lg font-semibold leading-8 whitespace-nowrap">
                        Tổng giá tham khảo :
                      </div>
                      <div className="text-indigo-800 text-lg font-semibold leading-6 self-center whitespace-nowrap">
                        {showTotalPrice(lst.items)}
                      </div>
                    </div>
                    <div className="text-stone-500 text-base leading-6 mt-4">
                      Lưu ý: Giá trên chỉ là giá tham khảo, giá chính xác sẽ
                      được cửa hàng cập nhật và thông báo sau khi đặt sản phẩm.
                    </div>
                  </div>
                </div>
              </TableContainer>
            ))}

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
          </>
        ) : (
          <div>Chưa có sản phẩm trong giỏ hàng</div>
        )}
      </div>

      {/* Btn */}
      <div className="max-w-[1200px] mx-auto mb-6 flex justify-end">
        <Button
          variant="contained"
          sx={{
            marginRight: "50px",
            textTransform: "none",
            borderRadius: "43px",
            color: "#F6F5FB",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            "&:hover": {
              bgcolor: "#3F41A6B2",
            },
          }}
          onClick={handleBooking}
        >
          Đặt sản phẩm
        </Button>
      </div>

      {/* No Item Alert */}
      <Dialog open={openNoItemAlert} onClose={() => setOpenNoItemALert(false)}>
        <DialogTitle id="alert-dialog-title">Chọn sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Vui lòng chọn sản phẩm trước khi đặt hàng.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "#3F41A6" }}
            onClick={() => setOpenNoItemALert(false)}
            autoFocus
          >
            Đóng lại
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Cart;
