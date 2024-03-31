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
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddEmploy from "../components/AddEmploy";

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
  const { auth } = useAuth();
  const [items, setItems] = useState([]);
  const [order_item, set_order_item] = useState([]);
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
    const handleDelete = () => {
    // Xử lý logic xóa ở đây
    setOpen(false);
  };
  const [openAdd, setOpenAdd] = React.useState(false);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  useEffect(() => {
    axios
      .get("/staff/?limit=10&offset=0", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzExMzU2ODA4LCJpYXQiOjE3MTEyNzA0MDgsImp0aSI6IjA2YTkxYTNjOTg0NTQxZmViMjQxNDEwNTBlZDVhMTA3IiwidXNlcl9pZCI6MX0.xQ1PhT84DjooXiLrHVbO_jhLcXVHBmF_4evudCsx3bk`,
        },
      })
      .then((res) => {
        console.log(res.data.results);
        let initialOrderList = res.data.results.map((lst) => {
          return { ...lst, items: [] };
        });
        console.log(initialOrderList);
        setItems(res.data.results);
        set_order_item(initialOrderList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // const handleDelete = async (Id) => {
  //   await axiosBaseUrl
  //     .delete(
  //       `staff/${postId}`,
  //       {
  //         id: postId,
  //         headers: {
  //           Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzExMzU2ODA4LCJpYXQiOjE3MTEyNzA0MDgsImp0aSI6IjA2YTkxYTNjOTg0NTQxZmViMjQxNDEwNTBlZDVhMTA3IiwidXNlcl9pZCI6MX0.xQ1PhT84DjooXiLrHVbO_jhLcXVHBmF_4evudCsx3bk" ,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       const post_list = items.filter(item => item.id !== postId);
  //       setItems(post_list);
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err.response);
  //     });
  // };
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
              <AddEmploy open={openAdd} onClose={handleCloseAdd} />
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
                        <TableCell>{item.full_name} abc</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>{item.created_at}</TableCell>
                        <TableCell >{status.msg}</TableCell>
                        <TableCell style={{ display: "flex", alignItems: "center" }}>
                        <Button
                            variant="text"
                            onClick={() => {
                            }}
                          >
                            <EditIcon style={{color:"black", height: "27px"}}/>
                          </Button>
                          <Button
                            variant="text"
                            onClick={handleClickOpen}
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
                                Bạn có chắc chắn muốn xóa?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                Hủy
                              </Button>
                              <Button onClick={handleDelete} color="primary" autoFocus>
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
                <Pagination count={3} color="primary"/>
            </Box>
          </TableContainer>
         
        </Box>
      </Box>
    </Box>
  );
}