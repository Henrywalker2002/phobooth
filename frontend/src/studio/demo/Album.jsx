import {
  Paper,
  Divider,
  Button,
  ImageList,
  ImageListItem,
  Badge,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useRef, useEffect } from "react";
import AddImg from "./AddImg";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function Album({
  imageList,
  setImageList,
  setCurrentDemo,
  narbarType,
  order_id,
  page,
  setPage,
  totalImage,
  setTotalImage,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [openAddImg, setOpenAddImg] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } =
        scrollContainerRef.current;
      const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if (isBottom) {
        console.log("Scrolled to the bottom");
        // Load more images or do something else
        setPage(page + 1);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDeleteImg = (item) => {
    axiosPrivate
      .delete(`/demo/${item.id}/`)
      .then((res) => {
        setImageList(imageList.filter((img) => img.id !== item.id));
      })
      .then((err) => {
        console.log(err);
      });
  };
  return (
    <Paper
      ref={scrollContainerRef}
      sx={{
        width: "fit-content",
        margin: "40px 30px",
        minWidth: "300px",
        height: "700px",
        overflowY: "scroll",
        overflowX: "hidden",
        border: "1px solid #d6d3d1",
      }}
    >
      <div className="flex justify-between items-center px-4 py-2 bg-white rounded-lg leading-[150%]">
        {narbarType === "studio" && (
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddImg(true)}
            sx={{
              textTransform: "none",
              color: "#3F41A6",
              "&:hover": {
                bgcolor: "#E2E5FF",
              },
            }}
          >
            Thêm hình ảnh
          </Button>
        )}
        <div className="flex gap-1 text-base">
          <div className="text-zinc-900">Tổng số :</div>
          <div className="text-stone-500">{totalImage}</div>
        </div>
      </div>
      <Divider />

      <ImageList
        sx={{
          width: "fit-content",
          height: "92%",
          padding: "17px",
          overflowY: "scroll",
          overflowX: "hidden",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        cols={2}
        gap={20}
        rowHeight={120}
      >
        {imageList?.map((item) => (
          <ImageListItem
            key={item.id}
            sx={{
              width: "135px",
              border: "1px solid #E0E0E0",
              borderRadius: "5px",
            }}
          >
            <Badge
              badgeContent={
                <IconButton
                  onClick={() => handleDeleteImg(item)}
                  sx={{
                    display: narbarType === "studio" ? "button" : "none",
                  }}
                >
                  <HighlightOffIcon
                    sx={{
                      color: "#78716C",
                    }}
                  />
                </IconButton>
              }
              sx={{
                bgcolor: "transparent",
                height: "108px",
              }}
            >
              <img
                className="w-full h-[120px] rounded object-cover"
                src={item.image?.thumbnail}
                alt={item.title}
                loading="lazy"
                onClick={() => setCurrentDemo(item)}
              />
            </Badge>
          </ImageListItem>
        ))}
      </ImageList>

      {/* Add Img */}
      <AddImg
        open={openAddImg}
        setOpen={setOpenAddImg}
        imageList={imageList}
        setImageList={setImageList}
        setCurrentDemo={setCurrentDemo}
        order_id={order_id}
        totalImage={totalImage}
        setTotalImage={setTotalImage}
      />
    </Paper>
  );
}

export default Album;
