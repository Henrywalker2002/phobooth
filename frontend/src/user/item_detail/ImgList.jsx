import React, { useState } from "react";
import { IconButton, ImageListItemBar, ImageListItem } from "@mui/material";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

function ImgList({ pictures, click }) {
  const [startIndex, setStartIndex] = useState(0);

  // Hàm xử lý khi click vào nút "Xem thêm"
  const handleClickNext = () => {
    setStartIndex(startIndex + 1);
  };

  // Số lượng hình ảnh cần hiển thị
  const numImagesToShow = 3;

  return (
    <div className="relative" style={{width:"420px"}}>
      {/* Hiển thị danh sách hình ảnh */}
      <div className="flex justify-between">
        <div className="flex-grow flex-shrink-0 w-[120px] h-[120px]">
          <img
            className="w-full h-full rounded-[5px]"
            src={pictures[startIndex]?.picture}
            loading="lazy"
            alt={`Image ${startIndex}`}
          />
        </div>
        <div className="flex-grow flex-shrink-0 w-[120px] h-[120px]">
          <img
            className="w-full h-full rounded-[5px]"
            src={pictures[startIndex + 1]?.picture}
            loading="lazy"
            alt={`Image ${startIndex + 1}`}
          />
        </div>
        <div className="flex-grow flex-shrink-0 w-[120px] h-[120px]">
          <ImageListItem style={{width: "135px", height: "120px"}} key={1}>
            <img
              className="w-full h-full rounded-[5px]"
              src={pictures[startIndex + 2]?.picture}
              loading="lazy"
              alt={`Image ${startIndex + 2}`}
            />
              <ImageListItemBar
              // title={item.title}
              // subtitle={item.author}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about `}
                  
                >
                  <FaRegArrowAltCircleRight onClick={click}/>
                </IconButton>
              }
            />

          </ImageListItem>
          
        </div>
      </div>
    </div>
  );
}

export default ImgList;
