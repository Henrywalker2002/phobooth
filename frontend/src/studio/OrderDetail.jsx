import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
  TextField,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Dialog,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

function OrderDetail(props) {
  // Edit
  let { id } = useParams(props, "id");
  const [order, setOrder] = useState({});
  const [orderItem, setOrderItem] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("OREDERD"); // [1, 2, 3

  useEffect(() => {
    axios
      .get(`/order/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  //   setOrderItem
  // };

  function handleClickOpen(orderItem) {
    setOpen(true);
    setOrderItem(orderItem);
    console.log(orderItem);
  }

  const handleClose = () => {
    setOpen(false);
  };

  // selection
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    let value = event.target.value;
    axios
      .patch(
        `/order/${order.id}/`,
        {
          status: value,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data); // TODO: notify for user
        setStatus(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Collapsible table
  function createData(item, type, category, quantity, price) {
    return {
      item,
      type,
      category,
      quantity,
      price,
    };
  }

  function getPrice(item) {
    if (item.price) {
      return item.price;
    }
    return item.item.min_price + " - " + item.item.max_price;
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell sx={{ maxWidth: "50px" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
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
              {row.item.type === "service" ? "Dịch vụ" : "Sản phẩm"}
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {/* {row.item.category.name} */}
              Chụp ảnh gia đình
            </div>
          </TableCell>
          <TableCell align="left">{row.quantity}</TableCell>
          <TableCell align="left">{getPrice(row)}</TableCell>
          <TableCell align="left">
            <IconButton>
              <MdEdit
                onClick={() => handleClickOpen(row.id)}
                style={{ width: "22px", height: "22px", color: "#C5CEE0" }}
              />
            </IconButton>
            <IconButton>
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

  const rows = [
    createData("Chụp hình gia đình", "Dịch vụ", "Gia đình", 1, 200000),
    createData("Khung ảnh trắng", "Sản phẩm", "Khung ảnh", 1, 100000),
    createData("Chụp hình gia đình", "Gói dịch vụ", "Gia đình", 1, 240000),
  ];
  return (
    <div>
      <Navbar />
      <TableContainer
        component={Paper}
        sx={{ width: "1200px", margin: "50px auto" }}
      >
        <div className="items-stretch shadow-sm bg-white flex justify-between gap-5 px-20 py-4 rounded-lg">
          <div className="text-indigo-800 text-xl font-semibold leading-8 whitespace-nowrap">
            {order.id}
          </div>
          {/* <div className="text-neutral-600 text-sm leading-5 self-center whitespace-nowrap my-auto">
            3 hàng hóa
          </div> */}
        </div>
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#F6F5FB", color: "#3F41A6" }}>
            <TableRow>
              <TableCell sx={{ maxWidth: "50px" }} />
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                HÀNG HÓA
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
            {order.order_item?.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>

        <div className="self-center w-full max-w-[1200px] mt-5 mb-7">
          <div className="flex justify-between px-16">
            <div className="flex flex-col items-stretch w-[200px]">
              <div className="flex grow flex-col items-stretch px-5">
                <div className="items-center flex justify-between gap-4 pr-20">
                  <div className="text-indigo-950 text-sm font-medium leading-4 tracking-wide uppercase grow whitespace-nowrap my-auto">
                    vận chuyển
                  </div>
                  <Checkbox inputProps={{ "aria-label": "Checkbox demo" }} />
                </div>
                <div className="text-indigo-950 text-sm font-medium leading-4 tracking-wide uppercase whitespace-nowrap mt-4">
                  trạng thái Đơn hàng
                </div>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    onChange={handleChange}
                    sx={{ marginTop: "10px", height: "33px" }}
                    defaultValue={status} // NOT WORKING ?
                  >
                    <MenuItem value={"ORDERED"}>ORDERED</MenuItem>
                    <MenuItem value={"IN_PROCESS"}>IN_PROCESS</MenuItem>
                    <MenuItem value={"SHIPPING"}>SHIPPING</MenuItem>
                    <MenuItem value={"COMPLETED"}>COMPLETED</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[300px] ml-5">
              <div className="items-stretch flex justify-between gap-5 px-5 max-md:mt-10">
                <div className="text-indigo-950 text-lg leading-7 whitespace-nowrap">
                  Tổng cộng
                </div>
                <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
                  {order.total_price || 0} VNĐ
                </div>
              </div>
            </div>
          </div>
        </div>
      </TableContainer>

      {/* Dialog Edit */}
      <Dialog open={open} onClose={handleClose}>
        <div className="max-w-[400px] border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex flex-col items-stretch pb-10 rounded-lg border-solid">
          <div className="shadow-sm bg-white flex items-center justify-end w-full gap-16 pl-20 pr-2 py-4 rounded-lg ">
            <div className="text-indigo-800 text-2xl font-semibold leading-9 whitespace-nowrap">
              Tùy chỉnh
            </div>
            <IconButton onClick={handleClose}>
              <FaXmark />
            </IconButton>
          </div>
          <div className="flex w-full justify-start gap-4 mt-3 pl-5">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/dd7e23482da9be4fe42570372d7f1c5c8f20adafcb759e4ea962934e54566ac9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
              className="aspect-square object-contain object-center w-[60px] overflow-hidden shrink-0 max-w-full"
            />
            <div className=" flex grow basis-[0%] flex-col py-1">
              <div className="justify-center text-yellow-950 text-lg font-semibold">
                Chụp ảnh gia đình
              </div>
              <div className="z-[1] flex justify-start gap-5 mt-2.5 -mb-1.5 pr-20 items-start max-md:pr-5">
                <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                  Dịch vụ
                </div>
                <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                  Gia đình
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col mt-5 pl-5">
            <div className="flex items-center gap-6">
              <div className="justify-center flex flex-col">
                <div className="text-zinc-900 text-sm leading-5">Giá (VNĐ)</div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="500000"
                  sx={{
                    marginTop: "5px",
                    width: "100px",
                    boxSizing: "border-box",
                  }}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
                {/* <div className="text-stone-500 text-xs font-light tracking-wide whitespace-nowrap justify-center items-stretch border-[color:var(--Border,#EAEAEA)] mt-1.5 px-14 py-4 rounded-md border-2 border-solid max-md:px-5">
                  500,000
                </div> */}
              </div>
              <div className="justify-center items-center border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex gap-0 p-2 rounded-[170px] border-solid self-end">
                <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                  <IconButton color="primary">
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
                  1
                </div>
                <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                  <IconButton color="primary">
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
            </div>
            <Button
              variant="contained"
              sx={{
                marginTop: "50px",
                marginX: "auto",
                textTransform: "none",
                borderRadius: "43px",
                color: "#F6F5FB",
                bgcolor: "#3F41A6",
                width: "130px",
                "&:hover": {
                  bgcolor: "#3F41A6B2",
                },
              }}
              onClick={() => {
                axios
                  .patch(
                    `/order-item/${orderItem}/`,
                    {
                      price: price,
                      quantity: quantity,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  )
                  .then((res) => {
                    setOrder(res.data);
                    setOpen(false);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default OrderDetail;
