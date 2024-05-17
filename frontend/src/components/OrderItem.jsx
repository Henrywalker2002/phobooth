import { translateOrderStatus, translateType } from "../util/Translate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

function getPrice(item) {
  if (item.price) {
    return formatter.format(item.price);
  } else if (item.min_price && item.max_price) {
    return (
      formatter.format(item.min_price) +
      " - " +
      formatter.format(item.max_price)
    );
  }
  return "Chưa cập nhật";
}

function Row(props) {
  const { row } = props;
  return (
    <React.Fragment>
      <TableRow sx={{ borderBottom: "unset" }}>
        <TableCell component="th" scope="row">
          <div className="items-stretch flex gap-5">
            <img
              loading="lazy"
              src={
                row.item?.picture
                  ? row.item?.picture
                  : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
              }
              className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full rounded-lg"
            />

            <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-normal truncate my-auto rounded-lg">
              {row.item?.name}
            </div>
          </div>
        </TableCell>
        <TableCell align="left">
          <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch aspect-[2.3448275862068964] px-2 py-1">
            {translateType(row.item?.type)}
          </div>
        </TableCell>
        <TableCell align="left">
          <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch aspect-[2.3448275862068964] px-2 py-1">
            {row.item?.category?.title}
          </div>
        </TableCell>
        <TableCell align="center">{row.quantity}</TableCell>
        <TableCell align="left">{getPrice(row)}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function OrderItem({ order }) {
  return (
    <Table
      aria-label="collapsible table"
      sx={{ border: "0.5px solid #d6d3d1", borderRadius: "4px" }}
    >
      <TableHead sx={{ bgcolor: "#E2E5FF" }}>
        <TableRow>
          <TableCell
            align="center"
            sx={{ color: "#3F41A6", width: "32%", fontSize: "16px" }}
          >
            Sản phẩm
          </TableCell>
          <TableCell
            align="left"
            sx={{ color: "#3F41A6", width: "15%", fontSize: "16px" }}
          >
            Phân loại
          </TableCell>
          <TableCell
            align="left"
            sx={{ color: "#3F41A6", width: "20%", fontSize: "16px" }}
          >
            Danh mục
          </TableCell>
          <TableCell
            align="left"
            sx={{ color: "#3F41A6", width: "14%", fontSize: "16px" }}
          >
            Số lượng
          </TableCell>
          <TableCell
            align="left"
            sx={{ color: "#3F41A6", width: "20%", fontSize: "16px" }}
          >
            Giá đơn vị
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {order?.order_item?.length > 0 ? (
          order?.order_item.map((item) => <Row key={item.id} row={item} />)
        ) : (
          <TableRow>
            <TableCell>Chưa có đơn hàng</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
