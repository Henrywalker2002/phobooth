import React from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material";

const Logo = styled(PhotoCameraIcon)(({ theme }) => ({
  width: "40px",
  height: "40px",
  [theme.breakpoints.down("sm")]: {
    width: "35px",
    height: "35px",
  },
}));
function Footer() {
  return (
    <div className=" bg-violet-50 mt-10 flex flex-col px-5 justify-center items-center">
      <div className="flex w-full max-w-[1320px] flex-col items-stretch mt-11 max-md:max-w-full max-md:mt-10">
        <div className="max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[31%] max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col mt-1.5 max-md:mt-10">
                <div className="logo flex items-center w-[180px] cursor-pointer max-sm:w-fit">
                  <Logo
                    sx={{
                      color: "rgba(0, 0, 0, 0.87)",
                    }}
                  />
                  <div className="text-indigo-800 text-3xl leading-[54px] tracking-tighter self-center grow whitespace-nowrap my-auto max-sm:text-2xl max-sm:w-[100px]">
                    PhoBooth
                  </div>
                </div>
                <div className="text-zinc-500 text-sm leading-5 mt-4">
                  Một nền tảng kết nối khách hàng và các Studio cung cấp các
                  dịch vụ ảnh. Hãy khám phá và kết nối với cộng đồng của chúng
                  tôi ngay hôm nay!
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[69%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow items-start justify-between gap-5 pr-1.5 max-sm:p-0 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:mt-10">
                <div className="items-stretch self-stretch flex grow basis-[0%] flex-col flex-wrap">
                  <div className="text-indigo-950 text-base font-medium leading-6 whitespace-nowrap">
                    Chăm sóc khách hàng
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-5">
                    Trung tâm trợ giúp
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Hướng dẫn đặt dịch vụ
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Hướng dẫn mở dịch vụ
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Liên hệ hỗ trợ
                  </div>
                </div>
                <div className="items-stretch flex grow basis-[0%] flex-col self-start">
                  <div className="text-indigo-950 text-base font-medium leading-6 whitespace-nowrap">
                    Về chúng tôi
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-5">
                    Giới thiệu về PhoBooth
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Điều khoản
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Chính sách bảo mật
                  </div>
                </div>
                <div className="items-stretch flex grow basis-[0%] flex-col self-start">
                  <div className="text-indigo-950 text-base font-medium leading-6 whitespace-nowrap">
                    Thanh toán
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-5">
                    VN Pay
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Momo
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Visa
                  </div>
                </div>
                <div className="items-stretch flex grow basis-[0%] flex-col self-start">
                  <div className="text-indigo-950 text-base font-medium leading-6 whitespace-nowrap">
                    Vận chuyển
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-5">
                    J&T Express
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    VN Post
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Ahamove
                  </div>
                </div>
                <div className="items-stretch flex basis-[0%] flex-col self-start">
                  <div className="text-indigo-950 text-base font-medium leading-6 whitespace-nowrap">
                    Liên kết
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-5">
                    Facebook
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Instagram
                  </div>
                  <div className="text-neutral-400 text-sm leading-5 whitespace-nowrap mt-3">
                    Linkedin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-zinc-500 text-sm leading-5 whitespace-nowrap text-center border border-t-neutral-400 bg-violet-50 mt-16 pt-6 pb-2.5 px-5 max-md:max-w-full max-md:mt-10">
          PhoBooth eCommerce © 2023. All Rights Reserved
        </div>
      </div>
    </div>
  );
}

export default Footer;
