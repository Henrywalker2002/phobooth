import dayjs from "dayjs";

export const DateFormatter = (day) => {
  return dayjs(day).format("DD-MM-YYYY");
};
