import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function EditService({ id, setOpenSBar, categories }) {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [service, setService] = useState({});
  const [newInfo, setNewInfo] = useState({});

  // get detail item
  useEffect(() => {
    axiosPrivate
      .get(`/item-service/${id}/`)
      .then((res) => {
        // console.log(res.data);
        setService(res.data);
        setNewInfo({
          category: res.data.category?.id,
          type: res.data.type,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // service
  const updateService = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  //Edit item
  const handleEditItem = async (e) => {
    e.preventDefault();
    // console.log(updateInfo);
    axiosPrivate
      .patch(`/item-service/${id}/`, newInfo)
      .then((res) => {
        // console.log(res.data);
        setService(res.data);
        setNewInfo({
          category: res.data.category?.id,
          type: res.data.type,
        });
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
          margin: "0 auto",
          border: "1px solid #d6d3d1",
          paddingBottom: "20px",
        }}
      >
        <div className="text-zinc-900 text-xl font-semibold leading-8 whitespace-nowrap shadow-sm bg-white justify-center pl-6 pr-16 py-3 rounded-lg items-start ">
          Thông tin cơ bản
        </div>
        <Divider />
        <div className="flex flex-col items-stretch mt-4 px-6 ">
          <div className="gap-5 flex">
            <div className="flex flex-col items-stretch w-[70%]">
              <div className="flex flex-col items-stretch ">
                <div className="text-zinc-900 text-sm leading-5 ">
                  Tên dịch vụ
                </div>
                <TextField
                  required
                  variant="outlined"
                  name="name"
                  value={newInfo?.name ? newInfo?.name : service?.name}
                  onChange={updateService}
                  // error={errMsg.service?.name ? true : false}
                  // helperText={errMsg.service?.name ? errMsg.service.name[0] : ""}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "350px",
                    marginY: "10px",
                  }}
                />
                <div className="gap-5 flex mt-6">
                  <div className="flex flex-col items-stretch w-[60%]">
                    <div className="justify-center items-stretch flex flex-col">
                      <div className="text-zinc-900 text-sm leading-5">
                        Giá đơn vị (VNĐ)
                      </div>
                      <div className="justify-center items-stretch flex gap-2.5 mt-1.5 pr-4">
                        <TextField
                          required
                          variant="outlined"
                          name="min_price"
                          value={
                            newInfo?.min_price
                              ? newInfo?.min_price
                              : service?.min_price
                          }
                          onChange={updateService}
                          // error={errMsg.service?.min_price ? true : false}
                          // helperText={
                          //   errMsg.service?.min_price
                          //     ? errMsg.service.min_price[0]
                          //     : ""
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
                        <div className="text-black text-sm leading-5 my-auto">
                          -
                        </div>
                        <TextField
                          required
                          variant="outlined"
                          name="max_price"
                          value={newInfo?.max_price ?? service?.max_price ?? ""}
                          onChange={updateService}
                          // error={errMsg.service?.max_price ? true : false}
                          // helperText={
                          //   errMsg.service?.max_price
                          //     ? errMsg.service.max_price[0]
                          //     : ""
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
                  <div className="flex flex-col items-stretch w-[49%] ml-5 max-md:w-full max-md:ml-0">
                    <div className="items-stretch flex grow flex-col max-md:mt-10">
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">
                          <div className="text-zinc-900 text-sm leading-5">
                            Loại dịch vụ
                          </div>
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="type"
                          onChange={updateService}
                          value={
                            newInfo?.type
                              ? newInfo?.type
                              : service?.type ?? null
                          }
                          // defaultValue="SERVICE"
                        >
                          <FormControlLabel
                            value="SERVICE"
                            // checked={newInfo?.type === "SERVICE" ? true : false}
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#3F41A6",
                                  },
                                }}
                              />
                            }
                            label="Dịch vụ chính"
                            sx={{
                              color: "#666",

                              "& .MuiTypography-root": {
                                fontSize: "14px",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="ACCESSORY"
                            // checked={newInfo?.type === "ACCESSORY" ? true : false}
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#3F41A6",
                                  },
                                }}
                              />
                            }
                            label="Dịch vụ hỗ trợ"
                            sx={{
                              color: "#666",

                              "& .MuiTypography-root": {
                                fontSize: "14px",
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[35%] ml-5">
              <div className="flex grow flex-col items-stretch">
                <div className="text-zinc-900 text-sm leading-5">Danh mục</div>
                <TextField
                  required
                  id="outlined-select-categories"
                  name="category"
                  value={
                    newInfo.category
                      ? newInfo.category
                      : service.category?.id ?? ""
                  }
                  onChange={updateService}
                  select
                  defaultValue={""}
                  // error={errMsg.service?.category ? true : false}
                  // helperText={
                  //   errMsg.service?.category ? errMsg.service.category[0] : ""
                  // }
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

                {/* Phần hình ảnh liên quan */}
              </div>
            </div>
          </div>
          <div className="text-zinc-900 text-sm leading-5 mt-12 max-md:max-w-full max-md:mt-10">
            Mô tả dịch vụ
          </div>
          <TextField
            required
            name="description"
            value={
              newInfo?.description ? newInfo?.description : service?.description
            }
            onChange={updateService}
            multiline
            rows={3}
            // error={errMsg.service?.description ? true : false}
            // helperText={
            //   errMsg.service?.description ? errMsg.service.description[0] : ""
            // }
            sx={{
              width: "730px",
              marginTop: "10px",
            }}
          />
        </div>
      </Paper>

      {/* Action Btn */}
      <div className="flex  gap-5 ml-4  self-center">
        <Button
          variant="outlined"
          onClick={() => {
            setService({});
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

export default EditService;
