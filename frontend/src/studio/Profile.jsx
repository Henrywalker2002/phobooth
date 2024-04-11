import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import StudioNavbar from "../components/StudioNavbar";
import { translateErr } from "../util/Translate";
import OtherErrDialog from "../components/OtherErrDialog";
import { VietQR } from "vietqr";
import axios from "axios";

function Profile() {
  // global
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["accInfo"]);
  const axiosPrivate = useAxiosPrivate();
  // Dialog + Snackbar
  const [openSBar, setOpenSbar] = useState(false);
  // local
  const [studioInfo, setStudioInfo] = useState({});
  const [newInfo, setNewInfo] = useState({});
  const [avt, setAvt] = useState({});
  const [errMsg, setErrMsg] = useState({});
  const [openOtherErr, setOpenOtherErr] = useState(false);
  const [bankList, setBankList] = useState([]);

  const clientID = import.meta.env.VITE_VIETQR_CLIENT_ID;
  const apiKey = import.meta.env.VITE_VIETQR_API_KEY;

  let vietQR = new VietQR({
    clientID: clientID,
    apiKey: apiKey,
  });
  // get detail studio info
  useEffect(() => {
    // console.log(cookies);
    axiosPrivate
      .get(`/studio/${cookies.userInfo.studio.code_name}/`)
      .then((res) => {
        // console.log(res.data);
        setStudioInfo(res.data);
        setNewInfo(res.data);
      })
      .catch((err) => console.log(err));

    vietQR
      .getBanks()
      .then((res) => {
        setBankList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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
  const updateStudioInfo = (e) => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  // Update all info -> patch
  const handleUpdateStudio = (e) => {
    e.preventDefault();
    // console.log(newInfo);

    let formData = new FormData();
    if (avt.avt_file) {
      formData.append("avatar", avt.avt_file, avt.avt_file.name);
    }
    if (Object.keys(newInfo).length > 0) {
      formData.append("data", JSON.stringify(newInfo));
    }
    axiosPrivate
      .patch(`studio/${cookies.userInfo.studio.code_name}/`, formData, {
        headers: {
          ...axiosPrivate.defaults.headers,
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setNewInfo({});
        setErrMsg({});
        setStudioInfo(res.data);
        setCookie(
          "userInfo",
          {
            ...cookies.userInfo,
            studio: res.data,
          },
          { path: "/" }
        );
        // console.log(cookies);
      })
      .then(() => setOpenSbar(true))
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 400) {
          let newErr = translateErr(err.response.data);
          setErrMsg(newErr);
        } else {
          setOpenOtherErr(true);
        }
      });
  };

  const handleCheckAccount = (e) => {
    e.preventDefault();
    if (
      newInfo.account_number &&
      (newInfo.account_number.length < 6 || newInfo.account_number.length > 19)
    ) {
      setErrMsg({ ...errMsg, account_name: "Tên chủ tài khoản không hợp lệ" });
      return;
    }
    if (
      newInfo.account_bin === "" &&
      newInfo.account_bin === null &&
      studioInfo.bank_bin === "" &&
      studioInfo.bank_bin === null
    ) {
      setErrMsg({ ...errMsg, account_bin: "Chưa chọn ngân hàng" });
      return;
    }
    var data = {
      bin: newInfo.bank_bin || studioInfo.bank_bin,
      accountNumber: newInfo.account_number || studioInfo.account_number,
    };
    console.log(data);
    axios
      .post("https://api.vietqr.io/v2/lookup", (data = data), {
        headers: {
          "x-client-id": clientID,
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.code === "42") {
          setNewInfo({ ...newInfo, account_name: "" });
          setErrMsg({ ...errMsg, account_name: "Tài khoản không tồn tại" });
          return;
        } else {
          setNewInfo({
            ...newInfo,
            account_name: res.data.data.accountName,
          });
          setErrMsg({ ...errMsg, account_name: "" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Close Snackbar
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSbar(false);
  };
  return (
    <div>
      <StudioNavbar />

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
          onClick={() => navigate("/studio", { replace: true })}
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
          Thông tin Studio
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
          Thông tin Studio
        </div>
        <Divider />
        <form onSubmit={handleUpdateStudio}>
          <div className="self-stretch flex items-stretch  gap-[150px] mt-5">
            <div className="flex basis-[0%] flex-col items-stretch ml-4">
              <div className="text-zinc-900 text-sm leading-5">
                Tên Studio *
              </div>
              <TextField
                required
                variant="outlined"
                name="friendly_name"
                value={newInfo.friendly_name ?? studioInfo.friendly_name ?? ""}
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
                disabled
                variant="outlined"
                name="code_name"
                value={studioInfo.code_name ?? ""}
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
                value={newInfo.email ?? studioInfo.email ?? ""}
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
                value={newInfo.phone ?? studioInfo.phone ?? ""}
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

            <div className="flex  flex-col items-center mt-9 self-start">
              <Avatar
                alt="studio-logo"
                src={
                  avt.avt_preview
                    ? avt.avt_preview
                    : studioInfo.avatar
                    ? studioInfo.avatar
                    : "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                }
                sx={{ width: 140, height: 140 }}
              />

              <Alert
                sx={{ bgcolor: "background.paper", border: "none" }}
                variant="outlined"
                severity={studioInfo?.is_verified ? "success" : "error"}
              >
                {studioInfo?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
              </Alert>

              <Button
                component="label"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  border: "2px solid #3F41A6",
                  color: "#3F41A6",
                  width: "140px",
                  // marginTop: "10px",
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

          <div className="flex flex-col ml-4">
            <div className="text-zinc-900 text-sm leading-5 mt-4 flex items-center gap-1">
              Địa chỉ Studio *
            </div>
            <TextField
              disabled
              name="address"
              value={studioInfo.address ?? ""}
              sx={{
                "& .MuiInputBase-input": {
                  height: "45px",
                  boxSizing: "border-box",
                },
                width: "750px",
                marginY: "10px",
              }}
            />

            <div className="text-zinc-900 text-sm leading-5 mt-4">Mô tả *</div>
            <TextField
              required
              name="description"
              value={newInfo.description ?? studioInfo.description ?? ""}
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

          <div className="flex flex-col ml-4 mr-10">
            <div className="flex justify-between w-full">
              <div className="flex flex-col">
                <div className="text-zinc-900 text-sm leading-5 mt-4 ">
                  Số tài khoản
                </div>
                <TextField
                  variant="outlined"
                  name="account_number"
                  value={
                    newInfo.account_number ?? studioInfo.account_number ?? ""
                  }
                  onChange={updateStudioInfo}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "45px",
                      boxSizing: "border-box",
                    },
                    width: "350px",
                    marginY: "10px",
                  }}
                />

                <Button
                  variant="outlined"
                  onClick={handleCheckAccount}
                  sx={{
                    textTransform: "none",
                    border: "1px solid #3F41A6",
                    color: "#3F41A6",
                    width: "fit-content",
                    padding: "5px 15px",
                    "&:hover": {
                      border: "1px solid #3949AB",
                    },
                  }}
                >
                  Kiểm tra
                </Button>
              </div>

              <div className="flex flex-col">
                <div className="text-zinc-900 text-sm leading-5 mt-4 ">
                  Chọn ngân hàng
                </div>
                <TextField
                  select
                  variant="outlined"
                  name="bank_bin"
                  onChange={updateStudioInfo}
                  value={newInfo.bank_bin ?? studioInfo.bank_bin ?? ""}
                  error={errMsg.account_bin ? true : false}
                  helperText={errMsg.account_bin ?? ""}
                  sx={{
                    "& .MuiInputBase-input": {
                      width: "350px",
                      height: "45px",
                      boxSizing: "border-box",
                      paddingY: "13px",
                    },
                    marginY: "10px",
                  }}
                >
                  {bankList.map((bank) => {
                    return (
                      <MenuItem key={bank.bin} value={bank.bin}>
                        {bank.name + " - " + bank.code}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </div>
            </div>

            <div className="text-zinc-900 text-sm leading-5 mt-4 ">
              Tên chủ tài khoản
            </div>
            <TextField
              variant="outlined"
              name="account_name"
              disabled
              value={newInfo.account_name ?? ""}
              error={errMsg.account_name ? true : false}
              helperText={errMsg.account_name ?? ""}
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
            {studioInfo.is_verified ? null : (
              <Button
                variant="outlined"
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
                onClick={() =>
                  navigate("/studio/profile/verify", { state: { studioInfo } })
                }
              >
                Xác thực Studio
              </Button>
            )}

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
              disabled={
                (newInfo.account_name === "" ||
                  newInfo.account_name === null) &&
                newInfo.account_number
                  ? true
                  : false
              }
            >
              Lưu thông tin
            </Button>
          </div>
        </form>
      </Paper>

      {/* Update profile successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
        message="Cập nhật thông tin thành công"
      />

      {/* Other errors */}
      <OtherErrDialog open={openOtherErr} setOpen={setOpenOtherErr} />
    </div>
  );
}

export default Profile;
