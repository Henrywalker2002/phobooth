import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // Checkbox,
  IconButton,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  Typography,
  Alert,
  AlertTitle,
  Avatar,
} from "@mui/material";
import CartContext from "../../context/CartProvider";
import { useLocation, useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";
import EditAddress from "./EditAddress";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import AddressAlert from "./AddressAlert";
import { translateType } from "../../util/Translate";
import VariationPopover from "../../components/VariationPopover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import no_avt from "../../assets/blank-avatar.png";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/cart";
  // console.log(from);
  const [cookies] = useCookies(["accInfo"]);
  const axiosPrivate = useAxiosPrivate();
  const { itemLists, setItemLists } = useContext(CartContext);
  const [selectedItemList, setSelectedItemList] = useState({});
  const [openEditAddr, setOpenEditAddr] = useState(false);
  const [openAddrAlert, setOpenAddrAlert] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [currentItem, setCurrentItem] = useState({});
  const [variation, setVariation] = useState({});

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // check address
  useEffect(() => {
    if (!cookies.accInfo.address) {
      setOpenAddrAlert(true);
    }
  }, []);

  const getTotalPrice = (lst, typ) => {
    if (lst.length) {
      let result = lst.reduce((total, row) => {
        if (variation[row.item.id]) {
          return total + row?.number * variation[row.item.id].price;
        }
        if (row?.item?.fixed_price) {
          return total + row?.number * row?.item?.fixed_price;
        } else {
          return total + row?.number * row?.item[typ];
        }
      }, 0);

      return result;
    }
    return 0;
  };

  const showTotalPrice = (lst) => {
    let min_price = getTotalPrice(lst, "min_price");
    let max_price = getTotalPrice(lst, "max_price");
    if (min_price === max_price) return formatter.format(min_price);
    else
      return formatter.format(min_price) + " - " + formatter.format(max_price);
  };

  function getPrice(row) {
    if (variation[row.item.id]) {
      let price = variation[row.item.id].price * row.number;
      return formatter.format(price);
    }
    if (row?.item?.fixed_price) {
      return formatter.format(row?.item?.fixed_price * row?.number);
    }
    let min_price = row?.item?.min_price * row?.number;
    let max_price = row?.item?.max_price * row?.number;
    return formatter.format(min_price) + " - " + formatter.format(max_price);
  }

  const handleUpdateNote = (e, studioId) => {
    let selectedLst = itemLists.find((lst) => lst.studio.id === studioId);
    selectedLst.note = e.target.value;
  };

  const handleCreateOrder = () => {
    try {
      for (let itemLst of itemLists) {
        let order_item = itemLst.items.map((item) => {
          if (variation[item.item.id]) {
            return {
              quantity: item.number,
              variation: variation[item.item.id].id,
            };
          } else {
            return {
              quantity: item.number,
              item: item.item.id,
            };
          }
        });
        let updateOrderLst = {
          order_item: order_item,
          note: itemLst.note,
          address: {
            id: itemLst.address.id,
            street: itemLst.address.street,
            ward: itemLst.address.ward.code,
            district: itemLst.address.district.code,
            province: itemLst.address.province.code,
          },
        };

        console.log(updateOrderLst);

        axiosPrivate
          .post("/order/", updateOrderLst)
          .then((res) => {
            console.log(res);

            navigate("/orders", { replace: true });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = () => {
    setItemLists([]);
    navigate(from, { replace: true });
  };

  // update address
  const handleChangeAddress = (newAddr) => {
    console.log(newAddr);
    let newItemList = itemLists.map((lst) => {
      return lst.studio.id === selectedItemList.studio.id
        ? {
            studio: lst.studio,
            items: lst.items,
            address: {
              ...lst.address,
              ...newAddr,
            },
          }
        : lst;
    });

    setItemLists(newItemList);
    setOpenEditAddr(false);
  };

  // update number
  const handleChangeNumber = (studioId, row, op) => {
    let number = row?.number;
    if (op === "-") number--;
    else number++;

    let newItemLists = itemLists.map((lst) => {
      if (lst.studio.id === studioId) {
        let newItems = lst.items.map((item) => {
          return item.id === row.id
            ? {
                ...item,
                number: number,
              }
            : item;
        });

        return {
          studio: lst.studio,
          items: newItems,
          address: lst.address,
        };
      }
      return lst;
    });

    setItemLists(newItemLists);
  };

  // delete item
  const handleDeleteItem = (studioId, rowId) => {
    let newItemLists = itemLists.map((lst) => {
      if (lst.studio.id === studioId) {
        let newItems = lst.items.filter((item) => item.id !== rowId);
        return {
          studio: lst.studio,
          items: newItems,
          address: lst.address,
        };
      }
      return lst;
    });

    setItemLists(newItemLists);
  };

  const handleOpenVariation = (e, item) => {
    setCurrentItem(item);
    setAnchorEl(e.currentTarget);
  };

  const handleCloseVariation = () => {
    setAnchorEl(null);
  };

  const textVariation = (variation) => {
    let text = "";
    if (variation) {
      for (let values of variation.value) {
        text += values.name + ", ";
      }
    }
    text = text.slice(0, -2);
    return text;
  };

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
          paddingLeft: "100px",
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

        {from === "/cart" && (
          <Link
            component="button"
            underline="none"
            key="2"
            color="inherit"
            onClick={() => navigate("/cart", { replace: true })}
          >
            Quản lý giỏ hàng
          </Link>
        )}

        <Typography
          key="3"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Đặt sản phẩm
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap">
        Đặt sản phẩm
      </div>

      {/* Tables */}
      {itemLists?.map((itemList) => {
        return itemList.items.length > 0 ? (
          <TableContainer
            key={itemList.studio.id}
            component={Paper}
            sx={{
              width: "90%",
              margin: "20px auto",
              border: "0.5px solid #d6d3d1",
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                <TableRow>
                  <TableCell
                    sx={{ color: "#3F41A6", paddingLeft: "40px", width: "30%" }}
                  >
                    SẢN PHẨM
                  </TableCell>

                  <TableCell sx={{ color: "#3F41A6", width: "20%" }}>
                    PHÂN LOẠI HÀNG
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "10%" }}
                  >
                    PHÂN LOẠI
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "15%" }}
                  >
                    DANH MỤC
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "10%" }}
                  >
                    SỐ LƯỢNG
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#3F41A6", width: "20%" }}
                  >
                    GIÁ (VNĐ)
                  </TableCell>
                  <TableCell sx={{ width: "5%" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {itemList.items?.map((row, index) => (
                  <TableRow
                    key={index}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ paddingLeft: "40px" }}
                    >
                      <div className="items-stretch flex gap-5">
                        <img
                          loading="lazy"
                          src={
                            row.item?.picture
                              ? row.item?.picture
                              : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                          }
                          className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full rounded-lg"
                        />
                        <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                          {row.item?.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="flex gap-1 items-center max-w-full">
                        {variation[row.item.id] ? (
                          <div className="truncate max-w-[200px]">
                            {textVariation(variation[row.item.id])}
                          </div>
                        ) : row.item.type === "PRODUCT" ? (
                          "Chọn"
                        ) : (
                          ""
                        )}
                        <IconButton
                          onClick={(e) => handleOpenVariation(e, row.item)}
                          disabled={row.item.type === "PRODUCT" ? false : true}
                          sx={{
                            color: "#000",
                            padding: 0,
                          }}
                        >
                          {row.item.type === "PRODUCT" ? (
                            <ArrowDropDownIcon />
                          ) : (
                            ""
                          )}
                        </IconButton>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="w-fit h-fit text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                        {translateType(row.item?.type)}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="w-fit h-fit text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 px-2 py-1">
                        {row.item?.category?.title}
                      </div>
                    </TableCell>
                    <TableCell align="left" sx={{ width: "150px" }}>
                      <div className="w-fit justify-center items-center border border-[color:var(--gray-scale-gray-100,#d6d3d1)] bg-white flex gap-0 px-2 py-1 rounded-[170px] border-solid self-end">
                        <div className="bg-indigo-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleChangeNumber(itemList.studio.id, row, "-")
                            }
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
                        <div className="text-indigo-800 text-center text-sm leading-6 mx-2">
                          {row.number}
                        </div>
                        <div className="bg-indigo-100 flex w-[20px] shrink-0 h-[20px] flex-col rounded-[170px] items-center justify-center">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleChangeNumber(itemList.studio.id, row, "+")
                            }
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
                    </TableCell>
                    <TableCell align="left" sx={{ width: "200px" }}>
                      {getPrice(row)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleDeleteItem(itemList.studio.id, row.id)
                        }
                        sx={{
                          padding: 0,
                          border: "0.5px solid #d6d3d1",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                        }}
                      >
                        <ClearIcon
                          sx={{
                            width: "15px",
                            height: "15px",
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* More Info */}
            <div className="flex w-full justify-around my-3">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Avatar
                    alt={itemList.studio?.friendly_name}
                    src={itemList.studio?.avatar ?? no_avt}
                    sx={{ width: 50, height: 50 }}
                  />
                  <div className="justify-center text-indigo-800 text-lg font-semibold tracking-wider self-center grow shrink basis-auto my-auto">
                    {itemList.studio?.friendly_name}
                  </div>
                </div>

                <TextField
                  id="outlined-basic"
                  label="Khuyến mãi"
                  variant="outlined"
                  placeholder="Nhập mã khuyến mãi"
                  sx={{
                    borderColor: "#E6E6E6",
                    fontSize: "10px",
                    width: "450px",
                  }}
                />

                <TextField
                  id="outlined-multiline-static"
                  label="Lời nhắn"
                  multiline
                  name="note"
                  onChange={(e) => handleUpdateNote(e, itemList.studio.id)}
                  rows={3}
                  placeholder="Để lại ghi chú thêm về sản phẩm..."
                  sx={{
                    borderColor: "#E6E6E6",
                    fontSize: "10px",
                    width: "450px",
                  }}
                />
              </div>
              <div className="max-w-[600px] py-3 flex flex-col justify-between items-stretch ">
                <Alert
                  sx={{
                    bgcolor: "transparent",
                    color: "#78716C",
                    padding: "0",
                  }}
                  icon={
                    <LocationOnOutlinedIcon
                      fontSize="inherit"
                      sx={{ color: "#3F41A6" }}
                    />
                  }
                >
                  <AlertTitle>
                    <div className=" text-zinc-900 text-lg font-semibold leading-8 whitespace-nowrap">
                      Địa chỉ nhận hàng :
                    </div>
                  </AlertTitle>
                  <div className="flex items-start gap-2">
                    <div className=" text-stone-500 text-base leading-6">
                      {itemList?.address?.street},{" "}
                      {itemList?.address?.ward?.name_with_type},{" "}
                      {itemList?.address?.district?.name_with_type},{" "}
                      {itemList?.address?.province?.name_with_type}
                    </div>
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={() => {
                        setSelectedItemList(itemList);
                        setOpenEditAddr(true);
                      }}
                    >
                      <EditIcon sx={{ color: "#3F41A6", fontSize: "22px" }} />
                    </IconButton>
                  </div>
                </Alert>
                <div className="flex flex-col gap-1 ml-8">
                  <div className=" justify-between bg-white flex">
                    <div className="text-zinc-900 text-lg font-semibold leading-8 whitespace-nowrap">
                      Tổng giá tham khảo :
                    </div>
                    <div className="text-indigo-800 text-lg font-semibold leading-6 self-center whitespace-nowrap">
                      {showTotalPrice(itemList.items)}
                    </div>
                  </div>
                  <div className=" text-stone-500 text-base leading-6">
                    Lưu ý: Giá trên chỉ là giá tham khảo, giá chính xác sẽ được
                    cửa hàng cập nhật và thông báo sau khi đặt sản phẩm.
                  </div>
                </div>
              </div>
            </div>
          </TableContainer>
        ) : null;
      })}

      {/* Btns */}
      <div className="w-fit mx-auto my-5 flex gap-5">
        <Button
          variant="outlined"
          onClick={handleCancelOrder}
          sx={{
            borderRadius: "43px",
            borderColor: "#3F41A6",
            color: "#3F41A6",
            padding: "0 30px",
            textTransform: "none",
            width: "fit-content",
            "&:hover": {
              bgcolor: "#F6F5FB",
              borderColor: "#3F41A6",
            },
          }}
        >
          Hủy đặt
        </Button>
        <Button
          onClick={handleCreateOrder}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "43px",
            color: "#F6F5FB",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            "&:hover": {
              bgcolor: "#3F41A6B2",
            },
          }}
        >
          Đặt sản phẩm
        </Button>
      </div>

      {/* Edit Address */}
      <EditAddress
        open={openEditAddr}
        setOpen={setOpenEditAddr}
        address={selectedItemList.address}
        handleChangeAddress={handleChangeAddress}
      />

      {/* Address Alert */}
      <AddressAlert open={openAddrAlert} setOpen={setOpenAddrAlert} />
      <VariationPopover
        open={open}
        handleClose={handleCloseVariation}
        anchorEl={anchorEl}
        item_id={currentItem.id}
        variation={variation}
        setVariation={setVariation}
      />
    </div>
  );
}

export default Booking;
