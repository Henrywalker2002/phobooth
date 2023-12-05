import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { FaArrowDownLong } from "react-icons/fa6";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  // const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const list0 = [1, 2, 3];
  const list1 = [1, 2, 3, 4];
  const list2 = ["Phổ biến", "Đề xuất", "Gần đây"];

  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/item")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />

      {/* content */}
      <div className="bg-violet-50 flex flex-col items-center px-5">
        <div className="w-full max-w-[1320px] mt-10 mb-14">
          <div className="gap-5 flex">
            <div className="flex flex-col items-stretch w-[18%] h-fit">
              <div className="items-start border-2 border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex w-full grow flex-col border-solid">
                <div className="w-full self-stretch flex flex-col items-stretch">
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Gia đình
                  </div>
                  <div className="w-full h-[50px] text-white text-sm leading-5 bg-indigo-800 flex items-center pl-14">
                    Doanh nghiệp
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Đám cưới
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Du lịch
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Công sở
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Ảnh thẻ
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Gia đình
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Doanh nghiệp
                  </div>
                  <div className="w-full h-[50px] text-zinc-900 text-sm leading-5 flex items-center pl-14">
                    Du lịch
                  </div>
                  <div className="w-full h-[60px] border-2 border-x-white border-b-white text-zinc-900 text-sm leading-5 flex items-center justify-center">
                    <div className="flex gap-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Xem tất cả danh mục
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[950px] ml-5">
              <div className="flex flex-col max-md:max-w-full max-md:mt-10">
                <div className="justify-center items-stretch flex w-[107px] max-w-full gap-3 mr-16 rounded-[43px] self-end max-md:mr-2.5">
                  <div className="text-indigo-800 text-base font-medium leading-6">
                    Xem tất cả
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/c435d3c9-4c64-4b5b-9830-80fd0a65940d?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-[1.25] object-contain object-center w-[15px] overflow-hidden self-center shrink-0 max-w-full my-auto"
                  />
                </div>
                <div className="self-center w-[860px] max-w-full mt-1">
                  <div className="flex justify-around">
                    {items.map((item, index) => (
                      <div className="flex flex-col items-stretch" key={index}>
                        <div className="flex-col fill-[linear-gradient(180deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.70)_100%)] backdrop-blur-[2px] overflow-hidden relative flex aspect-[1.1991150442477876] grow items-stretch pl-5 pr-5 py-4 max-md:mt-10 max-md:pr-5">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/21fdbe9b-5cb6-4724-8b6f-a2d6d28a57c9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
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
                                  {item["start"] || 5.0}
                                </div>
                                <img
                                  loading="lazy"
                                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ff626f-53ac-40f9-bd1b-af46fad5efe3?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                                  className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="relative flex gap-5 mt-3">
                            <div className="flex flex-col items-stretch w-fit">
                              <div className="justify-center text-yellow-950 text-lg font-semibold leading-7 tracking-wider">
                                {item?.name || "title"}
                              </div>
                              <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                                Studio:{" "}
                                {item?.studio?.friendly_name || "studio"}
                              </div>
                            </div>
                            <Button
                              variant="contained"
                              onClick={() =>
                                navigate("/item/detail/" + item.id)
                              }
                              sx={{
                                alignSelf: "center",
                                borderRadius: "50%",
                                color: "#F6F5FB",
                                bgcolor: "#3F41A6",
                                width: "30px",
                                height: "30px",
                                minWidth: 0,
                                padding: "0",
                                transform: "rotate(-90deg)",
                                "&:hover": {
                                  bgcolor: "#3F41A6B2",
                                },
                              }}
                            >
                              <FaArrowDownLong />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="justify-between items-stretch self-stretch z-[1] flex gap-5 max-md:max-w-full max-md:flex-wrap">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/6bb5f43e-3309-4ba4-9cbc-6d8cd3a0db62?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-square object-contain object-center w-[45px] overflow-hidden shrink-0 max-w-full"
                  />
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/90ba2137-36d2-4f9e-8f64-68a26a969f61?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-square object-contain object-center w-[45px] overflow-hidden shrink-0 max-w-full"
                  />
                </div>
                <div className="self-center mt-0 w-[860px] max-w-full">
                  <div className="flex justify-around">
                    {list0.map((item, index) => (
                      <div className="flex flex-col items-stretch" key={index}>
                        <div className="flex-col fill-[linear-gradient(180deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.70)_100%)] backdrop-blur-[2px] overflow-hidden relative flex aspect-[1.1991150442477876] grow items-stretch pl-5 pr-5 py-4 max-md:mt-10 max-md:pr-5">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/21fdbe9b-5cb6-4724-8b6f-a2d6d28a57c9?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
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
                            <Button
                              variant="contained"
                              onClick={() => navigate("/item/detail")}
                              sx={{
                                alignSelf: "center",
                                borderRadius: "50%",
                                color: "#F6F5FB",
                                bgcolor: "#3F41A6",
                                width: "30px",
                                height: "30px",
                                minWidth: 0,
                                padding: "0",
                                transform: "rotate(-90deg)",
                                "&:hover": {
                                  bgcolor: "#3F41A6B2",
                                },
                              }}
                            >
                              <FaArrowDownLong />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-7 flex gap-2 justify-center items-stretch">
                  <div className="bg-zinc-500 flex w-2 shrink-0 h-2 flex-col rounded-[50%]" />
                  <div className="bg-indigo-800 flex w-2 shrink-0 h-2 flex-col rounded-[50%]" />
                  <div className="bg-zinc-500 flex w-2 shrink-0 h-2 flex-col rounded-[50%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các danh sách */}
      <div className="my-20 flex flex-col gap-14">
        {list2.map((item, index) => (
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
                        <Button
                          variant="contained"
                          onClick={() => navigate("/item/detail")}
                          sx={{
                            alignSelf: "center",
                            borderRadius: "50%",
                            color: "#F6F5FB",
                            bgcolor: "#3F41A6",
                            width: "30px",
                            height: "30px",
                            minWidth: 0,
                            padding: "0",
                            transform: "rotate(-90deg)",
                            "&:hover": {
                              bgcolor: "#3F41A6B2",
                            },
                          }}
                        >
                          <FaArrowDownLong />
                        </Button>
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

export default Home;
