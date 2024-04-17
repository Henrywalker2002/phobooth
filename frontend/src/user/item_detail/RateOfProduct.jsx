import React, { useEffect, useState } from "react";
import {
  Box,
  Rating,
  Avatar,
  Button,
  Pagination,
  ImageListItem,
  ImageList,
  Dialog,
  DialogContent,
  Tab,
  Divider,
} from "@mui/material";
import axios from "../../api/axios";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const handleDate = (date) => {
  const newDate = new Date(date);
  return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`;
};

const RateComponent = ({
  rate,
  open,
  setOpen,
  selectedImage,
  setSelectedImage,
}) => {
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex items-center justify-between w-full ">
        <div className="flex gap-2">
          <Avatar srcSet={rate.user?.avatar} />
          <div className="flex flex-col justify-around">
            <div className="text-base tracking-wider text-black">
              {rate.user?.full_name}
            </div>
            <div className="text-xs font-normal leading-5 text-neutral-500">
              {handleDate(rate.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-base text-indigo-800 font-medium tracking-wider">
            {rate.star}
          </div>
          <Rating
            name="read-only"
            value={rate.star}
            precision={0.1}
            readOnly
            size="small"
            sx={{ color: "#3F41A6" }}
          />
        </div>
      </div>
      <div className="w-full text-sm leading-5 text-zinc-500">
        {rate.comment}
      </div>

      {rate.pictures?.length > 0 && (
        <ImageList cols={rate.pictures?.length} rowHeight={160}>
          {rate.pictures.map((picture) => (
            <ImageListItem key={picture.id}>
              <img
                src={picture.picture}
                alt="comment picture"
                style={{ maxHeight: "160px" }}
                onClick={() => handleImageClick(picture.picture)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <img
            src={selectedImage}
            alt="comment picture"
            style={{ maxWidth: "100%" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

function RateOfItem({ item_id, star, description }) {
  const [infoType, setInfoType] = useState("description");

  const handleChangeTab = (event, newValue) => {
    setInfoType(newValue);
  };

  return (
    <TabContext value={infoType}>
      <Box sx={{ marginTop: "50px" }}>
        <TabList
          onChange={handleChangeTab}
          centered
          sx={{
            "&.MuiTabs-root .MuiTabs-scroller .MuiTabs-indicator": {
              bgcolor: "#3F41A6",
              width: "90px",
            },
          }}
        >
          <Tab
            label="Mô tả"
            value="description"
            sx={{
              textTransform: "none",
              fontSize: "20px",
              "&.Mui-selected": {
                color: "#3F41A6",
                fontWeight: "550",
              },
            }}
          />
          <Tab
            label="Đánh giá"
            value="rating"
            sx={{
              textTransform: "none",
              fontSize: "20px",
              "&.Mui-selected": {
                color: "#3F41A6",
                fontWeight: "550",
              },
            }}
          />
        </TabList>
      </Box>
      <TabPanel value="description">
        <Description description={description} />
      </TabPanel>
      <TabPanel value="rating">
        <Rated star={star} item_id={item_id} />
      </TabPanel>
    </TabContext>
  );
}

// Component hiển thị khi các nút được chọn
function Description({ description }) {
  if (!description)
    return (
      <div className="text-lg leading-8 text-zinc-500 px-[90px]">
        Chưa có mô tả
      </div>
    );
  let array = description.split("\n");
  return (
    <Box sx={{ padding: "30px 0" }}>
      {array.map((text) => {
        return (
          <div className="text-lg leading-8 text-zinc-500 px-[90px]">
            {text}
          </div>
        );
      })}
    </Box>
  );
}

function Rated({ star, item_id }) {
  const averageRating = star;
  const [rates, setRates] = useState([]);
  const limit = 3;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);
  const [starFilter, setStarFilter] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const params = starFilter ? { star: starFilter } : {};
    axios
      .get(
        `rate/?item=${item_id}&limit=${limit}&offset=${(page - 1) * limit}/`,
        { params: params }
      )
      .then((res) => {
        setRates(res.data.results);
        console.log(res.data.count);
        setTotalPage(Math.ceil(res.data.count / limit));
        setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, starFilter]);

  // Hàm xử lý khi người dùng chọn rating từ 1 đến 5 sao
  const handleRatingSelect = (rating) => {
    // Xử lý khi người dùng chọn một rating cụ thể
    let star = rating[0];
    if (rating === "Tất cả") {
      setStarFilter(null);
    } else {
      star = parseInt(star);
      setStarFilter(star);
    }
  };
  return (
    <div className="mt-5 px-[140px] flex justify-between">
      {/* Filter Rating */}
      <div className="flex flex-col gap-5 w-[450px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="text-base text-indigo-800 font-medium tracking-wider">
              {averageRating}
            </div>
            <Rating
              name="read-only"
              value={averageRating}
              precision={0.1}
              readOnly
              size="small"
              sx={{ color: "#3F41A6" }}
            />
          </div>
          <div className="justify-center text-black text-base font-medium tracking-wider">
            {count} Đánh Giá
          </div>
        </div>
        <div className="flex flex-wrap w-full gap-x-10 gap-y-5">
          {["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"].map(
            (rating, i) => (
              <Button
                onClick={() => handleRatingSelect(rating)}
                key={i}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  border: "1px solid #3F41A6",
                  color: "#3F41A6",
                  width: "123px",
                  borderRadius: "4px",
                  "&:hover": {
                    border: "1px solid #3949AB",
                  },
                }}
              >
                {rating}
              </Button>
            )
          )}
        </div>
      </div>
      {/* Cmt */}
      <div className="flex flex-col gap-5 max-w-[600px]">
        {/* Bắt đầu map */}
        {rates.map((rate, i) => {
          return (
            <>
              <RateComponent
                key={i}
                rate={rate}
                open={open}
                setOpen={setOpen}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
              {i !== rates.length - 1 && <Divider sx={{ marginTop: "10px" }} />}
            </>
          );
        })}

        {/* Pagination */}
        {rates.length > 0 && (
          <Pagination
            count={totalPage} // Tổng số trang
            page={page} // Trang hiện tại
            onChange={(event, value) => {
              setPage(value);
            }}
            sx={{
              margin: "0 auto",
              width: "fit-content",
              "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
                {
                  bgcolor: "#E2E5FF",
                },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default RateOfItem;
