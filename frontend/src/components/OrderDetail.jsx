import React, { useState } from "react";
import Navbar from "./Navbar";
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
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ColoredStep } from "./Styles";

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

  //   status process
  const steps = ["Đã đặt", "Đang tiến hành", "Vận chuyển", "Hoàn thành"];
  return (
    <div>
      <Navbar />

      <TableContainer
        component={Paper}
        sx={{ width: "1200px", margin: "50px auto" }}
      >
        <div className="items-stretch shadow-sm bg-white flex justify-between gap-5 px-20 py-4 rounded-lg">
          <div className="text-indigo-800 text-xl font-semibold leading-8 whitespace-nowrap">
            Studio Demo
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

        <Box sx={{ width: "100%", marginY: "50px" }}>
          <Stepper activeStep={2} alternativeLabel>
            {steps.map((label) => (
              <ColoredStep key={label}>
                <StepLabel>{label}</StepLabel>
                {/* <Button
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
                  Hủy đơn
                </Button> */}
              </ColoredStep>
            ))}
          </Stepper>
        </Box>

        {/* payment request + invoice */}
        <div className="w-full max-w-[1200px] mt-8 mb-7">
          <div className="flex justify-around">
            {/* payment request */}
            <div className="flex flex-col w-[437px]">
              <div className="items-stretch flex flex-col px-5">
                <div className="text-neutral-400 text-sm font-medium leading-4 tracking-wide uppercase">
                  Yêu cầu thanh toán mới nhất
                </div>
                <div className="items-stretch border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex justify-between gap-5 mt-5 p-2.5 rounded-lg border-solid">
                  <div className="items-stretch flex grow basis-[0%] flex-col pr-2 py-px">
                    <div className="text-zinc-500 text-base font-medium leading-6">
                      Thanh toán lần 3
                    </div>
                    <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap mt-1.5">
                      148,000
                    </div>
                    <div className="flex items-stretch justify-between gap-2 mt-2.5 max-md:justify-center">
                      <div className="text-zinc-500 text-sm leading-5 self-center whitespace-nowrap my-auto">
                        Thời hạn :
                      </div>
                      <div className="text-zinc-900 text-sm leading-5 self-center my-auto">
                        30-10-2023
                      </div>
                      <div className="text-red-500 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-red-500 bg-opacity-20 grow px-3">
                        Còn 3 ngày
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    sx={{
                      justifyContent: "center",
                      alignSelf: "center",
                      fontSize: "12px",
                      textTransform: "none",
                      borderRadius: "43px",
                      color: "#F6F5FB",
                      bgcolor: "#3F41A6",
                      width: "102px",
                      height: "32px",
                      "&:hover": {
                        bgcolor: "#3F41A6B2",
                      },
                    }}
                  >
                    Thanh toán
                  </Button>
                </div>
                <div className="items-stretch border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex justify-between gap-5 mt-8 p-2.5 rounded-lg border-solid">
                  <div className="items-stretch flex grow basis-[0%] flex-col pr-12 py-px max-md:pr-5">
                    <div className="text-zinc-500 text-base font-medium leading-6">
                      Thanh toán lần 2
                    </div>
                    <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap mt-1.5">
                      200,000
                    </div>
                    <div className="flex items-stretch justify-between gap-2.5 mt-3">
                      <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                        Ngày thanh toán :
                      </div>
                      <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap self-start">
                        20-10-2023
                      </div>
                    </div>
                  </div>
                  <div className="text-green-800 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-green-600 bg-opacity-20 self-center my-auto px-3 py-1">
                    Đã thanh toán
                  </div>
                </div>
                <div className="items-stretch border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex justify-between gap-5 mt-8 p-2.5 rounded-lg border-solid">
                  <div className="items-stretch flex grow basis-[0%] flex-col pr-12 py-px max-md:pr-5">
                    <div className="text-zinc-500 text-base font-medium leading-6">
                      Thanh toán lần 1
                    </div>
                    <div className="text-indigo-800 text-xl font-semibold leading-4 whitespace-nowrap mt-1.5">
                      100,000
                    </div>
                    <div className="flex items-stretch justify-between gap-2.5 mt-3">
                      <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                        Ngày thanh toán :
                      </div>
                      <div className="text-zinc-900 text-sm leading-5 self-start">
                        10-10-2023
                      </div>
                    </div>
                  </div>
                  <div className="text-green-800 text-xs leading-5 whitespace-nowrap justify-center items-stretch rounded bg-green-600 bg-opacity-20 self-center my-auto px-3 py-1">
                    Đã thanh toán
                  </div>
                </div>
              </div>
            </div>

            {/* invoice */}
            <div className="flex flex-col w-[342px]">
              <div className="border border-[color:var(--gray-scale-gray-100,#E6E6E6)] flex w-full grow flex-col pt-5 pb-2.5 rounded-md border-solid">
                <div className="flex items-stretch justify-between gap-5 px-5">
                  <div className="items-stretch flex grow basis-[0%] flex-col self-start">
                    <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                      Mã đơn :
                    </div>
                    <div className="text-zinc-900 text-sm leading-5 mt-1.5">
                      #4152
                    </div>
                  </div>
                  <Divider orientation="vertical" flexItem></Divider>
                  {/* <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/af45067e654c08993f9de515ad13ec344a2c5642faf4f98a8da5c6d66fd47be1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-[0.03] object-contain object-center w-px stroke-[1px] stroke-neutral-200 overflow-hidden shrink-0 max-w-full"
                  /> */}
                  <div className="items-stretch z-[1] flex grow basis-[0%] flex-col pr-8 self-start max-md:pr-5">
                    <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                      hóa đơn :
                    </div>
                    <div className="text-indigo-400 text-sm font-medium leading-4 underline whitespace-nowrap mt-1.5">
                      Xuất hóa đơn
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-200 self-stretch shrink-0 h-px mt-4" />
                <div className="items-stretch self-stretch flex flex-col px-5 py-4">
                  <div className="justify-between items-stretch flex gap-5 pb-3">
                    <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                      Tổng thành phần :
                    </div>
                    <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                      540,000
                    </div>
                  </div>
                  <div className="justify-between items-stretch flex gap-5 py-3">
                    <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                      Phí vận chuyển :
                    </div>
                    <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                      20,000
                    </div>
                  </div>
                  <div className="bg-neutral-200 shrink-0 h-px" />
                  <div className="justify-between items-stretch flex gap-5 py-3">
                    <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                      Khuyến mãi từ PhoBooth:
                    </div>
                    <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                      -20%
                    </div>
                  </div>
                  <div className="justify-between items-stretch flex gap-5 py-3">
                    <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                      Khuyến mãi từ Studio Demo:
                    </div>
                    <div className="text-zinc-900 text-sm font-medium leading-5 whitespace-nowrap">
                      -20%
                    </div>
                  </div>
                  <div className="bg-neutral-200 shrink-0 h-px" />
                  <div className="bg-neutral-200 shrink-0 h-px" />
                  <div className="justify-between items-stretch flex gap-5 py-3">
                    <div className="text-zinc-900 text-lg leading-7 whitespace-nowrap">
                      Tổng cộng
                    </div>
                    <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
                      448,000
                    </div>
                  </div>
                  <div className="bg-neutral-200 shrink-0 h-0.5" />
                  <div className="justify-between items-stretch flex gap-5 py-3">
                    <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                      Đã thanh toán lần 1
                    </div>
                    <div className="text-indigo-800 text-sm font-medium leading-5 whitespace-nowrap">
                      -100,000
                    </div>
                  </div>
                  <div className="justify-between items-stretch flex gap-5 py-3">
                    <div className="text-stone-500 text-sm leading-5 whitespace-nowrap">
                      Đã thanh toán lần 2
                    </div>
                    <div className="text-indigo-800 text-sm font-medium leading-5 whitespace-nowrap">
                      -200,000
                    </div>
                  </div>
                  <div className="bg-neutral-200 z-[1] shrink-0 h-0.5" />
                  <div className="justify-between items-stretch flex gap-5 pt-3">
                    <div className="text-zinc-900 text-lg leading-7 whitespace-nowrap">
                      Còn lại
                    </div>
                    <div className="text-indigo-800 text-lg font-semibold leading-7 whitespace-nowrap">
                      148,000
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TableContainer>

      {/* Thông tin vận chuyển */}
      <div className="max-w-[1200px] w-full mx-auto my-10 border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex flex-col items-stretch pb-5 rounded-lg border-solid">
        <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white w-full justify-center pl-6 pr-16 py-5 rounded-lg items-start">
          Thông tin vận chuyển
        </div>
        <div className="flex w-full flex-col items-stretch mt-7 px-9">
          <div className="flex items-stretch justify-between gap-10">
            <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
              <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                Tên khách hàng
              </div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Dainne Russell"
                sx={{ marginTop: "10px" }}
              />
              {/* <div className="text-indigo-800 text-base leading-6 border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white justify-center mt-1 pl-4 pr-16 py-5 rounded-md border-solid items-start max-md:pr-5">
                Dainne Russell
              </div> */}
            </div>
            <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
              <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                số điện thoại
              </div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="(671) 555-0110"
                sx={{ marginTop: "10px" }}
              />
              {/* <div className="text-stone-500 text-sm leading-5 whitespace-nowrap border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white justify-center mt-1 pl-4 pr-16 py-4 rounded-md border-solid items-start max-md:pr-5">
                (671) 555-0110
              </div> */}
            </div>
          </div>
          <div className="flex items-stretch justify-between gap-5 mt-6 ">
            <div className="max-w-[450px] items-stretch flex grow basis-[0%] flex-col">
              <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap max-md:max-w-full">
                Địa chỉ
              </div>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  onChange={handleChange}
                  sx={{ marginTop: "10px" }}
                >
                  <MenuItem value={1}>
                    4140 Parker Rd. Allentown, New Mexico 31134
                  </MenuItem>
                  <MenuItem value={2}>
                    312 Parker Rd. Allentown, New Mexico
                  </MenuItem>
                  <MenuItem value={3}>
                    235 Parker Rd. Allentown, New Mexico
                  </MenuItem>
                </Select>
              </FormControl>
              {/* <div className="items-stretch border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex justify-between gap-5 mt-1 pl-4 pr-6 py-3.5 rounded-md border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5">
                <div className="text-stone-500 text-sm leading-5 grow whitespace-nowrap max-md:max-w-full">
                  4140 Parker Rd. Allentown, New Mexico 31134
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1079895c4c83422a5a55b4b22fa60622da1f8000ab15b7e422b82a119dbc09c2?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="aspect-square object-contain object-center w-4 justify-center items-center overflow-hidden self-center shrink-0 max-w-full my-auto"
                />
              </div> */}
              <div className="items-stretch flex gap-2 mt-1 pr-20 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/da55b028eb8eefc7a61e4d1e5ccc2031cf3efeae8bb767ce6ad3a7eb23e6b619?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="aspect-square object-contain object-center w-6 overflow-hidden self-center shrink-0 max-w-full my-auto"
                />
                <div className="text-zinc-500 text-sm leading-5 my-auto">
                  Phí vận chuyển :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 aspect-[2.1379310344827585] px-2 py-1">
                  20,000
                </div>
              </div>
            </div>
            <div className="w-[450px] flex justify-start">
              <div className="max-w-[200px] items-stretch flex basis-[0%] flex-col self-start">
                <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap">
                  hàng hóa vận chuyển
                </div>
                <div className="items-stretch border flex w-full flex-col mt-1 pl-3 pr-7 py-1.5 rounded-lg border-solid border-neutral-200 max-md:pr-5">
                  <div className="items-stretch flex justify-between gap-5 pr-5 py-1">
                    <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                      Khung ảnh :
                    </div>
                    <div className="text-indigo-950 text-opacity-80 text-sm leading-5 whitespace-nowrap">
                      x 1
                    </div>
                  </div>
                  <div className="items-stretch flex justify-between gap-5 pr-2 py-1">
                    <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap">
                      Ảnh in :
                    </div>
                    <div className="text-indigo-950 text-opacity-80 text-sm leading-5 whitespace-nowrap">
                      x 10
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-neutral-400 text-xs font-medium leading-3 tracking-wide uppercase whitespace-nowrap mt-9 self-start">
            trạng thái vận chuyển
          </div>
          <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 mt-1 px-2.5 py-1 self-start">
            Chưa vận chuyển
          </div>
          <Button
            variant="contained"
            sx={{
              marginTop: "30px",
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
            Lưu thông tin
          </Button>
          {/* <div className="text-white text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch bg-indigo-800 mt-6 px-8 py-2.5 rounded-[43px] self-start max-md:px-5">
            Lưu thông tin
          </div> */}
        </div>
      </div>

      {/* Btn */}
      <div className="max-w-[1200px] mx-auto my-6 flex justify-center">
        <Button
          variant="outlined"
          sx={{
            marginRight: "50px",
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
          Quay lại
        </Button>
        <Button
          variant="contained"
          sx={{
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
          Khiếu nại
        </Button>
      </div>
    </div>
  );
}

export default OrderDetail;
