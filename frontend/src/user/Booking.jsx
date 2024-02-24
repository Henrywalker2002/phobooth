import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // Checkbox,
  IconButton,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import CartContext from "../context/CartProvider";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import ClearIcon from "@mui/icons-material/Clear";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function Booking() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { itemLists } = useContext(CartContext);
  console.log(itemLists);
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

  const handleCreateOrder = () => {
    console.log(itemLists);
    try {
      for (let itemLst of itemLists) {
        let order_item = itemLst.items.map((item) => {
          return { item: item.item.id, quantity: item.number };
        });
        let updateOrderLst = {
          studio: itemLst.studio.id,
          order_item: order_item,
        };
        axios
          .post("/order/", updateOrderLst, {
            headers: {
              Authorization: `Bearer ${auth.access}`,
            },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      navigate("/orders");
    } catch (error) {
      console.log(error);
    }
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

        <Link
          underline="hover"
          key="2"
          color="inherit"
          href="/cart"
          // onClick={handleClick}
        >
          Quản lý giỏ hàng
        </Link>

        <Typography
          key="3"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Đặt sản phẩm
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-10">
        Đặt dịch vụ
      </div>

      {/* Tables */}
      {itemLists?.map((itemList) => (
        <TableContainer
          key={itemList.studio.id}
          component={Paper}
          sx={{
            width: "1200px",
            margin: "20px auto",
            border: "0.5px solid #d6d3d1",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#E2E5FF" }}>
              <TableRow>
                <TableCell sx={{ color: "#3F41A6", paddingLeft: "40px" }}>
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
                  GIÁ (VNĐ)
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemList.items?.map((row, index) => (
                <TableRow
                  key={index}
                  // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ paddingLeft: "40px" }}
                  >
                    <div className="items-stretch flex gap-5">
                      <img
                        loading="lazy"
                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                        className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                      />
                      <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                        {row.item.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                      {row?.item?.type}
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                      {row?.item.category?.title}
                    </div>
                  </TableCell>
                  <TableCell align="left" sx={{ width: "150px" }}>
                    {row.number}
                  </TableCell>
                  <TableCell align="left" sx={{ width: "200px" }}>
                    {getPrice(row)}
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
              ))}
            </TableBody>
          </Table>

          {/* More Info */}
          <div className="self-center flex w-full max-w-6xl items-stretch justify-between gap-5 my-5">
            <div className="ml-[50px] flex flex-col items-start">
              <div className="flex items-stretch justify-between gap-4">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6fa50a05989caa3ba29862834f44435ae27b25c493ce115cb332a0688e26b02c?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="aspect-square object-contain object-center w-[43px] overflow-hidden shrink-0 max-w-full"
                />
                <div className="justify-center text-indigo-800 text-lg font-semibold tracking-wider self-center grow shrink basis-auto my-auto">
                  {itemList.studio.friendly_name}
                </div>
              </div>
              <TextField
                id="outlined-multiline-static"
                label="Lời nhắn"
                multiline
                rows={3}
                placeholder="Để lại ghi chú thêm về dịch vụ..."
                sx={{
                  borderColor: "#E6E6E6",
                  fontSize: "10px",
                  width: "450px",
                  marginTop: "20px",
                }}
              />
            </div>
            <div className="max-w-[450px] mr-7 self-center flex grow basis-[0%] flex-col items-stretch my-auto">
              <TextField
                id="outlined-basic"
                label="Khuyến mãi"
                variant="outlined"
                placeholder="Nhập mã khuyến mãi"
              />
              <div className="justify-between bg-white flex mt-4">
                <div className="text-zinc-900 text-lg font-semibold leading-8 whitespace-nowrap">
                  Tổng giá tham khảo :
                </div>
                <div className="text-indigo-800 text-lg font-semibold leading-6 self-center whitespace-nowrap">
                  {showTotalPrice(itemList.items)}
                </div>
              </div>
              <div className="text-stone-500 text-base leading-6 mt-2">
                Lưu ý: Giá trên chỉ là giá tham khảo, giá chính xác sẽ được
                Studio cập nhật và thông báo sau khi đặt dịch vụ.
              </div>
            </div>
          </div>
        </TableContainer>
      ))}

      {/* Btns */}
      <div className="max-w-[1200px] mx-auto my-6 flex justify-end">
        <Button
          variant="outlined"
          sx={{
            marginRight: "20px",
            borderRadius: "43px",
            borderColor: "#3F41A6",
            color: "#3F41A6",
            padding: "0 30px",
            textTransform: "none",
            width: "120px",
            "&:hover": {
              bgcolor: "#F6F5FB",
              borderColor: "#3F41A6",
            },
          }}
        >
          Hủy đặt
        </Button>
        <Button
          onClick={handleCreateOrder}
          variant="contained"
          sx={{
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
        >
          Đặt dịch vụ
        </Button>
      </div>
    </div>
  );
}

export default Booking;
