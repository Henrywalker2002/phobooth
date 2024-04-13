import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  Breadcrumbs,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { RiSearchLine } from "react-icons/ri";
import TransferDialog from "./TransferDialog";

function Requests() {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const transferList = [
    {
      no: 1,
      studio: "Studio Demo",
      amount: "3000000",
      requestedDate: "10-11-2023",
      status: "PENDING",
    },
    {
      no: 2,
      studio: "Studio Demo",
      amount: "5000000",
      requestedDate: "05-11-2023",
      status: "RESOLVED",
    },
  ];
  const [openTransfer, setOpenTransfer] = useState(false);
  return (
    <div>
      <AdminNavbar />

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
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/admin", { replace: true })}
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
          Chuyển tiền cho Studio
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-2">
        Chuyển tiền cho Studio
      </div>

      <div className="flex gap-5 items-center w-fit mx-auto my-5">
        <TextField
          id="outlined-item-type"
          select
          defaultValue={"Mới nhất"}
          sx={{
            width: "150px",
            // height: "50px",
            borderRadius: "10px",
            "& .MuiInputBase-input": {
              boxSizing: "border-box",
              padding: "8px 12px",
            },
          }}
        >
          <MenuItem value={"Mới nhất"}>Mới nhất</MenuItem>
          <MenuItem value={"Cũ nhất"}>Cũ nhất</MenuItem>
          <MenuItem value={"Chưa chuyển"}>Chưa chuyển</MenuItem>
          <MenuItem value={"Đã chuyển"}>Đã chuyển</MenuItem>
        </TextField>

        <TextField
          id="input-with-icon-textfield"
          sx={{
            "& .MuiInputBase-input": {
              padding: "10px 12px",
              width: "330px",
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
          placeholder="Tìm kiếm"
          variant="outlined"
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{ margin: "20px auto", maxWidth: "1000px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell sx={{ color: "#3F41A6", width: "140px" }}>
                STT
              </TableCell>
              <TableCell sx={{ color: "#3F41A6", width: "250px" }}>
                STUDIO
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "250px" }}>
                SỐ TIỀN YÊU CẦU
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "200px" }}>
                NGÀY YÊU CẦU
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "140px" }}>
                HÀNH ĐỘNG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transferList.length > 0 ? (
              transferList.map((request, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {request.no}
                  </TableCell>
                  <TableCell align="left">
                    <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow my-auto truncate max-w-[200px]">
                      {request.studio}
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    {formatter.format(request.amount)}
                  </TableCell>

                  <TableCell align="left">{request.requestedDate}</TableCell>
                  <TableCell align="left">
                    {request.status === "PENDING" ? (
                      <Button
                        variant="text"
                        onClick={() => setOpenTransfer(true)}
                        sx={{
                          color: "#3F41A6",
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#F6F5FB",
                            borderRadius: "43px",
                          },
                        }}
                      >
                        Chuyển tiền
                      </Button>
                    ) : (
                      <div className="w-fit text-green-600 text-sm leading-5 whitespace-nowrap rounded bg-green-600 bg-opacity-20 px-3 py-1">
                        Đã chuyển
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No Request</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination  */}
      <Pagination
        count={3}
        sx={{
          margin: "0 auto",
          width: "fit-content",
          "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
            {
              bgcolor: "#E2E5FF",
            },
        }}
      />

      {/* Transfer Dialog */}
      <TransferDialog open={openTransfer} setOpen={setOpenTransfer} />
    </div>
  );
}

export default Requests;
