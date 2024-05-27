import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Avatar,
  Breadcrumbs,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  OutlinedInput,
  Paper,
  Snackbar,
  TextField,
  Typography,
  FormHelperText,
  Tooltip,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import dayjs from "dayjs";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { translateErrUserInfo } from "../util/Translate";
import OtherErrDialog from "../components/OtherErrDialog";

function Profile() {
  const [cookies, setCookie] = useCookies(["accInfo"]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [openSBar, setOpenSbar] = useState(false);
  const [addresses, setAddresses] = useState([{ id: uuidv4() }]);
  const [provinces, setProvinces] = useState([]);
  const [newInfo, setNewInfo] = useState({});
  const [avt, setAvt] = useState({});
  // error
  const [errMsg, setErrMsg] = useState({});
  const [openOtherErr, setOpenOtherErr] = useState(false);

  // get province list
  useEffect(() => {
    // console.log(cookies);
    axios
      .get("province/?limit=63&offset=0")
      .then((res) => {
        // console.log(res);
        setProvinces(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  // setup address
  const setUpInitialAddress = () => {
    if (cookies.accInfo.address !== null) {
      let distlist = [];
      let wardlist = [];
      axios
        .get(`province/${cookies.accInfo.address.province.code_name}/`)
        .then((res) => {
          // console.log(res);
          distlist = res.data.districts;
          return distlist;
        })
        .then((distlist) => {
          wardlist = distlist?.find(
            (dist) => dist.code === cookies.accInfo.address.district.code
          )?.wards;
        })
        .then(() => {
          setAddresses([
            {
              id: cookies.accInfo.address.id,
              street: cookies.accInfo.address.street,
              ward: cookies.accInfo.address.ward.code,
              district: cookies.accInfo.address.district.code,
              province: cookies.accInfo.address.province.code,
              distlist: distlist,
              wardlist: wardlist,
            },
          ]);
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    setUpInitialAddress();
  }, []);

  // address
  const handleAddAddress = () => {
    const newList = [...addresses, { id: uuidv4() }];
    setAddresses(newList);
  };

  const handleUpdateProv = async (id, prov) => {
    try {
      const res = await axios.get(`province/${prov.code_name}/`);
      // console.log(res);
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
    // console.log(newList);
    setAddresses(newList);
  };

  const handleDeleteAddress = (id) => {
    const newList = addresses.filter((address) => address.id !== id);
    setAddresses(newList);
  };

  // update avt
  const handleUpdateAvt = (e) => {
    if (e.target.files.length > 0) {
      setAvt({
        avt_preview: URL.createObjectURL(e.target.files[0]),
        avt_file: e.target.files[0],
      });
    }
  };

  // update basic info
  const updateUserInfo = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  // Update all info -> patch
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // console.log(newInfo);
    let formData = new FormData();
    Object.entries(newInfo).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (avt.avt_file) {
      formData.append("avatar", avt.avt_file, avt.avt_file.name);
    }

    if (
      addresses.length > 0 &&
      addresses[0].province &&
      addresses[0].district &&
      addresses[0].ward &&
      addresses[0].street
    ) {
      // console.log(addresses);
      let addressInfo = {
        province: addresses[0].province,
        district: addresses[0].district,
        ward: addresses[0].ward,
        street: addresses[0].street,
      };
      formData.append("address", JSON.stringify(addressInfo));
    }

    axiosPrivate
      .patch(`/user/${cookies.accInfo.id}/`, formData, {
        headers: {
          ...axiosPrivate.defaults.headers,
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setCookie(
          "accInfo",
          {
            access: cookies.accInfo.access,
            refresh: cookies.accInfo.refresh,
            ...res.data,
          },
          { path: "/" }
        );

        setNewInfo({});
        setErrMsg({});
      })
      .then(() => setOpenSbar(true))
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 400) {
          let newErr = translateErrUserInfo(err.response.data);
          setErrMsg(newErr);
        } else {
          setOpenOtherErr(true);
        }
      });
  };

  // Close Snackbar
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSbar(false);
  };

  // pwd behavior
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
          marginTop: "30px",
          paddingLeft: "120px",
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

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Thông tin cá nhân
        </Typography>
      </Breadcrumbs>

      <Paper
        sx={{
          width: "65%",
          margin: "10px auto",
          border: "1px solid #d6d3d1",
        }}
      >
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap shadow-sm w-full justify-center pl-5 py-3 rounded-lg items-start">
          Thông tin cá nhân
        </div>
        <Divider />
        <form onSubmit={handleUpdateProfile}>
          <div className="self-stretch flex items-stretch  justify-between mt-5">
            <div className="flex w-1/2 flex-col items-stretch ml-4">
              <div className="text-zinc-900 text-sm leading-5">Họ và tên *</div>
              <TextField
                required
                variant="outlined"
                name="full_name"
                value={newInfo.full_name ?? cookies.accInfo.full_name ?? ""}
                // defaultValue={cookies.accInfo.full_name}
                onChange={updateUserInfo}
                error={errMsg.full_name ? true : false}
                helperText={errMsg.full_name ? errMsg.full_name[0] : ""}
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
                name="username"
                value={newInfo.username ?? cookies.accInfo.username ?? ""}
                // defaultValue={cookies.accInfo.username}
                onChange={updateUserInfo}
                error={errMsg.username ? true : false}
                helperText={errMsg.username ? errMsg.username[0] : ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "45px",
                    boxSizing: "border-box",
                  },
                  width: "350px",
                  marginY: "10px",
                }}
              />

              <div className="text-zinc-900 text-sm leading-5">Mật khẩu *</div>
              <FormControl variant="standard">
                <OutlinedInput
                  required
                  name="password"
                  onChange={updateUserInfo}
                  value={newInfo.password ?? cookies.accInfo.password ?? ""}
                  // defaultValue={cookies.accInfo.password}
                  error={errMsg.password ? true : false}
                  sx={{ width: "350px", height: "45px", marginY: "10px" }}
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="component-helper-text">
                  {errMsg.password ? errMsg.password[0] : ""}
                </FormHelperText>
              </FormControl>

              <div className="text-zinc-900 text-sm leading-5 mt-4">
                Ngày sinh
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="date_of_birth"
                  name="date_of_birth"
                  sx={{
                    width: "350px",
                    marginY: "10px",
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                  }}
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    if (value)
                      setNewInfo({
                        ...newInfo,
                        date_of_birth: value.format("YYYY-MM-DD"),
                      });
                  }}
                  value={
                    newInfo?.date_of_birth
                      ? dayjs(newInfo?.date_of_birth)
                      : dayjs(cookies?.accInfo.date_of_birth)
                  }
                  slotProps={{
                    textField: {
                      helperText: `${
                        errMsg.date_of_birth ? errMsg.date_of_birth[0] : ""
                      }`,
                      error: errMsg.date_of_birth ? true : false,
                    },
                  }}
                  // defaultValue={dayjs(cookies?.accInfo.date_of_birth) ?? null}
                />
              </LocalizationProvider>

              <div className="text-zinc-900 text-sm leading-5 mt-4">
                Email *
              </div>
              <Tooltip title="Bạn không thể thay đổi email đã đăng kí.">
                <span>
                  <TextField
                    disabled
                    required
                    variant="outlined"
                    name="email"
                    value={newInfo.email ?? cookies.accInfo.email ?? ""}
                    // defaultValue={cookies.accInfo.email}

                    InputProps={{
                      type: "email",
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "45px",
                        boxSizing: "border-box",
                      },
                      width: "350px",
                      marginY: "10px",
                    }}
                  />
                </span>
              </Tooltip>

              <div className="text-zinc-900 text-sm leading-5 mt-4 ">
                Số điện thoại
              </div>
              <TextField
                variant="outlined"
                name="phone"
                onChange={updateUserInfo}
                value={newInfo.phone ?? cookies.accInfo.phone ?? ""}
                // defaultValue={cookies.accInfo.phone}
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

            <div className="w-1/2">
              <div className="flex flex-col justify-center items-center w-full h-1/2">
                <Avatar
                  alt="user-logo"
                  src={
                    avt.avt_preview
                      ? avt.avt_preview
                      : cookies.accInfo.avatar
                      ? cookies.accInfo.avatar
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateAvt}
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
              </div>
            </div>
          </div>

          <div className="flex flex-col ml-4">
            <div className="text-zinc-900 text-sm leading-5 mt-4 mb-2 flex items-center gap-1">
              Địa chỉ
              {/* <IconButton onClick={handleAddAddress}>
                <AddCircleOutlineIcon sx={{ width: "20px", height: "20px" }} />
              </IconButton> */}
            </div>
            {addresses.length > 1 ? (
              addresses.map((address, index) => (
                <div className="flex items-center gap-6" key={index}>
                  <TextField
                    id="outlined-select-provinces"
                    label="Tỉnh thành"
                    value={address.province ? address.province : ""}
                    // defaultValue=""
                    select
                    error={errMsg.address?.province ? true : false}
                    helperText={
                      errMsg.address?.province ? errMsg.address.province[0] : ""
                    }
                    name="province"
                    sx={{
                      width: "200px",
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
                    id="outlined-select-districts"
                    label="Quận huyện"
                    name="district"
                    variant="outlined"
                    value={
                      address?.distlist?.find(
                        (dist) => dist.code == address.district
                      )
                        ? address.district
                        : ""
                    }
                    // defaultValue=""
                    select
                    error={errMsg.address?.district ? true : false}
                    helperText={
                      errMsg.address?.district ? errMsg.address.district[0] : ""
                    }
                    sx={{
                      width: "200px",
                      marginY: "10px",
                    }}
                  >
                    <MenuItem value="">--Chọn quận huyện--</MenuItem>
                    {address?.distlist?.map((dist, index) => (
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
                    label="Phường xã"
                    variant="outlined"
                    name="ward"
                    value={
                      address?.wardlist?.find(
                        (ward) => ward.code == address.ward
                      )
                        ? address.ward
                        : ""
                    }
                    onChange={(e) => handleUpdateAddress(e, address.id)}
                    // defaultValue=""
                    select
                    error={errMsg.address?.ward ? true : false}
                    helperText={
                      errMsg.address?.ward ? errMsg.address.ward[0] : ""
                    }
                    sx={{
                      width: "200px",
                      marginY: "10px",
                    }}
                  >
                    <MenuItem value="">--Chọn phường xã--</MenuItem>
                    {address?.wardlist?.map((ward, index) => (
                      <MenuItem key={index} value={ward.code}>
                        {ward.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
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
                      width: "250px",
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
              <div className="flex items-center gap-6">
                <TextField
                  label="Tỉnh thành"
                  value={addresses[0]?.province ? addresses[0].province : ""}
                  // defaultValue=""
                  select
                  error={errMsg.address?.province ? true : false}
                  helperText={
                    errMsg.address?.province ? errMsg.address.province[0] : ""
                  }
                  sx={{
                    width: "200px",
                    marginY: "10px",
                  }}
                  name="province"
                >
                  <MenuItem value="">-- Chọn tỉnh thành --</MenuItem>
                  {provinces?.map((prov, index) => (
                    <MenuItem
                      key={index}
                      value={prov.code}
                      onClick={() => handleUpdateProv(addresses[0]?.id, prov)}
                    >
                      {prov.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Quận huyện"
                  variant="outlined"
                  name="district"
                  value={
                    addresses[0]?.distlist?.find(
                      (dist) => dist.code == addresses[0].district
                    )
                      ? addresses[0].district
                      : ""
                  }
                  // defaultValue=""
                  select
                  error={errMsg.address?.district ? true : false}
                  helperText={
                    errMsg.address?.district ? errMsg.address.district[0] : ""
                  }
                  sx={{
                    width: "200px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">--Chọn quận huyện--</MenuItem>
                  {addresses[0]?.distlist?.map((dist, index) => (
                    <MenuItem
                      key={index}
                      value={dist.code}
                      onClick={() =>
                        handleUpdateDist(addresses[0]?.id, dist.code)
                      }
                    >
                      {dist.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Phường xã"
                  variant="outlined"
                  name="ward"
                  value={
                    addresses[0]?.wardlist?.find(
                      (ward) => ward.code == addresses[0].ward
                    )
                      ? addresses[0].ward
                      : ""
                  }
                  onChange={(e) => handleUpdateAddress(e, addresses[0].id)}
                  // defaultValue=""
                  select
                  error={errMsg.address?.ward ? true : false}
                  helperText={
                    errMsg.address?.ward ? errMsg.address.ward[0] : ""
                  }
                  sx={{
                    width: "200px",
                    marginY: "10px",
                  }}
                >
                  <MenuItem value="">--Chọn phường xã--</MenuItem>
                  {addresses[0]?.wardlist?.map((ward, index) => (
                    <MenuItem key={index} value={ward.code}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
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
                    width: "250px",
                    marginY: "10px",
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col ml-4 mr-10">
            <div className="flex justify-between w-full">
              <div className="flex flex-col">
                <div className="text-zinc-900 text-sm leading-5 mt-4 ">
                  Số tài khoản
                </div>
                <TextField
                  variant="outlined"
                  name="acc_number"
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

              <div className="flex flex-col">
                <div className="text-zinc-900 text-sm leading-5 mt-4 ">
                  Chọn ngân hàng
                </div>
                <TextField
                  variant="outlined"
                  name="bank"
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

            <div className="text-zinc-900 text-sm leading-5 mt-4 ">
              Tên chủ tài khoản
            </div>
            <TextField
              variant="outlined"
              name="acc_name"
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

          <div className="flex  gap-5 ml-4 my-5 self-start">
            <Button
              variant="outlined"
              onClick={() => {
                setNewInfo({});
                setUpInitialAddress();
                setAvt({});
              }}
              sx={{
                textTransform: "none",
                border: "1px solid #3F41A6",
                color: "#3F41A6",
                width: "fit-content",
                padding: "5px 20px",

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
                width: "fit-content",
                padding: "5px 20px",
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
      </Paper>

      {/* Other errors */}
      <OtherErrDialog open={openOtherErr} setOpen={setOpenOtherErr} />

      {/* Update profile successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
      >
        <Alert
          onClose={handleCloseSBar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Cập nhật thông tin thành công
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Profile;
