import React from "react";
import {
  Breadcrumbs,
  Link,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AdminNavbar from "../../components/AdminNavbar";
import { translateComplainType } from "../../util/Translate";

function Complains() {
  // global
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [complainData, setComplainData] = React.useState({});
  const [filterVal, setFilterVal] = React.useState({});
  const limit = 10;

  React.useEffect(() => {
    axiosPrivate
      .get(`/complain/?limit=${limit}&offset=${(page - 1) * limit}`)
      .then((res) => {
        setComplainData(res.data);
        setPageCount(Math.ceil(res.data.count / limit));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, filterVal]);

  const handlePageChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  return (
    <div>
      <AdminNavbar />

      {/* Breadcumbs */}
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
        }
        aria-label="breadcrumb"
        sx={{
          marginTop: "20px",
          paddingLeft: "100px",
        }}
      >
        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
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
          Quản lý khiếu nại
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap">
        Quản lý khiếu nại
      </div>

      <div className="flex gap-16 items-center w-fit mx-auto my-4">
        {/* Selector */}
        <TextField
          id="outlined-item-type"
          select
          defaultValue="LATEST"
          sx={{
            width: "150px",
            // height: "50px",
            borderRadius: "10px",
            "& .MuiInputBase-input": {
              boxSizing: "border-box",
              padding: "8px 12px",
            },
          }}
        >
          <MenuItem value="LATEST">Mới nhất</MenuItem>
          <MenuItem value="EARLIER">Cũ nhất</MenuItem>
          <MenuItem value="PENDING">Chờ xử lý</MenuItem>
          <MenuItem value="IN_PROCESS">Đang xử lý</MenuItem>
          <MenuItem value="RESOLVED">Đã giải quyết</MenuItem>
        </TextField>

        <TextField
          id="input-with-icon-textfield"
          sx={{
            "& .MuiInputBase-input": {
              padding: "10px 12px",
              width: "400px",
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
                <IconButton sx={{ padding: 0 }}>
                  <RiSearchLine className="w-5 h-5" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{ margin: "10px auto", maxWidth: "1200px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell sx={{ color: "#3F41A6" }}>MÃ KHIẾU NẠI</TableCell>
              <TableCell sx={{ color: "#3F41A6", width: "250px" }}>
                TIÊU ĐỀ
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "200px" }}>
                KHÁCH HÀNG
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "150px" }}>
                PHÂN LOẠI
              </TableCell>

              <TableCell align="left" sx={{ color: "#3F41A6", width: "300px" }}>
                MÔ TẢ
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                TRẠNG THÁI
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complainData?.results?.length > 0 ? (
              complainData?.results.map((complain, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(`/admin/complain/detail/${complain.id}`)
                  }
                >
                  <TableCell component="th" scope="row">
                    {complain.id}
                  </TableCell>
                  <TableCell align="left">
                    <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow my-auto truncate max-w-[200px]">
                      {complain.title}
                    </div>
                  </TableCell>
                  <TableCell align="left">{complain.user.full_name}</TableCell>
                  <TableCell align="left">
                    <div className="w-fit h-fit text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100  px-2 py-1">
                      {translateComplainType(complain.type)}
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    <div className="truncate max-w-[250px]">
                      {complain.description}
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    {complain.status === "PENDING" ? (
                      <div className="w-[115px] text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 flex justify-center">
                        Chờ xử lý
                      </div>
                    ) : complain.status === "RESOLVED" ? (
                      <div className="w-[115px] text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 flex justify-center">
                        Đã giải quyết
                      </div>
                    ) : complain.status === "IN_PROGRESS" ? (
                      <div className="w-[115px] text-yellow-700 text-sm leading-6 whitespace-nowrap rounded bg-yellow-300 bg-opacity-20 py-1 flex justify-center">
                        Đang xử lý
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No Complain</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={pageCount}
        onChange={handlePageChange}
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
  );
}

export default Complains;
