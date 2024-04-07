import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Paper,
  Snackbar,
  Typography,
  Grid,
} from "@mui/material";
import StudioNavbar from "../../components/StudioNavbar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { translateErr } from "../../util/Translate";
import OtherErrDialog from "../../components/OtherErrDialog";
import VerifyForm from "./VerifyForm";
import VerifyUploadImage from "./VerifyUploadImage";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SucessNoti from "./SucessNoti";

export default function VerifyStudio() {
  let { state } = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [payload, setPayload] = useState({
    friendly_name: "",
    phone: state.studioInfo.phone,
    email: state.studioInfo.email,
    license_date: "",
    license_number: null,
    license_issue: "",
  });
  const [frontIdCard, setFontIdCard] = useState({});
  const [backIdCard, setBackIdCard] = useState({});
  const [license, setLicense] = useState({});
  //Snackbar displays
  const [openSBar, setOpenSbar] = useState(false);
  const [openOtherErr, setOpenOtherErr] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const handleChangePayload = (name) => (event) => {
    setPayload({ ...payload, [name]: event.target.value });
    console.log(payload);
  };

  const handleSubmitVerify = (e) => {
    e.preventDefault();
    console.log(payload);
    let formData = new FormData();
    formData.append(
      "front_ID_card",
      frontIdCard.avt_file,
      frontIdCard.avt_file.name
    );
    formData.append(
      "back_ID_card",
      backIdCard.avt_file,
      backIdCard.avt_file.name
    );
    formData.append("license", license, license.name);
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axiosPrivate
      .post(`studio-document/`, formData, {
        headers: {
          ...axiosPrivate.defaults.headers,
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        setOpenSbar(true);
        setPayload({});
        setErrorMsg({});
        setOpenSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 400) {
          let newErr = translateErr(err.response.data);
          setErrorMsg(newErr);
        } else {
          setOpenOtherErr(true);
        }
      });
  };
  useEffect(() => {});

  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSbar(false);
  };

  return state.studioInfo.is_verified ? (
    <></>
  ) : (
    <div>
      <StudioNavbar />
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

        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/studio/profile", { replace: true })}
        >
          Thông tin Studio
        </Link>

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Xác thực Studio
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
          Xác thực Studio
        </div>
        <Divider />
        <div className="justify-center pl-5 py-3 rounded-lg items-start">
          <VerifyForm
            payload={payload}
            setPayload={setPayload}
            handleChangePayload={handleChangePayload}
            errorMsg={errorMsg}
          />

          <Grid container spacing={2} style={{ marginTop: "10px" }}>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Mặt trước của CMND/CCCD *
              </div>
              <VerifyUploadImage image={frontIdCard} setImage={setFontIdCard} />
            </Grid>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Mặt sau của CMND/CCCD *
              </div>
              <VerifyUploadImage image={backIdCard} setImage={setBackIdCard} />
            </Grid>
          </Grid>
          <div className="text-zinc-900 text-sm leading-5 mt-3">
            Giấy phép kinh doanh/Chứng minh đăng kí doanh nghiệp *
          </div>
          <Button
            component="label"
            variant="outlined"
            endIcon={<FileUploadOutlinedIcon />}
            sx={{
              textTransform: "none",
              border: "2px solid #3F41A6",
              color: "#3F41A6",
              width: "fit-content",
              padding: "5px 15px",
              marginTop: "10px",
              "&:hover": {
                border: "2px solid #3949AB",
              },
            }}
          >
            Tải tệp lên
            <input
              type="file"
              accept=".pdf"
              onChange={(event) => {
                const file = event.target.files[0];
                setLicense(file);
                console.log(file);
              }}
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
          {license && <p>{license.name}</p>}
        </div>
        <div className="flex  gap-5 ml-4 my-5 self-start">
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
            onClick={() => navigate("/studio/profile", { replace: true })}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitVerify}
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
            Xác thực
          </Button>
        </div>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
        message="Cập nhật thông tin thành công"
      />
      {/* Other errors */}
      <OtherErrDialog open={openOtherErr} setOpen={setOpenOtherErr} />

      {/* Success for Verify */}
      <SucessNoti open={openSuccess} setOpen={setOpenSuccess} />
    </div>
  );
}
