import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Link,
  Typography,
  Divider,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AdminNavbar from "../../components/AdminNavbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { StyledTextField } from "../../studio/verify/VerifyForm";
import DeniedDialog from "./DeniedDialog";
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

export default function VerifyStudioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [studio, setStudio] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDenied, setOpenDenied] = useState(false);

  useEffect(() => {
    const fetchStudio = async () => {
      await axiosPrivate
        .get(`/studio-document/${id}`)
        .then((response) => {
          setStudio(response.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchStudio();
  }, [loading]);

  const acceptStudio = async () => {
    await axiosPrivate
      .patch(`/studio-document/${id}/`, {
        status: "ACCEPTED",
      })
      .then((response) => {
        navigate(`/admin/verify-studio`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return loading ? (
    <></>
  ) : (
    <div>
      <AdminNavbar />
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
          onClick={() => navigate("/admin", { replace: true })}
        >
          <HomeOutlinedIcon />
        </Link>

        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          onClick={() => navigate("/admin/verify-studio", { replace: true })}
        >
          Quản lý xác thực Studio
        </Link>

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          {studio.studio.code_name}
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
          {studio.studio.code_name}
        </div>
        <Divider />
        <div className="justify-center pl-5 py-3 rounded-lg items-start">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Tên người đại diện pháp lý của Studio
              </div>
              <StyledTextField
                required
                variant="outlined"
                value={studio.studio.code_name}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">Email</div>
              <StyledTextField
                required
                variant="outlined"
                value={studio.email}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Số điện thoại
              </div>
              <StyledTextField
                required
                variant="outlined"
                value={studio.phone}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Số CCCD/CMND
              </div>
              <StyledTextField
                required
                variant="outlined"
                value={studio.license_number}
                disabled
              />
            </Grid>

            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Ngày cấp/Ngày đăng kí
              </div>
              <StyledTextField
                required
                variant="outlined"
                value={studio.license_date}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <div className="text-zinc-900 text-sm leading-5">
                Nơi cấp/Nơi đăng kí
              </div>
              <StyledTextField
                required
                variant="outlined"
                value={studio.license_issue}
                disabled
              />
            </Grid>
            <Grid item xs={6} style={{ marginTop: "10px" }}>
              <div className="text-zinc-900 text-sm leading-5">
                Mặt trước của CMND/CCCD
              </div>
              <img
                src={studio.front_ID_card}
                style={{
                  width: "350px",
                  minHeight: "200px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            </Grid>
            <Grid item xs={6} style={{ marginTop: "10px" }}>
              <div className="text-zinc-900 text-sm leading-5">
                Mặt sau của CMND/CCCD
              </div>
              <img
                src={studio.back_ID_card}
                style={{
                  width: "350px",
                  minHeight: "200px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            </Grid>
          </Grid>
          <div className="text-zinc-900 text-sm leading-5 mt-3">
            Giấy phép kinh doanh/Chứng minh đăng kí doanh nghiệp
          </div>
          
          <Document
            file={studio.license}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>

          <div>
            <p>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Trước
            </button>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Sau
            </button>
          </div>
        
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
            onClick={() => {
              setOpenDenied(true);
            }}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
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
            onClick={acceptStudio}
          >
            Chấp nhận
          </Button>
        </div>
      </Paper>
      <DeniedDialog
        open={openDenied}
        setOpen={setOpenDenied}
        name={studio.studio.code_name}
        id={studio.id}
      />
    </div>
  );
}
