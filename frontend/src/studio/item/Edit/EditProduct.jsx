import React, { useEffect, useState } from "react";
import {
  Divider,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ImgAlert from "../../../components/ImgAlert";
import ErrDialog from "../ErrDialog";
import { validFixedPrice } from "../../../util/Validation";

function EditProduct({ id, setOpenSBar, categories }) {
  // global
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // dialog
  const [openImg, setOpenImg] = useState(false);
  const [openImgAlert, setOpenImgAlert] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  // local
  const infoMsg = "Không cập nhật trường này !";
  const [product, setProduct] = useState({});
  const [newInfo, setNewInfo] = useState({});
  const [newOptValList, setNewOptValList] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  // img
  const [imgList, setImgList] = useState([]);
  const [newImgList, setNewImgList] = useState([]);
  const [delImgList, setDelImgList] = useState([]);

  // get detail item
  useEffect(() => {
    axiosPrivate
      .get(`/item-product/${id}/`)
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
        setNewOptValList(res.data.variation);
        setImgList(res.data.pictures);
        setNewInfo({});
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // update price + stock for variation
  const handleUpdateVariation = (e, id) => {
    // console.log(e.target.value);
    const newList = newOptValList.map((optValue) =>
      optValue.id === id
        ? {
            ...optValue,
            [e.target.name]: Number(e.target.value),
          }
        : optValue
    );
    setNewOptValList(newList);
  };

  // product
  const updateProduct = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  // ImgList
  // Add img into new img list
  const handleAddImgList = (e) => {
    let imgFiles = e.target.files;
    if (imgFiles.length > 0) {
      let newList = [...newImgList];
      for (let imgFile of imgFiles) {
        newList.push({
          id: uuidv4(),
          img_preview: URL.createObjectURL(imgFile),
          img_file: imgFile,
        });
      }
      setNewImgList(newList);
    }
  };

  // delete img in new list
  const handleDeleteNewImg = (id) => {
    const newList = newImgList.filter((img) => img.id !== id);
    setNewImgList(newList);
  };

  // delete img in old list
  const handleDeleteImg = (id) => {
    const newList = imgList.filter((img) => img.id !== id);
    let delIdList = [...delImgList];
    delIdList.push(id);
    setImgList(newList);
    setDelImgList(delIdList);
  };

  // Check price for product
  const checkFixedPrice = (price) => {
    if (price) {
      if (!validFixedPrice(price)) {
        setErrMsg({
          ...errMsg,
          fixed_price: ["Giá trị không hợp lệ!"],
        });
        return false;
      }
    }
    return true;
  };

  // Check Stock for variation
  const checkStock = (stock) => {
    if (!stock || isNaN(stock) || stock === "") return false;
    return true;
  };

  // Check price for variation
  const checkPrice = (price) => {
    if (!price || isNaN(price) || price == 0 || price === "") return false;
    return true;
  };

  //Edit item
  const handleEditItem = async (e) => {
    e.preventDefault();
    console.log(imgList, newImgList, delImgList);

    let imgCount = imgList.length + newImgList.length;
    if (imgCount < 4 || imgCount > 10) setOpenImgAlert(true);
    else if (checkFixedPrice(newInfo.fixed_price)) {
      let updatedFlag = false;
      // update price + stock in variation
      if (newOptValList.length > 0) {
        for await (let variant of newOptValList) {
          const oldVariant = product?.variation.find(
            (item) => item.id === variant.id
          );
          if (JSON.stringify(oldVariant) !== JSON.stringify(variant)) {
            await axiosPrivate
              .patch(`/item-variation/${variant.id}/`, {
                price: variant.price,
                stock: variant.stock,
              })
              .then((res) => {
                // console.log(res.data);
                updatedFlag = true;
              })
              .catch((err) => {
                console.log(err);
                updatedFlag = false;
                setOpenErr(true);
              });
          }
        }
      }

      // add img list
      if (newImgList.length > 0) {
        for await (const img of newImgList) {
          // form-data
          let formData = new FormData();
          formData.append(`picture`, img.img_file, img.img_file.name);
          formData.append("item", id);

          await axiosPrivate
            .post("/item-picture/", formData, {
              headers: {
                ...axiosPrivate.defaults.headers,
                "content-type": "multipart/form-data",
              },
            })
            .then((res) => {
              // console.log(res.data);
              updatedFlag = true;
            })
            .catch((err) => {
              console.log(err);
              updatedFlag = false;
              setOpenErr(true);
            });
        }
      }

      // del img list
      if (delImgList.length > 0) {
        for await (let delId of delImgList) {
          await axiosPrivate
            .delete(`/item-picture/${delId}/`, { item: product.id })
            .then((res) => {
              // console.log(res.data);
              updatedFlag = true;
            })
            .catch((err) => {
              console.log(err);
              updatedFlag = false;
              setOpenErr(true);
            });
        }
      }

      // update other info
      if (Object.keys(newInfo).length > 0) {
        await axiosPrivate
          .patch(`/item-product/${id}/`, newInfo)
          .then((res) => {
            // console.log(res.data);
            updatedFlag = true;
          })
          .catch((err) => {
            console.log(err);
            updatedFlag = false;
            if (err.response?.status === 400) {
              setErrMsg({ ...errMsg, ...err.response.data });
            } else {
              setOpenErr(true);
            }
          });
      }

      // Successful Notice + setup all product info
      if (updatedFlag) {
        await axiosPrivate
          .get(`/item-product/${id}/`)
          .then((res) => {
            console.log(res.data);
            setProduct(res.data);
            setNewOptValList(res.data.variation);
            setImgList(res.data.pictures);
            setDelImgList([]);
            setNewImgList([]);
            setNewInfo({});
            setErrMsg({});
            setOpenSBar(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
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
        <div className="flex flex-col items-stretch px-7 mt-6">
          <div className="flex gap-5">
            <div className="flex flex-col items-stretch w-[60%]">
              <div className="flex flex-col grow items-stretch max-md:mt-10 max-md:max-w-full">
                <div className="text-sm leading-5 text-zinc-900 max-md:max-w-full">
                  Tên hàng hóa
                </div>
                <TextField
                  required
                  variant="outlined"
                  name="name"
                  value={product?.name ?? ""}
                  helperText={"Không được cập nhật tên"}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "350px",
                    marginY: "10px",
                  }}
                />
                <div className="flex gap-5 justify-between items-stretch mt-6 w-[350px]">
                  <div className="flex flex-col flex-1 items-stretch">
                    <div className="text-sm leading-5 text-zinc-900">
                      Danh mục
                    </div>
                    <TextField
                      required
                      id="outlined-select-categories"
                      name="category"
                      value={
                        newInfo.category
                          ? newInfo.category
                          : product.category ?? ""
                      }
                      onChange={updateProduct}
                      defaultValue={""}
                      select
                      error={errMsg?.category ? true : false}
                      helperText={errMsg?.category ? errMsg.category[0] : ""}
                      sx={{
                        "& .MuiInputBase-input": {
                          height: "45px",
                          boxSizing: "border-box",
                          paddingY: "12px",
                        },
                        width: "200px",
                        marginY: "10px",
                      }}
                    >
                      <MenuItem value={""}>--Chọn danh mục--</MenuItem>
                      {categories.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <div className="flex flex-col justify-center items-stretch self-start basis-0">
                    <div className="text-sm leading-5 text-zinc-900">
                      Giá (VNĐ)
                    </div>
                    <TextField
                      required
                      variant="outlined"
                      name="fixed_price"
                      value={
                        newInfo?.fixed_price
                          ? newInfo.fixed_price
                          : product?.fixed_price
                      }
                      onChange={updateProduct}
                      error={errMsg?.fixed_price ? true : false}
                      helperText={
                        errMsg?.fixed_price ? errMsg.fixed_price[0] : ""
                      }
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
            <div className="flex flex-col items-stretch ml-5 w-[40%]">
              {/* Phần hình ảnh liên quan */}
              <div className="flex flex-col items-stretch text-sm text-zinc-900 max-md:mt-10">
                <div className="justify-center">Hình ảnh hàng hóa</div>
                <div className="flex gap-4">
                  <Button
                    component="label"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      border: "1px solid #E0E0E0",
                      color: "#3F41A6",
                      width: "98px",
                      height: "105px",
                      marginTop: "10px",
                      borderRadius: "5px",
                      paddingX: "10px",
                      "&:hover": {
                        border: "2px solid #3949AB",
                      },
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <RiImageAddFill className="w-11 h-11" />
                      <div className="text-[10px] mt-1">Thêm hình ảnh</div>
                      <div className="text-[10px]">
                        ({imgList.length + newImgList.length}/10)
                      </div>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddImgList}
                      style={{
                        clip: "rect(0 0 0 0)",
                        clipPath: "inset(50%)",
                        height: 1,
                        overflow: "hidden",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        whiteSpace: "nowrap",
                        width: 1,
                      }}
                    />
                  </Button>

                  <ImageListItem
                    sx={{
                      display:
                        imgList.length > 0 || newImgList.length > 0
                          ? "block"
                          : "none",
                      marginTop: "10px",
                      width: "98px",
                      height: "105px",
                      border: "1px solid #E0E0E0",
                      borderRadius: "5px",
                      "& .MuiImageListItem-img": {
                        height: "105px",
                      },
                    }}
                  >
                    <img
                      width="98"
                      height="105"
                      className="rounded-[5px]"
                      src={imgList[0]?.img_preview}
                      // alt={item.title}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      // title="Xem thêm"
                      subtitle="Xem thêm"
                      sx={{ height: "40px", borderRadius: "5px" }}
                      actionIcon={
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          // aria-label={`info about ${item.title}`}
                          onClick={() => setOpenImg(true)}
                        >
                          <FaRegArrowAltCircleRight />
                        </IconButton>
                      }
                    />
                  </ImageListItem>

                  {/* Dialog Album */}
                  <Dialog
                    open={openImg}
                    onClose={() => setOpenImg(false)}
                    sx={{
                      "& .MuiDialog-paper": {
                        width: "800px",
                        height: "500px",
                      },
                    }}
                  >
                    <DialogTitle>Danh sách hình ảnh liên quan</DialogTitle>
                    <DialogContent dividers={true}>
                      <div className="flex flex-col gap-5 w-full">
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<IoMdImages />}
                          sx={{
                            textTransform: "none",
                            border: "1px solid #3F41A6",
                            color: "#3F41A6",
                            width: "160px",
                            marginBottom: "20px",
                            borderRadius: "20px",
                            alignSelf: "center",
                            "&:hover": {
                              border: "1px solid #3949AB",
                            },
                          }}
                        >
                          Thêm hình ảnh
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAddImgList}
                            style={{
                              clip: "rect(0 0 0 0)",
                              clipPath: "inset(50%)",
                              height: 1,
                              overflow: "hidden",
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              whiteSpace: "nowrap",
                              width: 1,
                            }}
                          />
                        </Button>

                        {imgList?.length > 0 || newImgList?.length > 0 ? (
                          <div className="flex flex-wrap gap-6">
                            {/* Old list */}
                            {imgList?.map((img, i) => (
                              <Badge
                                key={i}
                                badgeContent={
                                  <IconButton
                                    onClick={() => handleDeleteImg(img.id)}
                                  >
                                    <HighlightOffIcon
                                      sx={{
                                        color: "#1A1a1a",
                                      }}
                                    />
                                  </IconButton>
                                }
                                sx={{
                                  bgcolor: "transparent",
                                }}
                              >
                                <img
                                  className="w-[112px] h-[110px]"
                                  src={img.picture}
                                  // alt={item.title}
                                  loading="lazy"
                                />
                              </Badge>
                            ))}
                            {/* New List */}
                            {newImgList?.map((img, i) => (
                              <Badge
                                key={i}
                                badgeContent={
                                  <IconButton
                                    onClick={() => handleDeleteNewImg(img.id)}
                                  >
                                    <HighlightOffIcon
                                      sx={{
                                        color: "#1A1a1a",
                                      }}
                                    />
                                  </IconButton>
                                }
                                sx={{
                                  bgcolor: "transparent",
                                }}
                              >
                                <img
                                  className="w-[112px] h-[110px]"
                                  src={img.img_preview}
                                  // alt={item.title}
                                  loading="lazy"
                                />
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "No image"
                        )}
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        sx={{
                          // textTransform: "none",
                          color: "#3F41A6",
                        }}
                        onClick={() => setOpenImg(false)}
                      >
                        Đóng
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-sm leading-5 text-zinc-900 max-md:max-w-full">
            Mô tả hàng hóa
          </div>
          <TextField
            required
            id="outlined-multiline-static"
            name="description"
            value={
              newInfo?.description ? newInfo?.description : product?.description
            }
            onChange={updateProduct}
            multiline
            rows={3}
            error={errMsg?.description ? true : false}
            helperText={errMsg?.description ? errMsg.description[0] : ""}
            sx={{
              width: "730px",
              marginTop: "10px",
            }}
          />

          {/* Option_names */}
          <div className="flex gap-5 justify-between items-stretch mt-8">
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">Đặc điểm 1</div>
              <TextField
                variant="outlined"
                value={product?.option ? product?.option[0]?.name : ""}
                helperText={infoMsg}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />
            </div>
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">Đặc điểm 2</div>
              <TextField
                variant="outlined"
                value={product?.option ? product?.option[1]?.name : ""}
                helperText={infoMsg}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />
            </div>
          </div>

          {/* Option_values */}
          <div className="flex gap-5 justify-between items-stretch mt-6 max-w-full text-sm text-zinc-900">
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">Phân loại 1</div>
              {product?.option
                ? product?.option[0]?.value?.map((opt, i) => (
                    <TextField
                      key={i}
                      variant="outlined"
                      value={opt ?? ""}
                      helperText={infoMsg}
                      sx={{
                        "& .MuiInputBase-input": {
                          height: "45px",
                          boxSizing: "border-box",
                        },
                        width: "250px",
                        marginY: "10px",
                      }}
                    />
                  ))
                : null}
            </div>
            <div className="flex flex-col flex-1 items-stretch">
              <div className="text-sm leading-5 text-zinc-900">Phân loại 2</div>
              {product?.option
                ? product?.option[1]?.value?.map((opt, i) => (
                    <div className="flex items-center gap-5" key={i}>
                      <TextField
                        variant="outlined"
                        value={opt ?? ""}
                        helperText={infoMsg}
                        sx={{
                          "& .MuiInputBase-input": {
                            height: "45px",
                            boxSizing: "border-box",
                          },
                          width: "250px",
                          marginY: "10px",
                        }}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>

          {/* Variation */}
          <div className="flex flex-col items-start pb-2.5 mt-8 bg-white rounded-lg border border-solid border-slate-100 max-md:max-w-full">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "#E2E5FF" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#3F41A6",
                      }}
                    >
                      Phân loại 1
                    </TableCell>

                    {!product?.option ? null : product?.option[1] ? (
                      <TableCell
                        align="left"
                        sx={{
                          color: "#3F41A6",
                        }}
                      >
                        Phân loại 2
                      </TableCell>
                    ) : null}
                    <TableCell align="left" sx={{ color: "#3F41A6" }}>
                      Giá tiền
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#3F41A6" }}>
                      Số lượng
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(newOptValList || []).length > 0 ? (
                    newOptValList?.map((variant, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {variant?.value ? variant?.value[0].name : ""}
                        </TableCell>

                        {variant?.value[1] ? (
                          <TableCell align="left">
                            {variant?.value[1]?.name ?? ""}
                          </TableCell>
                        ) : null}

                        <TableCell align="left">
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            name="price"
                            onChange={(e) =>
                              handleUpdateVariation(e, variant.id)
                            }
                            value={variant.price ?? ""}
                            error={!checkPrice(variant.price) ? true : false}
                            helperText={
                              checkPrice(variant.price)
                                ? ""
                                : "Nhập giá không hợp lệ !"
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                height: "40px",
                                boxSizing: "border-box",
                              },
                              width: "120px",
                              marginY: "10px",
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            name="stock"
                            onChange={(e) =>
                              handleUpdateVariation(e, variant.id)
                            }
                            value={variant.stock ?? ""}
                            error={!checkStock(variant.stock) ? true : false}
                            helperText={
                              checkStock(variant.stock)
                                ? ""
                                : "Nhập số lượng hợp lệ !"
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                height: "40px",
                                boxSizing: "border-box",
                              },
                              width: "120px",
                              marginY: "10px",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>No Option</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Paper>

      {/* Img Alert Dialog */}
      <ImgAlert
        open={openImgAlert}
        setOpen={setOpenImgAlert}
        setAddImg={setOpenImg}
      />

      {/* Other errors */}
      <ErrDialog open={openErr} setOpen={setOpenErr} />

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4  self-center">
        <Button
          variant="outlined"
          onClick={() => {
            setProduct({});
            navigate("/studio/items", { replace: true });
          }}
          sx={{
            textTransform: "none",
            border: "1px solid #3F41A6",
            color: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",

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
            width: "fit-content",
            padding: "5px 15px",
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

export default EditProduct;
