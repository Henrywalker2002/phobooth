import dayjs from "dayjs";

export const DateFormatter = (day) => {
  return dayjs(day).format("DD-MM-YYYY");
};

export const TimeDateFormatter = (day) => {
  return dayjs(day).format("HH:mm  DD-MM-YYYY");
};

export const TimeDateFormatterAfterXDays = (day, count) => {
  return dayjs(day).add(count, "day").format("HH:mm  DD-MM-YYYY");
};

export const CurrencyFormatter = (price) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(price);
};
