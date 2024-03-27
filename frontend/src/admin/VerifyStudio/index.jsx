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
  Select,
  MenuItem,
  FormControl,
  Alert,
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

  useEffect(() => {
    const fetchVerifyList = async () => {
      await axiosPrivate
        .get(`/studio-document?offset=${offset - 1}&limit=10`)
        .then((response) => {
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
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={orderBy}
              onChange={(event) => {
                setOrderBy(event.target.value);
              }}
            >
              <MenuItem value={"Mới nhất"}>Mới nhất</MenuItem>
              <MenuItem value={"Cũ nhất"}>Cũ nhất</MenuItem>
              <MenuItem value={"Chưa xác thực"}>Chưa xác thực</MenuItem>
              <MenuItem value={"Đã xác thực"}>Đã xác thực</MenuItem>
            </Select>
          </FormControl>

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
          sx={{ width: "900px", margin: "20px auto" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#E2E5FF" }}>
              <TableRow>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Studio
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Ngày gửi xác thực
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Số lần xác thực
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Tình trạng xử lý
                </TableCell>
                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  Tình trạng xử lý
                </TableCell>
              </TableRow>
            </TableHead>
            {verifyList.length > 0
              ? verifyList.map((item, index) => (
                  <TableBody key={index}>
                    <TableRow>
                      <TableCell align="left">
                        {item.status === "PENDING" ? (
                          <Link
                            onClick={() => {
                              navigate(`/admin/verify-studio/${item.id}`);
                            }}
                          >
                            {item.studio.code_name}
                          </Link>
                        ) : (
                          <p style={{color: "#3F41A6"}}>{item.studio.code_name}</p>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(item.create_at).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="left">{item.number_attempts}</TableCell>
                      <TableCell align="left">
                        {item.status === "ACCEPTED" ? (
                          <Alert icon={false} severity="success">
                            Đã xác thực
                          </Alert>
                        ) : (
                          <Alert icon={false} severity="error">
                            Chưa xác thực
                          </Alert>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {item.status === "ACCEPTED" ? (
                          <p style={{ color: "green" }}> Đã chấp nhận</p>
                        ) : item.status === "REJECTED" ? (
                          <p style={{ color: "red" }}>Đã từ chối</p>
                        ) : (
                          <p style={{ color: "gray" }}> Đang xử lý</p>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              : null}
          </Table>
        </TableContainer>
        <Pagination
          count={10}
          onChange={(e, value) => {
            setOffset(value);
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
}
