import dayjs from "dayjs";

export const DateFormatter = (day) => {
  return dayjs(day).format("DD-MM-YYYY");
};

export const CurrencyFormatter = (price) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(price);
};
