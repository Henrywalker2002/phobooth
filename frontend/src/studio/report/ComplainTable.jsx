import React, { useState, useEffect } from "react";
import {
  Rating,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const handleDate = (modified_at) => {
  const date = new Date(modified_at);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

function ComplainTable({studioInfor} ) {
  const sortTypes = [
    {value : '-modified_at', label : 'Mới nhất'},
    {value : 'modified_at', label : 'Cũ nhất',},
    {value : "IN_PROGRESS", label : "Đang xử lý",},
    {value : "RESOLVED", label : "Đã giải quyết",}
  ];
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [complainList, setComplainList] = useState([]);
  const limit = 10;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let params = {
      limit : limit,
      offset : (page - 1) * limit,
    }
    if (filter) {
      if (filter == "IN_PROGRESS" || filter == "RESOLVED") {
        params.status = filter;
      } else {
        params.ordering = filter;
      }
    }
    axiosPrivate.get('/complain/', {params : params}).then((res) => {
      setComplainList(res.data.results);
      setTotalItem(res.data.count);
    }).catch((res) => {
      console.log(res.data);
    });
  }, [page, filter])
  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: "1000px",
        margin: "20px auto",
        border: "0.5px solid #d6d3d1",
      }}
    >
      <div className="flex py-6 px-12 flex-col items-start gap-5">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2 flex-col">
            <div className="flex-auto text-xl font-semibold leading-7 text-zinc-900">
              Khiếu nại liên quan
            </div>
            <div className="leading-[150%] text-zinc-500">Tổng số : {totalItem}</div>
          </div>
          <TextField
            id="outlined-select-currency"
            select
            value={filter}
            sx={{
              "& .MuiInputBase-input": {
                width: "180px",
                height: "40px",
                boxSizing: "border-box",
                paddingY: "9px",
                fontSize: "14px",
              },
            }}
            onChange={(e) => setFilter(e.target.value)}
          >
            {sortTypes.map((option, index) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <TableContainer component={Paper} sx={{ width: "900px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#E2E5FF" }}>
              <TableRow>
                <TableCell sx={{ color: "#3F41A6" }}>STT</TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Tên khiếu nại
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Phân loại
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Ngày cập nhật
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Đơn hàng
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Trạng thái
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complainList.length > 0 ? (
                complainList.map((complain, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() => navigate(`/complain/detail/${complain.id}`)}
                  >
                    <TableCell component="th" scope="row">
                      {complain.id}
                    </TableCell>
                    <TableCell align="left">{complain.title}</TableCell>
                    <TableCell align="left">
                      <div className="w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100  px-2 py-1">
                        {complain?.type}
                      </div>
                    </TableCell>
                    <TableCell align="left">{handleDate(complain.modified_at)}</TableCell>
                    <TableCell align="left">{complain.order}</TableCell>
                    <TableCell align="left">
                      {complain.status === "PENDING" ? (
                        <div className="w-[115px] text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 flex justify-center">
                          Chờ xử lý
                        </div>
                      ) : complain.status === "RESOLVED" ? (
                        <div className="w-[115px] text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 flex justify-center">
                          Đã giải quyết
                        </div>
                      ) : complain.status === "IN_PROGRESS" ? (
                        <div className="w-[115px] text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 flex justify-center">
                          Đang xử lý
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>No item</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={Math.ceil(totalItem / limit)}
          onChange={(e, value) => setPage(value)}
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
    </Paper>
  );
}

export default ComplainTable;
