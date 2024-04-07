import {
  Paper,
  Divider,
  Button,
  ImageList,
  ImageListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import AddImg from "./AddImg";

function Album() {
  const [openAddImg, setOpenAddImg] = useState(false);
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];
  return (
    <Paper
      sx={{
        width: "fit-content",
        margin: "40px 30px",
        minWidth: "300px",
        border: "1px solid #d6d3d1",
      }}
    >
      <div className="flex justify-between items-center px-4 py-2 bg-white rounded-lg leading-[150%]">
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
        <div className="flex gap-1 text-base">
          <div className="text-zinc-900">Tổng số :</div>
          <div className="text-stone-500">10</div>
        </div>
      </div>
      <Divider />

      <ImageList
        sx={{ width: "fit-content", height: "fit-content", padding: "17px" }}
        cols={2}
        gap={12}
      >
        {itemData.map((item) => (
          <ImageListItem
            key={item.img}
            sx={{
              width: "138px",
              height: "105px",
              border: "1px solid #E0E0E0",
              borderRadius: "5px",
              "& .MuiImageListItem-img": {
                height: "119px",
              },
            }}
          >
            <img
              width="108"
              height="89"
              className="rounded-[5px]"
              src={`${item.img}`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Add Img */}
      <AddImg open={openAddImg} setOpen={setOpenAddImg} />
    </Paper>
  );
}

export default Album;
