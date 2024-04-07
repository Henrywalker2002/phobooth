import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RiImageAddFill } from "react-icons/ri";

export default function VerifyUploadImage(props) {
  const { image, setImage } = props;

  const handleUpdateImage = (e) => {
    if (e.target.files.length > 0) {
      setImage({
        avt_preview: URL.createObjectURL(e.target.files[0]),
        avt_file: e.target.files[0],
      });
    }
  };

  return (
    <div>
      <Button
        component="label"
        variant="outlined"
        sx={{
          textTransform: "none",
          border: "1px solid #E0E0E0",
          color: "#3F41A6",
          width: "350px",
          height: "200px",
          marginTop: "10px",
          borderRadius: "5px",
          paddingX: "10px",
          "&:hover": {
            border: "2px solid #3949AB",
          },
        }}
      >
        {image && image.avt_preview ? (
          <div style={{ border: "1px solid #E0E0E0", borderRadius: "5px"}}>
            <img
              src={image.avt_preview}
              style={{ minWidth: "350px", minHeight: "200px" }}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <RiImageAddFill className="w-11 h-11" />
              <div className="text-[10px] mt-1">
                Hình ảnh chụp trực diện và rõ thông tin
              </div>
            </div>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpdateImage}
          style={{
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: 1,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            left: 0,
            whiteSpace: "nowrap",
            width: 1,
          }}
        />
      </Button>
    </div>
  );
}
