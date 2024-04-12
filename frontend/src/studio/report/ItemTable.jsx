import React from "react";
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
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ItemTable() {
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const itemList = [
    {
      no: 1,
      name: "Chụp ảnh gia đình",
      type: "Dịch vụ",
      category: "Gia đình",
      star: "4.8",
      min_price: "200",
      max_price: "400",
    },
    {
      no: 2,
      name: "Chụp ảnh gia đình",
      type: "Dịch vụ",
      category: "Gia đình",
      star: "4.8",
      min_price: "200",
      max_price: "400",
    },
  ];

  const sortTypes = [
    "Mới nhất",
    "Cũ nhất",
    "Đánh giá cao nhất",
    "Giá cao nhất",
  ];

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
              Xếp hạng sản phẩm
            </div>
            <div className="flex gap-5 text-sm items-center">
              <div className="leading-[150%] text-zinc-500">Tổng số : 20</div>
              <Link
                variant="text"
                component="button"
                onClick={() => navigate("/studio/items")}
                sx={{
                  textTransform: "none",
                  color: "#3F41A6",
                  fontSize: "14px",
                  fontWeight: "600px",
                  padding: "0",
                  "&:hover": {
                    color: "#1A237E",
                  },
                }}
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
          <TextField
            id="outlined-select-currency"
            select
            defaultValue="Mới nhất"
            sx={{
              "& .MuiInputBase-input": {
                width: "180px",
                height: "40px",
                boxSizing: "border-box",
                paddingY: "9px",
                fontSize: "14px",
              },
            }}
          >
            {sortTypes.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
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
                  Tên sản phẩm
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Phân loại
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Danh mục
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Đánh giá
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Giá
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemList.length > 0 ? (
                itemList.map((item, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.no}
                    </TableCell>
                    <TableCell align="left">
                      <div className="items-stretch flex gap-5">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                          className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                        />
                        <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                          {item.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                        {item?.type}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                        {item?.category}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="flex items-center gap-1">
                        <div className="text-sm text-indigo-800 font-medium tracking-wider">
                          {item?.star}
                        </div>
                        <Rating
                          name="read-only"
                          value={item?.star}
                          readOnly
                          size="small"
                          sx={{ color: "#3F41A6" }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {item.min_price && item.max_price
                        ? `${formatter.format(
                            item.min_price
                          )} - ${formatter.format(item.max_price)}`
                        : ""}
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
          count={3}
          // onChange={getServiceForPage}
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

export default ItemTable;
