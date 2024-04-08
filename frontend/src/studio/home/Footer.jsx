import React from "react";

function Footer({ address, phone, email }) {
  return (
    <div className="w-full flex justify-around items-center px-10 py-12 bg-indigo-100 mt-10">
      <div className="flex flex-col w-[30%] min-h-[180px]">
        <div className="flex flex-col items-center grow p-5 w-full text-sm bg-white rounded-lg border-2 border-solid border-indigo-800 border-opacity-20">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ca91e18a09d2e362c9d0f18008af7d08e0b3aad163b855299f0dd8913b6f439?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
            className="w-14 aspect-[0.9]"
          />
          <div className="mt-4 text-sm font-medium tracking-wide uppercase leading-[100%] text-zinc-900">
            vị trí của chúng tôi
          </div>
          <div className="mt-2.5 text-center text-wrap text-sm leading-5 text-stone-500">
            {/* 1901 Thornridge Cir. Shiloh, Washington DC 20020, United States */}
            {address ? address : "Chưa cập nhật"}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[30%] min-h-[180px]">
        <div className="flex flex-col items-center grow p-5 w-full bg-white rounded-lg border border-solid border-indigo-800 border-opacity-20 max-md:mt-10">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/14928cffbe0021c01139c7f588d18ec6decfd87d68b31e9769e9c596b9f986a6?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
            className="w-14 aspect-[0.9]"
          />
          <div className="mt-4 text-sm font-medium tracking-wide leading-4 uppercase text-zinc-900">
            Hãy gọi cho chúng tôi
          </div>
          <div className="mt-2.5 text-xl leading-6 text-indigo-800">
            {phone ? phone : "Chưa cập nhật"}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[30%] min-h-[180px]">
        <div className="flex flex-col items-center grow p-5 w-full bg-white rounded-lg border border-solid border-indigo-800 border-opacity-20 max-md:mt-10">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a0f09ad1ca62608d5668a9e57030f1c697ebeb2c3ac5b9bf3cc5d4974a7b8552?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
            className="w-14 aspect-[0.9]"
          />
          <div className="mt-3.5 text-sm font-medium tracking-wide leading-4 uppercase text-zinc-900">
            liên lạc thông qua email
          </div>
          <div className="mt-2.5 text-xl leading-6 text-indigo-800">
            {email ? email : "Chưa cập nhật"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
