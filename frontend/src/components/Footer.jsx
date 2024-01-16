import React from "react";

function Footer() {
  return (
    <div className=" bg-violet-50 mt-10 flex flex-col px-5 justify-center items-center">
      <div className="flex w-full max-w-[1320px] flex-col items-stretch mt-11 max-md:max-w-full max-md:mt-10">
        <div className="max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[31%] max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col mt-1.5 max-md:mt-10">
                <div className="flex items-stretch justify-between gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-11 h-11"
                  >
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path
                      fillRule="evenodd"
                      d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-indigo-800 text-3xl leading-[54px] tracking-tighter self-center grow whitespace-nowrap my-auto">
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
              <div className="flex grow items-start justify-between gap-5 pr-1.5 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:mt-10">
                <div className="items-stretch self-stretch flex grow basis-[0%] flex-col">
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
