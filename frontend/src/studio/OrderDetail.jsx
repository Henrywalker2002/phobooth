import React, { useState } from "react";
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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function OrderDetail() {
  // selection
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
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
                {row.item}
              </div>
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {row.type}
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {row.category}
            </div>
          </TableCell>
          <TableCell align="left">{row.quantity}</TableCell>
          <TableCell align="left">{row.price}</TableCell>
          <TableCell align="left">
            <Button
              variant="text"
              sx={{
                color: "#3F41A6",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#F6F5FB",
                  borderRadius: "43px",
                },
              }}
            >
              Đánh giá
            </Button>
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
            ABYW527BH
          </div>
          <div className="text-neutral-600 text-sm leading-5 self-center whitespace-nowrap my-auto">
            3 hàng hóa
          </div>
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
            {rows.map((row) => (
              <Row key={row.name} row={row} />
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
                    defaultValue="Đã đặt"
                  >
                    <MenuItem value={1}>Đang tiến hành</MenuItem>
                    <MenuItem value={2}>Vận chuyển</MenuItem>
                    <MenuItem value={3}>Hoàn thành</MenuItem>
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
                  540,000
                </div>
              </div>
            </div>
          </div>
        </div>
      </TableContainer>
    </div>
  );
}

export default OrderDetail;
