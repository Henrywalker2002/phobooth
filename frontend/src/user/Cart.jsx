import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
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
} from "@mui/material";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import CartContext from "../context/CartProvider";
import useAuth from "../hooks/useAuth";

function Cart() {
  const { auth } = useAuth();
  const [items, setItems] = React.useState([]);
  const [order_item, set_order_item] = React.useState([]);
  const navigate = useNavigate();
  const { setItemLists } = useContext(CartContext);
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const getTotalPrice = (lst, typ) => {
    if (lst.length) {
      let result = lst.reduce((total, row) => {
        if (row?.item?.fixed_price) {
          return total + row?.number * row?.item?.fixed_price;
        } else {
          return total + row?.number * row?.item[typ];
        }
      }, 0);
      console.log(result);
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
    axios
      .get("/cart/?limit=10&offset=0", {
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      })
      .then((res) => {
        console.log(res.data.results);
        let initialOrderList = res.data.results.map((lst) => {
          return { ...lst, items: [] };
        });
        console.log(initialOrderList);
        setItems(res.data.results);
        set_order_item(initialOrderList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBooking = () => {
    let updateOrderLst = order_item.filter((lst) => lst.items.length > 0);

    setItemLists(updateOrderLst);
    navigate("/booking");
  };

  const handleSelectItem = (e, row, studioId) => {
    let selectedLst = order_item.find((lst) => lst.studio.id === studioId);
    if (e.target.checked) {
      selectedLst.items.push(row);
    } else {
      let new_items;
      new_items = selectedLst.items.filter(
        (item) => item.item.id !== row.item.id
      );
      selectedLst.items = new_items;
    }
  };

  const handleChangeNumber = (row, op) => {
    let number = row?.number;
    if (op === "-") number--;
    else number++;

    let updateData = { ...row, number: number };
    console.log(updateData);

    axios
      .put(`/cart/${row.id}/`, updateData, {
        headers: {
          Authorization: `Bearer ${auth.access}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        // setItems(res.data.results);
      })
      .catch((err) => {
        console.log(err);
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
          marginTop: "30px",
          paddingLeft: "120px",
        }}
      >
        <Link
          underline="hover"
          key="1"
          sx={{ color: "#808080" }}
          href="/"
          // onClick={handleClick}
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
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-2">
        Quản lý giỏ hàng
      </div>
      {/* Tables */}
      <div className="flex flex-col gap-5">
        {items.length > 0 ? (
          items.map((lst) => (
            <TableContainer
              component={Paper}
              key={lst.studio.id}
              sx={{
                width: "1200px",
                margin: "20px auto",
                border: "0.5px solid #d6d3d1",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                  <TableRow>
                    <TableCell>
                      {/* <Checkbox inputProps={{ "aria-label": "Checkbox demo" }} /> */}
                    </TableCell>
                    <TableCell sx={{ color: "#3F41A6" }}>SẢN PHẨM</TableCell>
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
                      GIÁ THÀNH PHẦN
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lst.items.length > 0 ? (
                    lst.items?.map((row, index) => (
                      <TableRow
                        key={index}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell sx={{ width: "42px" }}>
                          <Checkbox
                            onChange={(e) =>
                              handleSelectItem(e, row, lst.studio.id)
                            }
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
                              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                              className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                            />
                            <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                              {row?.item?.name}
                              {/* {row.item} */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                            {/* {row?.item.category?.type == "SERVICE" ? "Dịch vụ" : ""} */}
                            {row.item?.type}
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                            {row?.item?.category?.title}
                            {/* {row.category} */}
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          {/* {row?.number} */}

                          <div className="w-fit justify-center items-center border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex gap-0 px-2 py-1 rounded-[170px] border-solid self-end">
                            <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                              <IconButton
                                color="primary"
                                onClick={() => handleChangeNumber(row, "-")}
                              >
                                <RiSubtractFill
                                  style={{
                                    color: "#666666",
                                    width: "15px",
                                    height: "15px",
                                  }}
                                />
                              </IconButton>
                            </div>
                            <div className="text-zinc-900 text-center text-sm leading-6 mx-2">
                              {row.number}
                            </div>
                            <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                              <IconButton
                                color="primary"
                                onClick={() => handleChangeNumber(row, "+")}
                              >
                                <IoIosAdd
                                  style={{
                                    color: "#666666",
                                    width: "15px",
                                    height: "15px",
                                  }}
                                />
                              </IconButton>
                            </div>
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
              <div className="self-center flex w-full max-w-6xl items-stretch justify-start gap-[220px] my-5">
                <div className="max-w-[320px] ml-[90px] border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex grow basis-[0%] flex-col items-stretch pl-5 pr-5 py-5 rounded-lg border-solid">
                  <div className="flex items-stretch justify-between gap-4">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/6fa50a05989caa3ba29862834f44435ae27b25c493ce115cb332a0688e26b02c?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                      className="aspect-square object-contain object-center w-[43px] overflow-hidden shrink-0 max-w-full"
                    />
                    <div className="justify-center text-indigo-800 text-lg font-semibold tracking-wider self-center grow shrink basis-auto my-auto">
                      {lst.studio?.friendly_name}
                    </div>
                  </div>
                  <div className="flex items-stretch justify-between gap-5 mt-4">
                    <Button
                      variant="outlined"
                      startIcon={<IoChatboxEllipses />}
                      sx={{
                        borderRadius: "4px",
                        borderColor: "#3F41A6",
                        color: "#3F41A6",
                        padding: "5px 10px",
                        textTransform: "none",
                        width: "120px",
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
                      sx={{
                        borderRadius: "4px",
                        borderColor: "#1A093E",
                        color: "#1A093E",
                        padding: "5px 10px",
                        textTransform: "none",
                        width: "130px",
                        "&:hover": {
                          bgcolor: "#F2F2F2",
                          borderColor: "#1A093E",
                        },
                      }}
                    >
                      Xem Studio
                    </Button>
                  </div>
                </div>
                <div className="max-w-[450px] mr-10 self-center flex grow basis-[0%] flex-col items-stretch my-auto px-5">
                  <div className="justify-between bg-white flex">
                    <div className="text-zinc-900 text-lg font-semibold leading-8 whitespace-nowrap">
                      Tổng giá tham khảo :
                    </div>
                    <div className="text-indigo-800 text-lg font-semibold leading-6 self-center whitespace-nowrap">
                      {showTotalPrice(lst.items)}
                    </div>
                  </div>
                  <div className="text-stone-500 text-base leading-6 mt-4">
                    Lưu ý: Giá trên chỉ là giá tham khảo, giá chính xác sẽ được
                    Studio cập nhật và thông báo sau khi đặt dịch vụ.
                  </div>
                </div>
              </div>
            </TableContainer>
          ))
        ) : (
          <div>Chưa có sản phẩm trong giỏ hàng</div>
        )}
      </div>

      {/* Btn */}
      <div className="max-w-[1200px] mx-auto mb-6 mt-2 flex justify-end">
        <Button
          variant="contained"
          sx={{
            display: items?.length > 0 ? "button" : "none",
            marginRight: "50px",
            textTransform: "none",
            borderRadius: "43px",
            color: "#F6F5FB",
            bgcolor: "#3F41A6",
            width: "130px",
            "&:hover": {
              bgcolor: "#3F41A6B2",
            },
          }}
          onClick={handleBooking}
        >
          Đặt dịch vụ
        </Button>
      </div>
    </div>
  );
}

export default Cart;
