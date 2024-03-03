import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import EditItemForPkg from "./EditItemForPkg";

function EditPkg({ id, setOpenSBar, categories }) {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // dialog
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  // local
  const [pkg, setPkg] = useState({});
  const [newInfo, setNewInfo] = useState({});
  const [serviceList, setServiceList] = useState([]);
  const [accsList, setAccsList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState({});

  // get detail item
  useEffect(() => {
    axiosPrivate
      .get(`/item-service-pack/${id}/`)
      .then((res) => {
        console.log(res.data);
        setPkg(res.data);
        setServiceList(res.data.item.filter((item) => item.type === "SERVICE"));
        setAccsList(res.data.item.filter((item) => item.type === "ACCESSORY"));
        setProductList(res.data.item.filter((item) => item.type === "PRODUCT"));
        setNewInfo({});
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // get total price
  const getPrice = (services, accs, products) => {
    // reduce
    let fixed_price = products.reduce(
      (total, item) => total + Number(item.fixed_price),
      0
    );
    let min_price =
      services.reduce((total, item) => total + Number(item.min_price), 0) +
      accs.reduce((total, item) => total + Number(item.min_price), 0) +
      fixed_price;
    let max_price =
      services.reduce((total, item) => total + Number(item.max_price), 0) +
      accs.reduce((total, item) => total + Number(item.max_price), 0) +
      fixed_price;
    // console.log(fixed_price, min_price, max_price);
    setTotalPrice({ min_price, max_price });
  };

  // update for item list (total price (placeholder) + list)
  useEffect(() => {
    let services = serviceList ?? [];
    let accs = accsList ?? [];
    let products = productList ?? [];
    // price
    getPrice(services, accs, products);
    // itemlist
    let itemList = services.concat(accs, products);
    let idList = itemList.map((item) => item.id);
    setNewInfo({ ...newInfo, item: idList });
  }, [serviceList, accsList, productList]);

  // Update pkg basic info
  const updatePkg = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  // remove selected item
  const removeSelected = (id, typ) => {
    if (typ === "SERVICE") {
      const newList = serviceList.filter((item) => item.id !== id);
      setServiceList(newList);
    } else if (typ === "ACCESSORY") {
      const newList = accsList.filter((item) => item.id !== id);
      setAccsList(newList);
    } else {
      const newList = productList.filter((item) => item.id !== id);
      setProductList(newList);
    }
  };

  //Edit item
  const handleEditItem = async (e) => {
    e.preventDefault();

    console.log(newInfo);

    axiosPrivate
      .patch(`/item-service-pack/${id}/`, newInfo)
      .then((res) => {
        // console.log(res.data);
        setPkg(res.data);
        setServiceList(res.data.item.filter((item) => item.type === "SERVICE"));
        setAccsList(res.data.item.filter((item) => item.type === "ACCESSORY"));
        setProductList(res.data.item.filter((item) => item.type === "PRODUCT"));
        setNewInfo({});
        // navigate("/studio/items", { replace: true });
      })
      .then(() => {
        setOpenSBar(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form
      onSubmit={handleEditItem}
      className="forms flex flex-col gap-5 items-center pb-5"
    >
      <Paper
        sx={{
          width: "800px",
          margin: "10px auto",
          border: "1px solid #d6d3d1",
          paddingBottom: "20px",
        }}
      >
        <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start ">
          Thông tin cơ bản
        </div>
        <Divider />
        <div className="flex flex-col items-stretch px-6 mt-6 ">
          <div className="flex gap-5 ">
            <div className="flex flex-col items-stretch w-[60%] ">
              <div className="flex flex-col grow items-stretch">
                <div className="text-sm leading-5 text-zinc-900 max-md:max-w-full">
                  Tên gói dịch vụ
                </div>
                <TextField
                  required
                  variant="outlined"
                  name="name"
                  value={newInfo?.name ? newInfo?.name : pkg?.name}
                  onChange={updatePkg}
                  // error={errMsg.pkg?.name ? true : false}
                  // helperText={errMsg.pkg?.name ? errMsg.pkg.name[0] : ""}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "400px",
                    marginY: "10px",
                  }}
                />

                <div className="text-sm leading-5 text-zinc-900">Danh mục</div>
                <TextField
                  required
                  id="outlined-select-categories"
                  name="category"
                  value={
                    newInfo.category ? newInfo.category : pkg.category ?? ""
                  }
                  onChange={updatePkg}
                  defaultValue=""
                  select
                  // error={errMsg.pkg?.category ? true : false}
                  // helperText={
                  //   errMsg.pkg?.category ? errMsg.pkg.category[0] : ""
                  // }
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                      paddingY: "12px",
                    },
                    width: "400px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">--Chọn danh mục--</MenuItem>
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            <div className="flex flex-col items-stretch ml-5 w-[40%] max-md:ml-0 max-md:w-full">
              {/* Hinh anh lien quan */}
            </div>
          </div>
          <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
            Mô tả gói dịch vụ
          </div>
          <TextField
            required
            id="outlined-multiline-static"
            name="description"
            value={
              newInfo?.description ? newInfo?.description : pkg?.description
            }
            onChange={updatePkg}
            multiline
            rows={3}
            // error={errMsg.pkg?.description ? true : false}
            // helperText={
            //   errMsg.pkg?.description ? errMsg.pkg.description[0] : ""
            // }
            sx={{
              width: "750px",
              marginTop: "10px",
            }}
          />

          {/* Choose item list for pkg */}
          <div className="mt-8 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:items-stretch">
              {/* Dich vu chinh */}
              <div className="flex flex-col items-stretch w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow items-stretch leading-[150%] max-md:mt-10">
                  <div className="justify-center text-sm text-zinc-900">
                    Các dịch vụ chính
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {serviceList?.map((service) => (
                      <Paper
                        key={service.id}
                        className="flex flex-col items-stretch p-2.5 w-full rounded-lg"
                        sx={{
                          border: "1px solid #d6d3d1",
                        }}
                      >
                        <div className="flex gap-5 justify-between items-stretch text-sm font-medium text-zinc-500">
                          <div className="flex-auto">{service.name}</div>
                          <IconButton
                            sx={{
                              padding: 0,
                              border: "0.5px solid #d6d3d1",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                            }}
                            onClick={() =>
                              removeSelected(service.id, "SERVICE")
                            }
                          >
                            <ClearIcon
                              sx={{
                                width: "15px",
                                height: "15px",
                              }}
                            />
                          </IconButton>
                        </div>
                        <div className="flex justify-between items-stretch mt-3 text-indigo-800 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className=" text-xs text-zinc-500">
                              Danh mục :
                            </div>
                            <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                              {service.category?.title}
                            </div>
                          </div>
                          <div className="my-auto text-lg font-semibold leading-4">
                            {service.min_price} - {service.max_price}
                          </div>
                        </div>
                      </Paper>
                    ))}

                    {/* Add Btn */}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog1(true)}
                      sx={{
                        textTransform: "none",
                        border: "1px solid #3F41A6",
                        color: "#3F41A6",
                        borderRadius: "4px",
                        "&:hover": {
                          border: "1px solid #3949AB",
                          bgcolor: "#E2E5FF",
                        },
                      }}
                    >
                      Thêm dịch vụ
                    </Button>
                  </div>

                  {/* Dialog thêm dịch vụ chính */}
                  <EditItemForPkg
                    open={openDialog1}
                    setOpen={setOpenDialog1}
                    type="SERVICE"
                    itemList={serviceList}
                    setItemList={setServiceList}
                  />
                </div>
              </div>

              {/* Dich vu ho tro */}
              <div className="flex flex-col items-stretch ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow items-stretch leading-[150%] max-md:mt-10">
                  <div className="justify-center text-sm text-zinc-900">
                    Các dịch vụ hỗ trợ
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {accsList?.map((service) => (
                      <Paper
                        key={service.id}
                        className="flex flex-col items-stretch p-2.5 w-full rounded-lg"
                        sx={{
                          border: "1px solid #d6d3d1",
                        }}
                      >
                        <div className="flex gap-5 justify-between items-stretch text-sm font-medium text-zinc-500">
                          <div className="flex-auto">{service.name}</div>
                          <IconButton
                            sx={{
                              padding: 0,
                              border: "0.5px solid #d6d3d1",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                            }}
                            onClick={() =>
                              removeSelected(service.id, "ACCESSORY")
                            }
                          >
                            <ClearIcon
                              sx={{
                                width: "15px",
                                height: "15px",
                              }}
                            />
                          </IconButton>
                        </div>
                        <div className="flex justify-between items-stretch mt-3 text-indigo-800 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className=" text-xs text-zinc-500">
                              Danh mục :
                            </div>
                            <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                              {service.category?.title}
                            </div>
                          </div>
                          <div className="my-auto text-lg font-semibold leading-4">
                            {service.min_price} - {service.max_price}
                          </div>
                        </div>
                      </Paper>
                    ))}
                    {/* Add Btn */}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog2(true)}
                      sx={{
                        textTransform: "none",
                        border: "1px solid #3F41A6",
                        color: "#3F41A6",
                        borderRadius: "4px",
                        "&:hover": {
                          border: "1px solid #3949AB",
                          bgcolor: "#E2E5FF",
                        },
                      }}
                    >
                      Thêm dịch vụ
                    </Button>
                  </div>

                  {/* Dialog thêm dịch vụ hỗ trợ */}

                  <EditItemForPkg
                    open={openDialog2}
                    setOpen={setOpenDialog2}
                    type="ACCESSORY"
                    itemList={accsList}
                    setItemList={setAccsList}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-9 flex gap-10 ">
            {/* Hàng hóa */}
            <div className="flex flex-col items-stretch w-6/12 ">
              <div className="flex flex-col grow items-stretch leading-[150%] ">
                <div className="justify-center text-sm text-zinc-900">
                  Các hàng hóa
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {productList?.map((product) => (
                    <Paper
                      key={product.id}
                      className="flex flex-col items-stretch p-2.5 w-full rounded-lg"
                      sx={{
                        border: "1px solid #d6d3d1",
                      }}
                    >
                      <div className="flex gap-5 justify-between items-stretch text-sm font-medium text-zinc-500">
                        <div className="flex-auto">{product.name}</div>
                        <IconButton
                          sx={{
                            padding: 0,
                            border: "0.5px solid #d6d3d1",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={() => removeSelected(product.id, "PRODUCT")}
                        >
                          <ClearIcon
                            sx={{
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </IconButton>
                      </div>
                      <div className="flex justify-between items-stretch mt-3 text-indigo-800 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className=" text-xs text-zinc-500">
                            Danh mục :
                          </div>
                          <div className="justify-center items-stretch px-2 py-px text-sm bg-violet-50 rounded">
                            {product.category?.title}
                          </div>
                        </div>
                        <div className="my-auto text-lg font-semibold leading-4">
                          {product.fixed_price}
                        </div>
                      </div>
                    </Paper>
                  ))}

                  {/* Add Btn */}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog3(true)}
                    sx={{
                      textTransform: "none",
                      border: "1px solid #3F41A6",
                      color: "#3F41A6",
                      borderRadius: "4px",
                      "&:hover": {
                        border: "1px solid #3949AB",
                        bgcolor: "#E2E5FF",
                      },
                    }}
                  >
                    Thêm hàng hóa
                  </Button>
                </div>

                {/* Dialog thêm hàng hóa */}
                <EditItemForPkg
                  open={openDialog3}
                  setOpen={setOpenDialog3}
                  type="PRODUCT"
                  itemList={productList}
                  setItemList={setProductList}
                />
              </div>
            </div>

            {/* Tổng cộng */}
            <div className="flex flex-col items-stretch w-6/12">
              <div className="justify-center text-sm text-zinc-900">
                Giá tham khảo toàn bộ gói dịch vụ
              </div>
              <div className="justify-start items-stretch flex gap-5">
                <TextField
                  required
                  variant="outlined"
                  name="min_price"
                  value={newInfo?.min_price ?? pkg?.min_price}
                  placeholder={totalPrice.min_price ?? 0}
                  onChange={updatePkg}
                  // error={errMsg.pkg?.min_price ? true : false}
                  // helperText={
                  //   errMsg.pkg?.min_price ? errMsg.pkg.min_price[0] : ""
                  // }
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "40px",
                      boxSizing: "border-box",
                    },
                    width: "120px",
                    marginY: "10px",
                  }}
                />
                <div className="text-black text-sm leading-5 my-auto">-</div>
                <TextField
                  required
                  variant="outlined"
                  name="max_price"
                  value={newInfo?.max_price ?? pkg?.max_price}
                  placeholder={totalPrice.max_price ?? 0}
                  onChange={updatePkg}
                  // error={errMsg.pkg?.max_price ? true : false}
                  // helperText={
                  //   errMsg.pkg?.max_price ? errMsg.pkg.max_price[0] : ""
                  // }
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "40px",
                      boxSizing: "border-box",
                    },
                    width: "120px",
                    marginY: "10px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Paper>

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4  self-center">
        <Button
          variant="outlined"
          onClick={() => {
            setPkg({});
            navigate("/studio/items", { replace: true });
          }}
          sx={{
            textTransform: "none",
            border: "1px solid #3F41A6",
            color: "#3F41A6",
            width: "120px",

            borderRadius: "20px",
            "&:hover": {
              border: "1px solid #3949AB",
            },
          }}
        >
          Quay lại
        </Button>

        <Button
          variant="contained"
          type="submit"
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "140px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Lưu thông tin
        </Button>
      </div>
    </form>
  );
}

export default EditPkg;
