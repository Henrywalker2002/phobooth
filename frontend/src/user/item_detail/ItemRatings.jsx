import React from "react";
import { Rating, Button, Divider, Pagination } from "@mui/material";

function ItemRatings() {
  return (
    <div className="mt-5 px-[140px] flex justify-between">
      {/* Filter Rating */}
      <div className="flex flex-col gap-5 w-[450px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="text-base text-indigo-800 font-medium tracking-wider">
              4.9
            </div>
            <Rating
              name="read-only"
              value={5}
              readOnly
              size="small"
              sx={{ color: "#3F41A6" }}
            />
          </div>
          <div className="justify-center text-black text-base font-medium tracking-wider">
            100 Đánh Giá
          </div>
        </div>
        <div className="flex flex-wrap w-full gap-x-10 gap-y-5">
          <Button
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
            Tất cả
          </Button>
          <Button
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
            5 sao (18)
          </Button>
          <Button
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
            4 sao (18)
          </Button>
          <Button
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
            3 sao (18)
          </Button>
          <Button
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
            2 sao (18)
          </Button>
          <Button
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
            1 sao (18)
          </Button>
        </div>
      </div>
      {/* Cmt */}
      <div className="flex flex-col gap-5 max-w-[600px]">
        <div className="flex flex-col gap-2 ">
          <div className="flex items-center justify-between w-full ">
            <div className="flex gap-2">
              <img
                loading="lazy"
                srcSet="data:image/jpeg;base64,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"
                className="w-11 h-11 rounded-full "
              />
              <div className="flex flex-col justify-around">
                <div className="text-base tracking-wider text-black">
                  Scarlet withch
                </div>
                <div className="text-xs font-normal leading-5 text-neutral-500">
                  19:35, 6 Tháng 5 2023
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-base text-indigo-800 font-medium tracking-wider">
                4.9
              </div>
              <Rating
                name="read-only"
                value={5}
                readOnly
                size="small"
                sx={{ color: "#3F41A6" }}
              />
            </div>
          </div>
          <div className="w-full text-sm leading-5 text-zinc-500">
            Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet at
            posuere ac, viverra at mauris. Maecenas tincidunt ligula a sem
            vestibulum pharetra. Maecenas auctor tortor lacus, nec laoreet nisi
            porttitor vel.{" "}
          </div>
          <Divider sx={{ marginTop: "10px" }} />
        </div>

        <div className="flex flex-col gap-2 ">
          <div className="flex items-center justify-between w-full ">
            <div className="flex gap-2">
              <img
                loading="lazy"
                srcSet="data:image/jpeg;base64,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"
                className="w-11 h-11 rounded-full "
              />
              <div className="flex flex-col justify-around">
                <div className="text-base tracking-wider text-black">
                  Scarlet withch
                </div>
                <div className="text-xs font-normal leading-5 text-neutral-500">
                  19:35, 6 Tháng 5 2023
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-base text-indigo-800 font-medium tracking-wider">
                4.9
              </div>
              <Rating
                name="read-only"
                value={5}
                readOnly
                size="small"
                sx={{ color: "#3F41A6" }}
              />
            </div>
          </div>
          <div className="w-full text-sm leading-5 text-zinc-500">
            Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet at
            posuere ac, viverra at mauris. Maecenas tincidunt ligula a sem
            vestibulum pharetra. Maecenas auctor tortor lacus, nec laoreet nisi
            porttitor vel.{" "}
          </div>
          {/* <Divider sx={{ marginTop: "10px" }} /> */}
        </div>

        {/* Pagination */}
        <Pagination
          count={3}
          //   onChange={getOrdersForPage}
          // page={defaultPage}
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
    </div>
  );
}

export default ItemRatings;
