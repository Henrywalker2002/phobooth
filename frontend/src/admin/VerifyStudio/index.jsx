import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AdminNavbar from "../../components/AdminNavbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { RiSearchLine } from "react-icons/ri";
import dayjs from "dayjs";

export default function VerifyStudioList() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("Mới nhất");
  const [verifyList, setVerifyList] = useState([]);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchVerifyList = async () => {
      await axiosPrivate
        .get(`/studio-document/?offset=${offset - 1}&limit=10`)
        .then((response) => {
          setPageCount(Math.ceil(response.data.count / 10));
          setVerifyList(response.data.results);
          console.log(verifyList);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchVerifyList();
  }, [loading, offset]);

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

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Quản lý xác thực Studio
        </Typography>
      </Breadcrumbs>
      <div
        style={{
          margin: "30px 10% 0 10%",
          padding: "10px",
          width: "80%",
        }}
      >
        <Typography
          sx={{
            fontSize: "24px",
            lineHeight: "36px",
            color: "rgba(63, 65, 166, 1)",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Quản lý xác thực Studio
        </Typography>

        <div className="flex gap-5 items-center w-fit mx-auto my-5">
          <TextField
            id="outlined-item-type"
            select
            value={orderBy}
            onChange={(event) => {
              setOrderBy(event.target.value);
            }}
            sx={{
              width: "fit-content",
              // height: "50px",
              borderRadius: "10px",
              "& .MuiInputBase-input": {
                boxSizing: "border-box",
                padding: "8px 12px",
              },
            }}
          >
            <MenuItem value={"Mới nhất"}>Mới nhất</MenuItem>
            <MenuItem value={"Cũ nhất"}>Cũ nhất</MenuItem>
            <MenuItem value={"Chưa xác thực"}>Chưa xác thực</MenuItem>
            <MenuItem value={"Đã xác thực"}>Đã xác thực</MenuItem>
          </TextField>

          <TextField
            id="input-with-icon-textfield"
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px 12px",
                width: "330px",
                height: "40px",
                boxSizing: "border-box",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <RiSearchLine className="w-5 h-5" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Tìm kiếm"
            variant="outlined"
          />
        </div>

        <TableContainer
          component={Paper}
          sx={{ width: "fit-content", margin: "20px auto" }}
        >
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#E2E5FF" }}>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ color: "#3F41A6", width: "200px" }}
                >
                  STUDIO
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "#3F41A6", width: "200px" }}
                >
                  NGÀY GỬI XÁC THỰC
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "#3F41A6", width: "180px" }}
                >
                  SỐ LẦN XÁC THỰC
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "#3F41A6", width: "200px" }}
                >
                  TÌNH TRẠNG XỬ LÝ
                </TableCell>
              </TableRow>
            </TableHead>
            {verifyList.length > 0
              ? verifyList.map((item, index) => (
                  <TableBody key={index}>
                    <TableRow
                      onClick={() => {
                        if (item.status === "PENDING") {
                          navigate(`/admin/verify-studio/${item.id}`);
                        }
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left">
                        {item.studio.code_name}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(item.create_at).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{item.number_attempts}</TableCell>

                      <TableCell align="left">
                        {item.status === "ACCEPTED" ? (
                          <div className="w-[115px] text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 flex justify-center">
                            Đã chấp nhận
                          </div>
                        ) : item.status === "REJECTED" ? (
                          <div className="w-[115px] text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 flex justify-center">
                            Đã từ chối
                          </div>
                        ) : (
                          <div className="w-[115px] text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 flex justify-center">
                            Đang xử lý
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              : null}
          </Table>
        </TableContainer>
        <Pagination
          count={pageCount}
          onChange={(e, value) => {
            setOffset(value);
          }}
          sx={{
            margin: "0 auto",
            width: "fit-content",
            "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
              {
                bgcolor: "#E2E5FF",
              },
          }}
        />
      </div>
    </div>
  );
}
