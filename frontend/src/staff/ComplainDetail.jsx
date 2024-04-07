import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IoIosSend } from "react-icons/io";

function ComplainDetail() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />

      {/* Breadcumbs */}
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
        }
        aria-label="breadcrumb"
        sx={{
          marginTop: "20px",
          paddingLeft: "120px",
        }}
      >
        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/", { replace: true })}
        >
          <HomeOutlinedIcon />
        </Link>

        <Link
          component="button"
          underline="none"
          key="2"
          color="inherit"
          // href="/orders"
          onClick={() => navigate("/orders", { replace: true })}
        >
          Quản lý đơn hàng
        </Link>

        <Link
          component="button"
          underline="none"
          key="3"
          color="inherit"

          //   onClick={() => navigate("/orders", { replace: true })}
        >
          Đơn hàng #6356
        </Link>

        <Typography
          key="4"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Khiếu nại #8437
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-5">
        Chất lượng ảnh kém
      </div>

      <Paper
        sx={{
          width: "800px",
          margin: "20px auto",
          border: "1px solid #d6d3d1",
          paddingBottom: "20px",
        }}
      >
        <div className="flex flex-col px-10 py-5 bg-white rounded-md">
          <div className="flex justify-between w-full ">
            <div className="flex gap-4">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                className="w-11 h-11 rounded-full "
              />
              <div className="flex flex-col justify-around">
                <div className="text-base tracking-wider text-black">
                  @Golanginya
                </div>
                <div className="text-sm font-medium tracking-wide text-indigo-800">
                  Khách hàng
                </div>
              </div>
            </div>
            <div className=" my-auto text-xs font-semibold tracking-wide text-indigo-800">
              19:35, 20 Tháng 11 2023
            </div>
          </div>
          <Divider sx={{ marginY: "20px" }} />

          <div className="flex flex-col gap-5">
            <div className="text-lg font-semibold text-gray-700">
              Chất lượng ảnh kém
            </div>
            <div className="flex gap-3.5 self-start text-sm leading-5">
              <div className="grow my-auto text-zinc-900">Phân loại :</div>
              <div className="justify-center px-2 py-1 text-indigo-800 bg-violet-50 rounded">
                Chất lượng
              </div>
            </div>
            <div className="text-sm leading-6 text-black">
              Posuere arcu arcu consectetur turpis rhoncus tellus. Massa,
              consectetur massa sit fames nulla eu vehicula ullamcorper. Ante
              sit mauris elementum sollicitudin arcu sit suspendisse pretium.
              Nisl egestas fringilla justo bibendum.
            </div>
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a602748760702052c0ab92b911ec6447b484204fcc93a99289e2151cb6c513c1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
              className="max-w-full aspect-[1.92] w-[645px]"
            />
          </div>
        </div>
      </Paper>

      <div className="text-indigo-800 text-xl font-semibold flex justify-center whitespace-nowrap mt-10">
        Phản hồi khiếu nại
      </div>
      <div className="flex flex-col gap-5 my-5">
        <Paper
          sx={{
            width: "800px",
            marginX: "auto",
            border: "1px solid #d6d3d1",
          }}
        >
          <div className="flex flex-col px-10 py-5 bg-white rounded ">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-4">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="w-11 h-11 rounded-full "
                />
                <div className="flex flex-col justify-around">
                  <div className="text-base tracking-wider text-black">
                    @morgenshtern
                  </div>
                  <div className="text-sm font-medium tracking-wide text-indigo-800">
                    Nhân viên
                  </div>
                </div>
              </div>
              <div className=" text-xs font-semibold tracking-wide text-indigo-800">
                19:35, 20 Tháng 11 2023
              </div>
            </div>
            <Divider sx={{ marginY: "10px" }} />

            <div className="text-sm leading-6 text-black">
              Posuere arcu arcu consectetur turpis rhoncus tellus. Massa,
              consectetur massa sit fames nulla eu vehicula ullamcorper.
            </div>
          </div>
        </Paper>

        <Paper
          sx={{
            width: "800px",
            marginX: "auto",
            border: "1px solid #d6d3d1",
          }}
        >
          <div className="flex flex-col px-10 py-5 bg-white rounded border-l-4 border-indigo-800">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-4">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/dbf522b5c190249e2ae2bd9014be604a5527c5b765e5c0c32a5010ae4552e449?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="w-11 h-11 rounded-full "
                />
                <div className="flex flex-col justify-around">
                  <div className="text-base tracking-wider text-black">
                    @Golanginya
                  </div>
                  <div className="text-sm font-medium tracking-wide text-indigo-800">
                    Khách hàng
                  </div>
                </div>
              </div>
              <div className=" text-xs font-semibold tracking-wide text-indigo-800">
                19:35, 20 Tháng 11 2023
              </div>
            </div>
            <Divider sx={{ marginY: "10px" }} />

            <div className="text-sm leading-6 text-black">
              Antesit mauris elementum sollicitudin arcu sit suspendisse
              pretium. Nisl egestas fringilla justo bibendum.
            </div>
          </div>
        </Paper>

        <Paper
          sx={{
            width: "800px",
            marginX: "auto",
            border: "1px solid #d6d3d1",
          }}
        >
          <div className="flex flex-col px-10 py-5 bg-white rounded">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-4">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/c83a3707116b59c9f60efcf253a3c62595477ee02261c48cd179c192ca177996?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="w-11 h-11 rounded-full "
                />
                <div className="flex flex-col justify-around">
                  <div className="text-base tracking-wider text-black">
                    @morgenshtern
                  </div>
                  <div className="text-sm font-medium tracking-wide text-indigo-800">
                    Nhân viên
                  </div>
                </div>
              </div>
              <div className=" text-xs font-semibold tracking-wide text-indigo-800">
                19:35, 20 Tháng 11 2023
              </div>
            </div>
            <Divider sx={{ marginY: "10px" }} />

            <TextField
              name="reply"
              multiline
              rows={2}
              placeholder="Để lại phản hồi của bạn..."
              sx={{
                width: "100%",
              }}
            />

            <div className="flex gap-5 justify-end my-3">
              {/* <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "fit-content",
              padding: "3px 10px",

              borderRadius: "4px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy
          </Button> */}

              <Button
                variant="contained"
                startIcon={<IoIosSend style={{ fontSize: "18px" }} />}
                sx={{
                  textTransform: "none",
                  bgcolor: "#3F41A6",
                  width: "fit-content",
                  padding: "3px 15px",
                  borderRadius: "4px",
                  "&:hover": {
                    bgcolor: "#3949AB",
                  },
                }}
              >
                Gửi
              </Button>
            </div>
          </div>
        </Paper>
      </div>

      <div className="flex justify-center my-5 gap-5">
        <Button
          variant="outlined"
          sx={{
            marginRight: "20px",
            borderRadius: "43px",
            borderColor: "#3F41A6",
            color: "#3F41A6",
            padding: "5px 20px",
            textTransform: "none",
            width: "fit-content",

            "&:hover": {
              bgcolor: "#F6F5FB",
              borderColor: "#3F41A6",
            },
          }}
        >
          Hoàn tiền
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 20px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Hoàn tất khiếu nại
        </Button>
      </div>
    </div>
  );
}

export default ComplainDetail;
