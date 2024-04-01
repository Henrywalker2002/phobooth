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
  Box,
  Select,
  Grid,
  Button,
  styled,
  TextField,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogContentText
} from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddEmploy from "../components/AddEmploy";
import EditEmploy from "../components/EditEmploy";

const Title1 = styled("div")({
    color: "#3f41a6",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "600",
    textTransform: "capitalize",
    padding: "0px 0px 10px 0px",
    textAlign: "center"
  });
const ButAdd = styled(Button)({
    backgroundColor: "#3f41a6",
    fontSize: "14px",
    fontWeight: "600",
    padding: "14px 32px",
    textAlign: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#2c2e78", // Màu khi hover
    },
    "&.MuiButton-outlined": {
      borderWidth: "2px", // Độ rộng viền cho variant outlined
      borderRadius: "43px", // Đường viền cong cho variant outlined
    },
    "&.MuiButton-contained": { 
      borderRadius: "43px", // Đường viền cong cho variant contained
    },
  });
  const BoxSearch = styled(Box)({
    border: "2px solid #E0E3EB",
    borderRadius: "32px",
    width: "30%",
    padding: "14px 32px",
    alignItems: "center",
    display: "flex",
    backgroundColor: '#fff'
  });
  const CustomInput = styled("input")({
    border: "none",
    width: "70%",
    marginRight: "2.5%",
    fontSize: "16px",
    "&:focus": {
      outline: "none",
    },
  });
  const Search = styled("div")({
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "600",
    textTransform: "none",
    padding: "0px 0px 10px 0px",
    textAlign: "center"
  });

export default function AdminManageAccount() {
  const axiosPrivate = useAxiosPrivate();
  const [items, setItems] = useState([]);
  const [order_item, set_order_item] = useState([]);
  const [clickItem, setClickItem] = useState({});
  const [count, setCount] = useState(0);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const mappingStatus = (status) => {
    if (status){
      return {
       msg: "Hoạt động",
      };
    }
    else {
        return {
            msg: "Không hoạt động",
        }
    }
  };
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
    axiosPrivate.delete(`/staff/${clickItem.username}/`).then((res) => {
      setItems(items.filter((item) => item.username !== clickItem.username));
      handleClose();
    }).catch((err) => {
      if (err.response.status === 400) {
        console.log(err);
      }
      else if (err.response.status === 404) {
        setItems(items.filter((item) => item.username !== clickItem.username));
        handleClose();
      }
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
  }

  useEffect(() => {
    axiosPrivate
      .get(`/staff/?limit=10&offset=${(page - 1)*10}`, {
      })
      .then((res) => {
        console.log(res);
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
  }, [page]);

  function handleDate(date) {
    let newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box
      style={{
        marginTop: "64px",
      }}
    >
      <Box
        style={{
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
            <Box>
            <Title1>Quản lý tài khoản</Title1>
            <Box display="flex" alignItems="center" justifyContent="center">
              <BoxSearch>
                <SearchIcon style={{paddingRight: "5px"}} />
                <CustomInput type="text" placeholder="Tìm kiếm" />
              </BoxSearch>
              <ButAdd variant="contained" sx={{ marginLeft: "10px" }} onClick={handleClickOpenAdd}>
                <AddIcon />
                Thêm nhân viên
              </ButAdd>
              <AddEmploy open={openAdd} handleClose={handleCloseAdd} items = {items} setItems={setItems} />
              <EditEmploy open={openEdit} handleClose={handleCloseEdit} items = {items} setItems={setItems} currentItem = {clickItem}/>
            </Box>
          <TableContainer component={Paper} style={{width: "90%", marginLeft: "5%"}}>
            <Table>
              <TableHead>
                <TableRow style={{backgroundColor: "#f6f5fb"}}>
                  <TableCell style={{fontWeight: "bold", color: "#3f41a6"}}>Họ và tên</TableCell>
                  <TableCell style={{fontWeight: "bold", color: "#3f41a6"}}>Tên người dùng</TableCell>
                  <TableCell style={{fontWeight: "bold", color: "#3f41a6"}}>Chức vụ</TableCell>
                  <TableCell style={{fontWeight: "bold", color: "#3f41a6"}}>Ngày tham gia</TableCell>
                  <TableCell style={{fontWeight: "bold", color: "#3f41a6"}}>Trạng thái</TableCell>
                  <TableCell style={{fontWeight: "bold", color: "#3f41a6"}}> Hành động</TableCell>
                </TableRow>
              </TableHead>
              {items.length > 0 ? (
                <TableBody>
                  {items?.map((item, index) => {
                    const status = mappingStatus(item.is_active);
                    return (
                      <TableRow key={index} >
                        <TableCell>{item.full_name}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>{handleDate(item.created_at)}</TableCell>
                        <TableCell >{status.msg}</TableCell>
                        <TableCell style={{ display: "flex", alignItems: "center" }}>
                        <Button
                            variant="text"
                            onClick={() => {
                              handleClickEdit(item);
                            }}
                          >
                            <EditIcon style={{color:"black", height: "27px"}}/>
                          </Button>
                          <Button
                            variant="text"
                            onClick={() => handleClickOpen(item)}
                          >
                            <DeleteIcon style={{color:"black", height: "27px"}}/>
                          </Button>
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">{"Xác nhận xóa?"}</DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                {`Bạn có chắc chắn muốn xóa ${clickItem.full_name}?`}
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                Hủy
                              </Button>
                              <Button onClick={() => handleDelete()} color="primary" autoFocus>
                                Xóa
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <></>
              )}
            </Table>
            <Box style={{display: "flex", justifyContent: "center", margin: "10px"}}>
                <Pagination count={Math.ceil(count/10)} color="primary" onChange={handlePageChange}/>
            </Box>
          </TableContainer>
         
        </Box>
      </Box>
    </Box>
  );
}