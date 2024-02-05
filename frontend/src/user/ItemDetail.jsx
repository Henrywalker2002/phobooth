import { React, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { GoHome } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

function ItemDetail(props) {
  const { auth, setAuth } = useAuth();
  let { id } = useParams(props, "id");
  const [item, setItem] = useState({});
  useEffect(() => {
    axios
      .get("/item/" + id + "/")
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const list0 = ["Hàng hóa khác của Studio", "Tương tự"];
  const list1 = [1, 2, 3, 4];
  return (
    <div>
      <Navbar />
      <div className="introItem">
        {/* Link */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "130px" }}>
          <Link underline="hover" color="inherit" href="/">
            <GoHome
              style={{ color: "#808080", width: "24px", height: "24px" }}
            />
          </Link>
          <Link
            underline="hover"
            color="#999999"
            href="/material-ui/getting-started/installation/"
          >
            Dịch vụ
          </Link>
          <Typography color="#3F41A6">{item?.category?.title}</Typography>
        </Breadcrumbs>

        {/* Content */}
        <div className="gap-5 flex mt-5">
          <div className="flex flex-col items-start w-[39%] ml-[200px]">
            <div className="flex grow flex-col items-stretch mt-1.5 w-[420px]">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/8f18e8b0708ad8b1a12f919deb0d5d5786fdbbea68ff0383aedde733a4549b98?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                className="aspect-[1.14] object-contain object-center w-full overflow-hidden"
              />
              <div className="mt-3">
                <div className="flex items-stretch justify-between">
                  <div className="flex flex-col w-[120px] ">
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                      className="aspect-[1.09] object-contain object-center w-full overflow-hidden shrink-0 max-w-full grow"
                    />
                  </div>
                  <div className="flex flex-col w-[120px] ">
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                      className="aspect-[1.09] object-contain object-center w-full overflow-hidden shrink-0 max-w-full grow"
                    />
                  </div>
                  <div className="flex flex-col w-[120px] ">
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2d94aab145f799f917484d2293e851d4bf661a95047e66d2f6132ee8dd894056?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                      className="aspect-[1.09] object-contain object-center w-full overflow-hidden shrink-0 max-w-full grow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end mt-1 w-[61%] mr-[180px]">
            <div className="flex grow flex-col w-[620px]">
              <div className="text-zinc-900 text-4xl font-semibold leading-10 whitespace-nowrap self-start">
                {item?.name}
              </div>
              <div className="flex gap-1.5 mt-2.5 self-start items-center">
                <div className="justify-center text-indigo-800 text-base font-medium tracking-wider self-center my-auto">
                  {item.star}
                </div>
                <FaStar style={{ color: "#3F41A6", width: "17px" }} />
                <div className="text-zinc-400 text-xl font-medium leading-8 self-stretch">
                  •
                </div>
                <div className="justify-center text-black text-base font-medium tracking-wider">
                  100 Đánh Giá
                </div>
              </div>
              <div className="text-indigo-800 text-2xl font-medium leading-9 self-stretch whitespace-nowrap mt-2.5 max-md:max-w-full">
                {item?.min_price || "1.000.000"}Đ -{" "}
                {item?.max_price || "2.000.000"}Đ
              </div>
              <div className="flex items-center justify-between gap-3.5 mt-3.5 px-px self-start max-md:justify-center">
                <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap my-auto">
                  Phân loại :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                  Dịch vụ
                </div>
                <div className="text-zinc-900 text-sm leading-5 my-auto">
                  Lĩnh vực :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch grow px-2 py-1">
                  {item?.category?.title}
                </div>
              </div>
              <div className="bg-neutral-200 self-stretch shrink-0 h-px mt-5" />
              <div className="text-zinc-500 text-sm leading-5 self-stretch mt-3">
                {item?.description + " "}
              </div>
              <div className="items-stretch self-stretch flex justify-between gap-2 mt-2">
                <FaCircleCheck className="text-indigo-800 w-5" />
                <div className="text-zinc-500 text-sm leading-5 grow shrink basis-auto max-md:max-w-full">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              </div>
              <div className="items-stretch self-stretch flex justify-between gap-2 mt-2">
                <FaCircleCheck className="text-indigo-800 w-5" />
                <div className="text-zinc-500 text-sm leading-5 grow shrink basis-auto max-md:max-w-full">
                  Pellentesque diam volutpat commodo sed egestas egestas
                  fringilla phasellus.
                </div>
              </div>
              <div className="items-stretch self-stretch flex justify-between gap-2 mt-2">
                <FaCircleCheck className="text-indigo-800 w-5" />
                <div className="text-zinc-500 text-sm leading-5 grow shrink basis-auto max-md:max-w-full">
                  Dolor sit amet consectetur adipiscing elit. Est ullamcorper
                  eget nulla facilisi etiam dignissim diam.
                </div>
              </div>
              <div className="items-stretch self-stretch flex justify-between gap-2 mt-2">
                <FaCircleCheck className="text-indigo-800 w-5" />
                <div className="text-zinc-500 text-sm leading-5 grow shrink basis-auto max-md:max-w-full">
                  Diam quam nulla porttitor massa id.
                </div>
              </div>
              <div className="text-indigo-800 text-base font-bold self-stretch whitespace-nowrap mt-3">
                Xem thêm
              </div>
              <div className="justify-start items-stretch self-stretch flex gap-5 mt-5 px-px py-5 ">
                <div className="justify-center items-center border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex gap-0 p-2 rounded-[170px] border-solid self-start">
                  <div className="bg-zinc-100 self-stretch flex w-[34px] shrink-0 h-[34px] flex-col rounded-[170px] items-center justify-center">
                    <IconButton color="primary">
                      <RiSubtractFill style={{ color: "#666666" }} />
                    </IconButton>
                  </div>
                  <div className="text-zinc-900 text-center text-base leading-6 my-auto mx-2">
                    5
                  </div>
                  <div className="bg-zinc-100 self-stretch flex w-[34px] shrink-0 h-[34px] flex-col rounded-[170px] items-center justify-center">
                    <IconButton color="primary">
                      <IoIosAdd style={{ color: "#666666" }} />
                    </IconButton>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  startIcon={
                    <MdOutlineAddShoppingCart style={{ color: "#3F41A6" }} />
                  }
                  sx={{
                    borderRadius: "43px",
                    borderColor: "#3F41A6",
                    color: "#3F41A6",
                    padding: "0 30px",
                    textTransform: "none",
                    width: "230px",
                    "&:hover": {
                      bgcolor: "#F6F5FB",
                      borderColor: "#3F41A6",
                    },
                  }}
                  onClick={() => {
                    axios
                      .post(
                        "/cart/",
                        { item: id, number: 1 },
                        {
                          headers: {
                            Authorization: `Bearer ${auth.access}`,
                            "Content-Type": "application/json",
                          },
                        }
                      )
                      .then((res) => {
                        console.log(res); // TODO: show success message
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "43px",
                    color: "#F6F5FB",
                    bgcolor: "#3F41A6",
                    padding: "0 30px",
                    textTransform: "none",
                    width: "230px",
                    "&:hover": {
                      bgcolor: "#3F41A6B2",
                    },
                  }}
                >
                  Đặt dịch vụ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Info */}
      <div className="justify-center items-stretch bg-violet-50 bg-opacity-50 flex flex-col px-[100px] py-11 mt-[120px]">
        <div className="border bg-white mx-6 px-9 py-10 border-solid border-neutral-200 rounded-md">
          <div className="gap-5 flex">
            <div className="flex flex-col items-start justify-center w-[43%] ml-5">
              <div className="gap-5 flex ml-8">
                <div className="flex flex-col items-center w-3/12">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a03459bc5fde60d2f75cb8b03f2ccbad49b23f0228eae68d9dde7986fe045e7d?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-[0.94] object-contain object-center w-[70px] overflow-hidden shrink-0 max-w-full grow max-md:mt-7"
                  />
                </div>
                <div className="flex flex-col items-stretch w-9/12">
                  <div className="flex flex-col items-stretch gap-2 justify-center">
                    <div className="justify-center text-indigo-800 text-2xl font-semibold tracking-wider">
                      Studio Demo
                    </div>
                    <div className="flex items-stretch justify-start gap-2">
                      <Button
                        variant="outlined"
                        startIcon={<IoChatboxEllipses />}
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#3F41A6",
                          color: "#3F41A6",
                          padding: "5px 10px",
                          textTransform: "none",
                          width: "130px",
                          "&:hover": {
                            bgcolor: "#F6F5FB",
                            borderColor: "#3F41A6",
                          },
                        }}
                      >
                        Chat ngay
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<MdStorefront />}
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#1A093E",
                          color: "#1A093E",
                          padding: "5px 10px",
                          textTransform: "none",
                          width: "130px",
                          "&:hover": {
                            bgcolor: "#F2F2F2",
                            borderColor: "#1A093E",
                          },
                        }}
                      >
                        Xem Studio
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center w-[57%] mr-5">
              <div className="flex justify-start gap-5 my-auto">
                <div className="flex grow basis-[0%] flex-col justify-center gap-3">
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider">
                      Đánh giá
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                      4.9
                    </div>
                  </div>
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider whitespace-nowrap">
                      Đơn thành công
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                      100
                    </div>
                  </div>
                </div>
                <div className="flex grow basis-[0%] flex-col justify-center gap-3">
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider">
                      Người theo dõi
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                      4.9k
                    </div>
                  </div>
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider whitespace-nowrap">
                      Tham gia
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                      6 năm trước
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các danh sách */}
      <div className="my-20 flex flex-col gap-14">
        {list0.map((item, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div className="justify-between items-stretch flex w-[90%] gap-5 px-5">
              <div className="text-zinc-900 text-2xl font-semibold leading-10">
                {item}
              </div>
              <div className="justify-center items-stretch flex gap-3 rounded-[43px] self-start">
                <div className="text-indigo-800 text-base font-medium leading-6">
                  Xem tất cả
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/380e1367-dcf6-4446-9a58-cf7dcfd60245?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                  className="aspect-[1.25] object-contain object-center w-[15px] overflow-hidden shrink-0 max-w-full self-start"
                />
              </div>
            </div>
            <div className="w-[90%] mt-2 px-5">
              <div className="flex justify-between">
                {list1.map((item, index) => (
                  <div className="flex flex-col items-stretch" key={index}>
                    <div className="flex-col shadow duration-150 rounded-xl fill-[linear-gradient(180deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.70)_100%)] backdrop-blur-[2px] overflow-hidden relative flex aspect-[1.1991150442477876] grow items-stretch pl-5 pr-5 py-4">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/48957126-3c09-4848-810e-309e6cd0dd36?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                        className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
                      />
                      <div className="flex-col relative overflow-hidden flex aspect-[1.673913043478261] pt-2.5 pb-12 px-3 rounded-xl">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                          className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
                        />
                        <div className="relative w-[50px] h-[35px] backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
                          <div className="items-stretch bg-white flex gap-1 pl-1 pr-1 py-1 rounded-3xl">
                            <div className="justify-center text-yellow-950 text-center text-xs font-bold leading-5 tracking-wide">
                              4.8
                            </div>
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ff626f-53ac-40f9-bd1b-af46fad5efe3?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                              className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="relative flex items-stretch gap-5 mt-3">
                        <div className="flex flex-col items-stretch w-fit">
                          <div className="justify-center text-yellow-950 text-lg font-semibold leading-7 tracking-wider">
                            Chụp ảnh gia đình
                          </div>
                          <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                            Studio: PhotoHN
                          </div>
                        </div>
                        <div className="justify-center items-center bg-indigo-800 self-center flex aspect-square flex-col my-auto p-2 rounded-[64px]">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/450e45db-6664-465a-bd91-2ed5c035a952?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="aspect-square object-contain object-center w-[15px] overflow-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default ItemDetail;
