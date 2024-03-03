import React, { useEffect, useState } from "react";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { IconButton, Button, TextField, Dialog } from "@mui/material";
import { validFixedPrice } from "../../util/Validation";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function EditOrderItem({ open, setOpen, orderItem, setOrder }) {
  const axiosPrivate = useAxiosPrivate();
  const [price, setPrice] = useState(orderItem.price);
  const [quantity, setQuantity] = useState(orderItem.quantity);
  const [errMsg, setErrMsg] = useState({});
  // console.log(price, quantity);

  useEffect(() => {
    setPrice(orderItem.price);
    setQuantity(orderItem.quantity);
  }, [orderItem]);

  const updateOrderItem = () => {
    let updateData = {
      price: Number(price === null ? orderItem.price : price),
      quantity: quantity === null ? orderItem.quantity : quantity,
    };
    // console.log(updateData);
    if (quantity > 0 && validFixedPrice(price)) {
      axiosPrivate
        .patch(`/order-item/${orderItem.id}/`, updateData)
        .then((res) => {
          setOrder(res.data);
          setOpen(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 400) {
            setErrMsg(err.response.data);
          }
        });
    }
    if (!validFixedPrice(price)) {
      setErrMsg({ ...errMsg, price: ["Nhập đúng định dạng"] });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="min-w-[350px] border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex flex-col items-stretch pb-10 rounded-lg border-solid">
        <div className="shadow-sm bg-white flex items-center justify-end w-full gap-16 pl-20 pr-2 py-4 rounded-lg ">
          <div className="text-indigo-800 text-2xl font-semibold leading-9 whitespace-nowrap">
            Tùy chỉnh
          </div>
          <IconButton onClick={() => setOpen(false)}>
            <FaXmark />
          </IconButton>
        </div>
        <div className="flex w-full justify-start gap-4 mt-3 pl-5 items-center">
          <img
            loading="lazy"
            src={
              orderItem.item?.picture
                ? orderItem.item?.picture
                : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
            }
            className="aspect-square object-contain object-center w-[60px] h-[60px] rounded-lg overflow-hidden shrink-0 max-w-full"
          />
          <div className=" flex grow basis-[0%] flex-col py-1">
            <div className="justify-center text-yellow-950 text-lg font-semibold">
              {orderItem?.item?.name}
            </div>
            <div className="min-w-fit z-[1] flex justify-start gap-3 mt-2.5 items-start">
              <div className="min-w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch  px-2 py-1">
                {orderItem?.item?.type}
              </div>
              <div className="min-w-fit h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch  px-2 py-1">
                {orderItem?.item?.category?.title}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full flex-col mt-5 pl-5">
          <div className="flex items-start gap-8">
            <div className="justify-center flex flex-col">
              <div className="text-zinc-900 text-sm leading-5">Giá đơn vị</div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                sx={{
                  marginTop: "5px",
                  width: "100px",
                  boxSizing: "border-box",
                }}
                value={price === null ? orderItem.price : price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                error={errMsg.price ? true : false}
                helperText={errMsg.price ? errMsg.price[0] : ""}
              />
            </div>
            <div className="flex flex-col gap-1 items-start pt-8">
              <div className="justify-center items-center border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex gap-0 p-2 rounded-[170px] border-solid">
                <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                  <IconButton
                    color="primary"
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    <RiSubtractFill
                      style={{
                        color: "#666666",
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </IconButton>
                </div>
                <div className="text-zinc-900 text-center text-sm leading-6 mx-2">
                  {quantity === null ? orderItem.quantity : quantity}
                </div>
                <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                  <IconButton
                    color="primary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <IoIosAdd
                      style={{
                        color: "#666666",
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </IconButton>
                </div>
              </div>
              {quantity <= 0 ? (
                <div className="text-xs text-red-600">
                  Số lượng phải lớn hơn 0
                </div>
              ) : (
                <div className="text-xs text-red-600"></div>
              )}
            </div>
          </div>
          <Button
            variant="contained"
            sx={{
              marginTop: "50px",
              marginX: "auto",
              textTransform: "none",
              borderRadius: "43px",
              color: "#F6F5FB",
              bgcolor: "#3F41A6",
              width: "130px",
              "&:hover": {
                bgcolor: "#3F41A6B2",
              },
            }}
            onClick={updateOrderItem}
          >
            Lưu thay đổi
          </Button>
        </div> */}
        <div className="flex gap-5 justify-between mt-2.5 text-base leading-6 text-zinc-900 px-6">
          <div className="flex-auto my-auto">Giá đơn vị :</div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": {
                height: "43px",
                boxSizing: "border-box",
              },
              marginTop: "5px",
              width: "100px",
              boxSizing: "border-box",
            }}
            value={price === null ? orderItem.price : price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            error={errMsg.price ? true : false}
            helperText={errMsg.price ? errMsg.price[0] : ""}
          />
        </div>
        <div className="flex gap-5 justify-between px-6 mt-2 w-full">
          <div className="flex-auto self-start mt-2 text-base leading-6 text-zinc-900">
            Số lượng :
          </div>
          <div className="w-[100px] flex justify-around items-center px-2 py-1.5 bg-white border border-solid border-[color:var(--Gray-Scale-Gray-100,#d6d3d1)] rounded-[170px]">
            <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
              <IconButton
                color="primary"
                // sx={{ border: "0.5px solid #d6d3d1" }}
                onClick={() => setQuantity(quantity - 1)}
              >
                <RiSubtractFill
                  style={{
                    color: "#666666",
                    width: "15px",
                    height: "15px",
                  }}
                />
              </IconButton>
            </div>
            <div className="text-zinc-900 text-center text-sm leading-6 mx-2">
              {quantity === null ? orderItem.quantity : quantity}
            </div>
            <div className="bg-zinc-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
              <IconButton
                color="primary"
                onClick={() => setQuantity(quantity + 1)}
                // sx={{ border: "0.2px solid #d6d3d1" }}
              >
                <IoIosAdd
                  style={{
                    color: "#666666",
                    width: "15px",
                    height: "15px",
                  }}
                />
              </IconButton>
            </div>
          </div>
        </div>

        <Button
          variant="contained"
          sx={{
            marginTop: "30px",
            marginX: "auto",
            textTransform: "none",
            borderRadius: "43px",
            color: "#F6F5FB",
            bgcolor: "#3F41A6",
            width: "130px",
            "&:hover": {
              bgcolor: "#3F41A6B2",
            },
          }}
          onClick={updateOrderItem}
        >
          Lưu thay đổi
        </Button>
      </div>
    </Dialog>
  );
}

export default EditOrderItem;
