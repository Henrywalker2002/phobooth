import React from "react";
import StaffNavbar from "../components/StaffNavbar";
import {
  Breadcrumbs,
  Link,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function Complains() {
  // global
  const navigate = useNavigate();
  const complainData = {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        id: 3,
        user: {
          id: 13,
          username: "first user",
          email: "first@email.com",
          full_name: "First User",
          avatar: null,
        },
        order: 8,
        title: "title",
        type: "REFUND",
        description: "no",
        status: "PENDING",
        pictures: [
          {
            picture:
              "http://127.0.0.1:8000/assets/complain_pictures/dich-vu-chup-hinh-san-pham-2_C5Ot1tH.png",
          },
          {
            picture:
              "http://127.0.0.1:8000/assets/complain_pictures/anh-avatar-dep-35_LOaa2xv.jpg",
          },
        ],
      },
      {
        id: 2,
        user: {
          id: 13,
          username: "first user",
          email: "first@email.com",
          full_name: "First User",
          avatar: null,
        },
        order: 8,
        title: "title",
        type: "REFUND",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum sapien nec accumsan porta. Donec.",
        status: "IN_PROCESS",
        pictures: [
          {
            picture:
              "http://127.0.0.1:8000/assets/complain_pictures/dich-vu-chup-hinh-san-pham-2.png",
          },
          {
            picture:
              "http://127.0.0.1:8000/assets/complain_pictures/anh-avatar-dep-35.jpg",
          },
        ],
      },
      {
        id: 1,
        user: {
          id: 13,
          username: "first user",
          email: "first@email.com",
          full_name: "First User",
          avatar: null,
        },
        order: 8,
        title: "title",
        type: "REFUND",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum sapien nec accumsan porta. Donec.",
        status: "RESOLVED",
        pictures: [
          {
            picture:
              "http://127.0.0.1:8000/assets/complain_pictures/dich-vu-chup-hinh-san-pham-2.png",
          },
          {
            picture:
              "http://127.0.0.1:8000/assets/complain_pictures/anh-avatar-dep-35.jpg",
          },
        ],
      },
    ],
  };
  return (
    <div>
      <StaffNavbar />

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
          // onClick={() => navigate("/", { replace: true })}
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
          Quản lý khiếu nại
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-2">
        Quản lý khiếu nại
      </div>

      <div className="flex gap-16 items-center w-fit mx-auto my-5">
        {/* Selector */}
        <TextField
          id="outlined-item-type"
          select
          defaultValue="LATEST"
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
          <MenuItem value="LATEST">Mới nhất</MenuItem>
          <MenuItem value="EARLIER">Cũ nhất</MenuItem>
          <MenuItem value="PENDING">Chờ xử lý</MenuItem>
          <MenuItem value="IN_PROCESS">Đang xử lý</MenuItem>
          <MenuItem value="RESOLVED">Đã giải quyết</MenuItem>
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
                <IconButton>
                  <RiSearchLine className="w-5 h-5" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{ margin: "20px auto", maxWidth: "1200px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell sx={{ color: "#3F41A6" }}>MÃ KHIẾU NẠI</TableCell>
              <TableCell sx={{ color: "#3F41A6", width: "250px" }}>
                TIÊU ĐỀ
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "200px" }}>
                KHÁCH HÀNG
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "150px" }}>
                PHÂN LOẠI
              </TableCell>

              <TableCell align="left" sx={{ color: "#3F41A6", width: "300px" }}>
                MÔ TẢ
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                TRẠNG THÁI
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complainData?.results.length > 0 ? (
              complainData?.results.map((complain, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {complain.id}
                  </TableCell>
                  <TableCell align="left">
                    <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow my-auto truncate max-w-[200px]">
                      {complain.title}
                    </div>
                  </TableCell>
                  <TableCell align="left">{complain.user.full_name}</TableCell>
                  <TableCell align="left">
                    <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                      {complain.type}
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    <div className="truncate max-w-[250px]">
                      {complain.description}
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    {complain.status === "PENDING" ? (
                      <div className="w-[115px] text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 flex justify-center">
                        Chờ xử lý
                      </div>
                    ) : complain.status === "RESOLVED" ? (
                      <div className="w-[115px] text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 flex justify-center">
                        Đã giải quyết
                      </div>
                    ) : complain.status === "IN_PROCESS" ? (
                      <div className="w-[115px] text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 flex justify-center">
                        Đang xử lý
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No Complain</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        // count={pageCount}
        // onChange={getOrdersForPage}
        count={1}
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

export default Complains;
