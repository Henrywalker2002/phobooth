import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function AddOrderItemInfo({
  open,
  setOpen,
  selectedList,
  setSelectedList,
  getOrderDetail,
  setOpenAddOrderItem,
}) {
  const axiosPrivate = useAxiosPrivate();
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const displayPrice = (item) => {
    if (item.fixed_price) return formatter.format(item.fixed_price);
    else if (item.min_price && item.max_price)
      return `${formatter.format(item.min_price)} - ${formatter.format(
        item.max_price
      )}`;
    return "Chưa cập nhật";
  };

  // Check Quantity
  const checkQuantity = (quantity) => {
    if (
      (quantity !== undefined || quantity !== null) &&
      (isNaN(quantity) || quantity === "")
    )
      return false;
    return true;
  };

  // Check price
  const checkPrice = (price) => {
    if (
      (price !== undefined || price !== null) &&
      (isNaN(price) || price == 0 || price === "")
    )
      return false;
    return true;
  };

  //   Check disable for add btn
  const checkDisableAddBtn = () => {
    for (let order_item of selectedList) {
      if (
        !checkPrice(order_item.price) &&
        !checkQuantity(order_item.quantity)
      ) {
        return true;
      }
    }
    return false;
  };

  const handleUpdateInfo = (e, itemId) => {
    const newList = selectedList.map((order_item) =>
      order_item.item.id === itemId
        ? {
            ...order_item,
            [e.target.name]: e.target.value,
          }
        : order_item
    );
    setSelectedList(newList);
  };
  const handleAddItem = () => {
    console.log(selectedList);
    for (let item of selectedList) {
      let addItem = { ...item, item: item.item.id };
      axiosPrivate
        .post("/order-item/", addItem)
        .then((res) => {
          console.log(res);
          getOrderDetail();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setOpen(false);
    setOpenAddOrderItem(false);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setSelectedList([]);
        setOpen(false);
      }}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "1500px",
          maxHeight: "700px",
          width: "1300px",
        },
      }}
    >
      <DialogTitle>DANH SÁCH SẢN PHẨM THÊM VÀO ĐƠN HÀNG</DialogTitle>
      <DialogContent dividers={true}>
        {/* Tables */}
        <TableContainer
          component={Paper}
          sx={{
            width: "1100px",
            margin: "20px auto",
            border: "1px solid #d6d3d1",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#E2E5FF" }}>
              <TableRow>
                <TableCell sx={{ color: "#3F41A6" }}>SẢN PHẨM</TableCell>
                <TableCell sx={{ color: "#3F41A6" }}>PHÂN LOẠI</TableCell>

                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  DANH MỤC
                </TableCell>

                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  GIÁ THAM KHẢO(VNĐ)
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  CẬP NHẬT GIÁ
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  CẬP NHẬT SỐ LƯỢNG
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedList?.length > 0 ? (
                selectedList.map((order_item) => (
                  <TableRow
                    key={order_item.item.id}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <div className="items-stretch flex gap-5">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                          className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                        />
                        <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                          {order_item.item.name}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                        {order_item.item.type}
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                        {order_item.item.category?.title}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {displayPrice(order_item.item)}
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        required
                        id="outlined-basic"
                        variant="outlined"
                        name="price"
                        defaultValue={order_item?.price}
                        onChange={(e) =>
                          handleUpdateInfo(e, order_item.item.id)
                        }
                        error={!checkPrice(order_item?.price) ? true : false}
                        helperText={
                          checkPrice(order_item?.price)
                            ? ""
                            : "Nhập giá hợp lệ !"
                        }
                        sx={{
                          "& .MuiInputBase-input": {
                            height: "40px",
                            boxSizing: "border-box",
                          },
                          width: "130px",
                          marginY: "10px",
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        required
                        id="outlined-basic"
                        variant="outlined"
                        name="quantity"
                        defaultValue={order_item?.quantity}
                        onChange={(e) =>
                          handleUpdateInfo(e, order_item.item.id)
                        }
                        error={
                          !checkQuantity(order_item?.quantity) ? true : false
                        }
                        helperText={
                          checkQuantity(order_item?.quantity)
                            ? ""
                            : "Nhập số lượng hợp lệ !"
                        }
                        sx={{
                          "& .MuiInputBase-input": {
                            height: "40px",
                            boxSizing: "border-box",
                          },
                          width: "130px",
                          marginY: "10px",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>Chưa thêm sản phẩm nào</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Btn action */}
        <div className="flex gap-5 my-5 mx-auto w-fit">
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(false);
            }}
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "80px",

              borderRadius: "20px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            disabled={checkDisableAddBtn}
            onClick={() => handleAddItem()}
            sx={{
              textTransform: "none",
              bgcolor: "#3F41A6",
              width: "fit-content",
              padding: "5px 15px",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#3949AB",
              },
            }}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddOrderItemInfo;
