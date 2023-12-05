import React from "react";
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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Navbar from "../components/Navbar";

function Orders() {
  // Collapsible table
  function createData(id, createdDate, quantity, status, price) {
    return {
      id,
      createdDate,
      quantity,
      status,
      price,
      details: [
        {
          name: "Chụp ảnh gia đình",
          type: "Dịch vụ",
          category: "Gia đình",
          quantity: 1,
          price: "200000-400000",
        },
        {
          name: "Chụp ảnh gia đình",
          type: "Dịch vụ",
          category: "Gia đình",
          quantity: 1,
          price: "200000-400000",
        },
      ],
    };
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell align="left">{row.createdDate}</TableCell>
          <TableCell align="left">{row.quantity}</TableCell>
          <TableCell align="left">
            <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
              {row.status}
            </div>
          </TableCell>
          <TableCell align="left">{row.price}</TableCell>
          <TableCell align="left">
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
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* <Typography variant="h6" gutterBottom component="div">
                  Chi tiết
                </Typography> */}
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
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
                    {row.details.map((detailedRow, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <div className="items-stretch flex gap-5">
                            <img
                              loading="lazy"
                              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                              className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                            />
                            <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                              {detailedRow.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{detailedRow.type}</TableCell>
                        <TableCell align="left">
                          {detailedRow.category}
                        </TableCell>
                        <TableCell align="left">
                          {detailedRow.quantity}
                        </TableCell>
                        <TableCell align="left">{detailedRow.price}</TableCell>
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

  const rows = [
    createData("ANUW482NUENQ", "20-10-2023", "2", "Đã đặt", "200000 - 400000"),
    createData("ANUW482NUENQ", "20-10-2023", "2", "Đã chấp nhận", "800000"),
    createData("ANUW482NUENQ", "20-10-2023", "2", "Vận chuyển", "800000"),
  ];
  return (
    <div>
      <Navbar />
      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-10">
        Quản lý đơn hàng
      </div>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ width: "1250px", margin: "20px auto" }}
      >
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#F6F5FB", color: "#3F41A6" }}>
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
                GIÁ (VNĐ)
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                HÀNH ĐỘNG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Orders;
