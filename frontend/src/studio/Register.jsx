import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Avatar,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Input,
  Link,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useAuth from "../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OtherErrDialog from "../components/OtherErrDialog";
import Err401Dialog from "../components/Err401Dialog";
import { translateErr } from "../util/Translate";

function Register() {
  // global
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  // local
  const [addresses, setAddresses] = useState([{ id: uuidv4() }]);
  const [provinces, setProvinces] = useState([]);
  const [studioInfo, setStudioInfo] = useState({});
  const [avt, setAvt] = useState({});
  const resetInfo = {
    friendly_name: "",
    code_name: "",
    email: "",
    phone: "",
    description: "",
  };
  // error
  const [errMsg, setErrMsg] = useState({});
  const [openErr401, setOpenErr401] = useState(false);
  const [openOtherErr, setOpenOtherErr] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/province/")
      .then((res) => {
        console.log(res);
        setProvinces(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdateAvt = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files.length > 0) {
      setAvt({
        avt_preview: URL.createObjectURL(e.target.files[0]),
        avt_file: e.target.files[0],
      });
    }
  };

  const updateStudioInfo = (e) => {
    setStudioInfo({ ...studioInfo, [e.target.name]: e.target.value });
  };

  const handleAddAddress = () => {
    const newList = [...addresses, { id: uuidv4() }];
    setAddresses(newList);
  };

  const handleUpdateProv = async (id, prov) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/province/${prov.code_name}/`
      );
      console.log(res);
      const newList = addresses.map((address) =>
        address.id === id
          ? {
              ...address,
              province: prov.code,
              distlist: res.data.districts,
            }
          : address
      );
      setAddresses(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDist = (id, dist_code) => {
    const newList = addresses.map((address) =>
      address.id === id
        ? {
            ...address,
            district: dist_code,
            wardlist: address.distlist?.find((dist) => dist.code === dist_code)
              ?.wards,
          }
        : address
    );
    setAddresses(newList);
  };

  const handleUpdateAddress = (e, id) => {
    const newList = addresses.map((address) =>
      address.id === id
        ? {
            ...address,
            [e.target.name]: e.target.value,
          }
        : address
    );
    console.log(newList);
    setAddresses(newList);
  };

  const handleDeleteAddress = (id) => {
    const newList = addresses.filter((address) => address.id !== id);
    setAddresses(newList);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(studioInfo, auth.access);
    const registerInfo = {
      ...studioInfo,
      address: {
        province: addresses[0].province,
        district: addresses[0].district,
        ward: addresses[0].ward,
        street: addresses[0].street,
      },
    };
    console.log(JSON.stringify(registerInfo), avt.avt_file);
    let formData = new FormData();
    if (avt.avt_file) {
      formData.append("avatar", avt.avt_file, avt.avt_file.name);
    }
    formData.append("data", JSON.stringify(registerInfo));

    let url = "http://127.0.0.1:8000/studio/";
    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${auth.access}`,
          "content-type": "multipart/form-data",
          // "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setAuth({ ...auth, studio: res.data });
        navigate("/studio/");
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 400) {
          let newErr = translateErr(err.response.data);
          setErrMsg(newErr);
        } else if (err.response?.status === 401) {
          setOpenErr401(true);
        } else {
          setOpenOtherErr(true);
        }
      });
  };

  console.log(studioInfo);
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
          marginTop: "30px",
          paddingLeft: "120px",
        }}
      >
        <Link
          underline="hover"
          key="1"
          sx={{ color: "#808080" }}
          // href="/studio"
          // onClick={handleClick}
        >
          <HomeOutlinedIcon />
        </Link>

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Đăng kí Studio
        </Typography>
      </Breadcrumbs>

      <Paper
        sx={{
          width: "800px",
          margin: "10px auto",
          border: "1px solid #d6d3d1",
        }}
      >
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap shadow-sm w-full justify-center pl-5 py-3 rounded-lg items-start">
          Đăng kí Studio
        </div>
        <Divider />
        <form onSubmit={handleRegister}>
          <div className="self-stretch flex items-stretch  gap-[130px] mt-5">
            <div className="flex basis-[0%] flex-col items-stretch ml-4">
              <div className="text-zinc-900 text-sm leading-5">
                Tên Studio *
              </div>
              <TextField
                required
                variant="outlined"
                name="friendly_name"
                value={studioInfo.friendly_name}
                onChange={updateStudioInfo}
                error={errMsg.friendly_name ? true : false}
                helperText={errMsg.friendly_name ? errMsg.friendly_name[0] : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5">
                Tên người dùng *
              </div>
              <TextField
                required
                variant="outlined"
                name="code_name"
                value={studioInfo.code_name}
                onChange={updateStudioInfo}
                error={errMsg.code_name ? true : false}
                helperText={errMsg.code_name ? errMsg.code_name[0] : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5 mt-4">
                Email (Studio) *
              </div>
              <TextField
                required
                variant="outlined"
                name="email"
                value={studioInfo.email}
                onChange={updateStudioInfo}
                InputProps={{
                  type: "email",
                }}
                error={errMsg.email ? true : false}
                helperText={errMsg.email ? errMsg.email[0] : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5 mt-4 ">
                Số điện thoại (Studio) *
              </div>
              <TextField
                required
                variant="outlined"
                name="phone"
                value={studioInfo.phone}
                onChange={updateStudioInfo}
                error={errMsg.phone ? true : false}
                helperText={errMsg.phone ? errMsg.phone[0] : ""}
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

            <div className="flex basis-[0%] flex-col items-stretch mt-9 ml-5 self-start">
              <Avatar
                alt="studio-logo"
                src={
                  avt.avt_preview
                    ? avt.avt_preview
                    : "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                }
                sx={{ width: 140, height: 140 }}
              />

              <Button
                component="label"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  border: "2px solid #3F41A6",
                  color: "#3F41A6",
                  width: "140px",
                  marginTop: "10px",
                  borderRadius: "20px",
                  "&:hover": {
                    border: "2px solid #3949AB",
                  },
                }}
              >
                Chọn hình ảnh
                <Input
                  required
                  type="file"
                  accept="image/*"
                  onChange={handleUpdateAvt}
                  sx={{
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
            </div>
          </div>

          <div className="flex flex-col ml-4">
            <div className="text-zinc-900 text-sm leading-5 mt-4 flex items-center gap-1">
              Địa chỉ Studio *
              <IconButton onClick={handleAddAddress}>
                <AddCircleOutlineIcon sx={{ width: "20px", height: "20px" }} />
              </IconButton>
            </div>
            {addresses.length > 1 ? (
              addresses.map((address, index) => (
                <div className="flex items-center gap-5" key={index}>
                  <TextField
                    required
                    id="outlined-select-provinces"
                    label="Tỉnh thành"
                    value={address.province ? address.province : ""}
                    defaultValue=""
                    select
                    error={errMsg.address?.province ? true : false}
                    helperText={
                      errMsg.address?.province ? errMsg.address.province[0] : ""
                    }
                    sx={{
                      width: "150px",
                      marginY: "10px",
                    }}
                  >
                    <MenuItem value="">--Chọn tỉnh thành--</MenuItem>
                    {provinces?.map((prov, index) => (
                      <MenuItem
                        key={index}
                        value={prov.code}
                        onClick={() => handleUpdateProv(address.id, prov)}
                      >
                        {prov.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    required
                    id="outlined-select-districts"
                    label="Quận huyện"
                    variant="outlined"
                    value={address.district ? address.district : ""}
                    defaultValue=""
                    select
                    error={errMsg.address?.district ? true : false}
                    helperText={
                      errMsg.address?.district ? errMsg.address.district[0] : ""
                    }
                    sx={{
                      width: "150px",
                      marginY: "10px",
                    }}
                  >
                    <MenuItem value="">--Chọn quận huyện--</MenuItem>
                    {address.distlist?.map((dist, index) => (
                      <MenuItem
                        key={index}
                        value={dist.code}
                        onClick={() => handleUpdateDist(address.id, dist.code)}
                      >
                        {dist.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    required
                    label="Phường xã"
                    variant="outlined"
                    name="ward"
                    value={address.ward ? address.ward : ""}
                    onChange={(e) => handleUpdateAddress(e, address.id)}
                    defaultValue=""
                    select
                    error={errMsg.address?.ward ? true : false}
                    helperText={
                      errMsg.address?.ward ? errMsg.address.ward[0] : ""
                    }
                    sx={{
                      width: "150px",
                      marginY: "10px",
                    }}
                  >
                    <MenuItem value="">--Chọn phường xã--</MenuItem>
                    {address.wardlist?.map((ward, index) => (
                      <MenuItem key={index} value={ward.code}>
                        {ward.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    required
                    id="outlined-basic"
                    label="Số nhà, đường"
                    variant="outlined"
                    name="street"
                    value={address.street ? address.street : ""}
                    onChange={(e) => handleUpdateAddress(e, address.id)}
                    error={errMsg.address?.street ? true : false}
                    helperText={
                      errMsg.address?.street ? errMsg.address.street[0] : ""
                    }
                    sx={{
                      "& .MuiInputBase-input": {
                        // height: "45px",
                        // boxSizing: "border-box",
                      },
                      "& .MuiInputLabel-root": {
                        // lineHeight: "0.95em",
                      },
                      width: "200px",
                      marginY: "10px",
                    }}
                  />

                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <DeleteOutlineIcon sx={{ color: "#3F41A6" }} />
                  </IconButton>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-5">
                <TextField
                  required
                  label="Tỉnh thành"
                  value={addresses[0]?.province ? addresses[0].province : ""}
                  defaultValue=""
                  select
                  error={errMsg.address?.province ? true : false}
                  helperText={
                    errMsg.address?.province ? errMsg.address.province[0] : ""
                  }
                  sx={{
                    width: "150px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">-- Chọn tỉnh thành --</MenuItem>
                  {provinces?.map((prov, index) => (
                    <MenuItem
                      key={index}
                      value={prov.code}
                      onClick={() => handleUpdateProv(addresses[0].id, prov)}
                    >
                      {prov.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  required
                  label="Quận huyện"
                  variant="outlined"
                  value={addresses[0]?.district ? addresses[0].district : ""}
                  defaultValue=""
                  select
                  error={errMsg.address?.district ? true : false}
                  helperText={
                    errMsg.address?.district ? errMsg.address.district[0] : ""
                  }
                  sx={{
                    width: "150px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">--Chọn quận huyện--</MenuItem>
                  {addresses[0].distlist?.map((dist, index) => (
                    <MenuItem
                      key={index}
                      value={dist.code}
                      onClick={() =>
                        handleUpdateDist(addresses[0].id, dist.code)
                      }
                    >
                      {dist.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  required
                  label="Phường xã"
                  variant="outlined"
                  name="ward"
                  value={addresses[0]?.ward ? addresses[0].ward : ""}
                  onChange={(e) => handleUpdateAddress(e, addresses[0].id)}
                  defaultValue=""
                  select
                  error={errMsg.address?.ward ? true : false}
                  helperText={
                    errMsg.address?.ward ? errMsg.address.ward[0] : ""
                  }
                  sx={{
                    width: "150px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">--Chọn phường xã--</MenuItem>
                  {addresses[0].wardlist?.map((ward, index) => (
                    <MenuItem key={index} value={ward.code}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  required
                  id="outlined-basic"
                  label="Số nhà, đường"
                  variant="outlined"
                  name="street"
                  value={addresses[0]?.street ? addresses[0].street : ""}
                  onChange={(e) => handleUpdateAddress(e, addresses[0].id)}
                  error={errMsg.address?.street ? true : false}
                  helperText={
                    errMsg.address?.street ? errMsg.address.street[0] : ""
                  }
                  sx={{
                    width: "200px",
                    marginY: "10px",
                  }}
                />
              </div>
            )}
            <div className="text-zinc-900 text-sm leading-5 mt-4">Mô tả *</div>
            <TextField
              required
              name="description"
              value={studioInfo.description}
              onChange={updateStudioInfo}
              multiline
              rows={3}
              error={errMsg.description ? true : false}
              helperText={errMsg.description ? errMsg.description[0] : ""}
              sx={{
                width: "750px",
              }}
            />
          </div>

          <div className="flex  gap-5 ml-4 my-5 self-start">
            <Button
              variant="outlined"
              onClick={() => {
                setStudioInfo(resetInfo);
                setAddresses([{ id: uuidv4() }]);
                setAvt({});
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
              type="submit"
              sx={{
                textTransform: "none",
                bgcolor: "#3F41A6",
                width: "100px",

                borderRadius: "20px",
                "&:hover": {
                  bgcolor: "#3949AB",
                },
              }}
            >
              Đăng kí
            </Button>
          </div>
        </form>
      </Paper>

      {/* Error 401 */}
      <Err401Dialog open={openErr401} setOpen={setOpenErr401} />
      {/* Other errors */}
      <OtherErrDialog open={openOtherErr} setOpen={setOpenOtherErr} />
    </div>
  );
}

export default Register;
