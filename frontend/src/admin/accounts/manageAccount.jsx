import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogContentText,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import AddEmploy from "./AddEmploy";
import EditEmploy from "./EditEmploy";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import StaffFilter from "./filter";
import { RiSearchLine } from "react-icons/ri";
import { translateRole } from "../../util/Translate";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminManageAccount() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [items, setItems] = useState([]);
  const [order_item, set_order_item] = useState([]);
  const [clickItem, setClickItem] = useState({});
  const [count, setCount] = useState(0);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterVal, setFilterVal] = React.useState({});

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (item) => {
    setClickItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // Xử lý logic xóa ở đây
    // axiosPrivate
    //   .delete(`/staff/${clickItem.username}/`)
    //   .then((res) => {
    //     setItems(items.filter((item) => item.username !== clickItem.username));
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 400) {
    //       console.log(err);
    //     } else if (err.response.status === 404) {
    //       setItems(
    //         items.filter((item) => item.username !== clickItem.username)
    //       );
    //       handleClose();
    //     }
    //   });
    axiosPrivate
      .patch(`/staff/${clickItem.username}/`, {
        is_active: !clickItem.is_active,
      })
      .then((res) => {
        setItems(
          items.map((item) => {
            if (item.username === clickItem.username) {
              return { ...item, is_active: !item.is_active };
            }
            return item;
          })
        );
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });

    setOpen(false);
  };
  const [openAdd, setOpenAdd] = React.useState(false);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickEdit = (item) => {
    setOpenEdit(true);
    setClickItem(item);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(() => {
    axiosPrivate
      .get(`/staff/?limit=10&offset=${(page - 1) * 10}`, { params: filterVal })
      .then((res) => {
        let initialOrderList = res.data.results.map((lst) => {
          return { ...lst, items: [] };
        });
        setCount(res.data.count);
        setItems(res.data.results);
        set_order_item(initialOrderList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, filterVal]);

  function handleDate(date) {
    let newDate = new Date(date);
    return `${newDate.getDate()}-${
      newDate.getMonth() + 1
    }-${newDate.getFullYear()}`;
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setFilterVal({ ...filterVal, search: event.target.value });
      event.target.value = "";
    }
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
          Quản lý tài khoản
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap mt-2">
        Quản lý tài khoản
      </div>

      <div className="flex gap-5 items-center w-fit mx-auto my-5">
        <TextField
          id="input-with-icon-textfield"
          placeholder="Tìm kiếm"
          onKeyDown={handleSearch}
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

        <Button
          variant="contained"
          onClick={handleClickOpenAdd}
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "7px 20px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
        >
          Thêm nhân viên
        </Button>

        {/* filter */}
        <Button
          variant="text"
          endIcon={<TuneOutlinedIcon />}
          onClick={() => {
            setOpenFilter(true);
          }}
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            "&:hover": {
              bgcolor: "#E2E5FF",
            },
          }}
        >
          Bộ lọc
        </Button>
      </div>

      {/* Acc Table */}
      <TableContainer
        component={Paper}
        sx={{ margin: "20px auto", maxWidth: "1000px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#E2E5FF" }}>
            <TableRow>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                HỌ VÀ TÊN
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                TÊN NGƯỜI DÙNG
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "170px" }}>
                CHỨC VỤ
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6" }}>
                NGÀY THAM GIA
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "170px" }}>
                TRẠNG THÁI
              </TableCell>
              <TableCell align="left" sx={{ color: "#3F41A6", width: "125px" }}>
                HÀNH ĐỘNG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, i) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.full_name}
                    </TableCell>
                    <TableCell align="left">
                      <div className="text-zinc-900 text-[14px] font-medium leading-6 self-center grow my-auto truncate max-w-[200px]">
                        {item.username}
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      <div className="w-fit h-fit text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center rounded bg-indigo-100 px-2 py-1">
                        {translateRole(item.role)}
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      {handleDate(item.created_at)}
                    </TableCell>
                    <TableCell align="left">
                      {item.is_active ? (
                        <div className="w-fit text-green-600 text-sm leading-6 whitespace-nowrap rounded bg-green-600 bg-opacity-20 py-1 px-2 flex justify-center">
                          Hoạt động
                        </div>
                      ) : (
                        <div className="w-fit text-red-500 text-sm leading-6 whitespace-nowrap rounded bg-red-500 bg-opacity-20 py-1 px-2 flex justify-center">
                          Không hoạt động
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      <div className="flex">
                        <IconButton
                          onClick={() => {
                            handleClickEdit(item);
                          }}
                        >
                          <ModeEditIcon style={{ color: "#666666" }} />
                        </IconButton>
                        <IconButton onClick={() => handleClickOpen(item)}>
                          {item.is_active ? (
                            <LockOutlinedIcon style={{ color: "#666666" }} />
                          ) : (
                            <LockOpenOutlinedIcon
                              style={{ color: "#666666" }}
                            />
                          )}
                          {/* <DeleteOutlineIcon style={{ color: "#666666" }} /> */}
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>Chưa có tài khoản nào</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination For Staff */}
      <Pagination
        count={Math.ceil(count / 10)}
        onChange={handlePageChange}
        sx={{
          margin: "0 auto",
          marginBottom: "20px",
          width: "fit-content",
          "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
            {
              bgcolor: "#E2E5FF",
            },
        }}
      />

      {/* Xóa */}
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "800px",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Xác nhận {clickItem.is_active ? "khóa" : "mở khóa"}
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn {clickItem.is_active ? "khoá" : "mở khoá"} tài
            khoản của {clickItem.full_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
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
            onClick={() => handleDelete()}
            sx={{
              textTransform: "none",
              color: "#fff",
              bgcolor: "#3F41A6",
              width: "fit-content",
              padding: "5px 20px",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#3949AB",
              },
            }}
            autoFocus
          >
            {clickItem.is_active ? "Khoá" : "Mở Khoá"} tài khoản
          </Button>
        </DialogActions>
      </Dialog>

      <AddEmploy
        open={openAdd}
        handleClose={handleCloseAdd}
        items={items}
        setItems={setItems}
      />
      <EditEmploy
        open={openEdit}
        handleClose={handleCloseEdit}
        items={items}
        setItems={setItems}
        currentItem={clickItem}
      />
      <StaffFilter
        open={openFilter}
        handleClose={handleCloseFilter}
        filterVal={filterVal}
        setFilterVal={setFilterVal}
      />
    </div>
  );
}
