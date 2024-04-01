import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography, styled, Alert } from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const positions = [
  { value: "staff", label: "Nhân viên" },
  { value: "admin", label: "Quản lý" },
];  
const ButCan = styled(Button)({
    // display: inline-flex;
    padding: '14px 32px',
    justifyContent: "center",
    // align-items: center;
    // gap: 12px;
    borderRadius: '43px',
    border: '1px solid #3F41A6',
    background: '#F6F5FB',
    textTransform: "none",
    color: "#000",
    fontWeight: 600,
    marginRight: "15px"
})
const ButAdd = styled(Button)({
    // display: inline-flex;
    padding: '14px 32px',
    justifyContent: "center",
    // align-items: center;
    // gap: 12px;
    color: "#fff",
    borderRadius: '43px',
    // border: '1px solid #3F41A6',
    background: '#3F41A6',
    textTransform: "none",
    fontWeight: 600,
    marginLeft: "15px"
})

export default function EditEmploy({open, handleClose, items, setItems, currentItem}) {

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const handleCurrentClose = () => {
    handleClose();
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  const [formData, setFormData] = React.useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    date_of_birth: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    // update staff 
    var data = {
      full_name: formData.full_name,
      email : formData.email,
      phone: formData.phone,
      role: formData.role,
      date_of_birth: formData.date_of_birth,
    }
    if (formData.password !== "") {
      if (formData.password.length < 8) {
        setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Mật khẩu không khớp");
        return;
      }
      data.password = formData.password;
    }

    axiosPrivate.patch(`/staff/${currentItem.username}/`, data).then((res) => {
      setItems(items.map((item) => {
        if (item.username === currentItem.username) {
          return {
            ...item,
            full_name: res.data.full_name,
            email: res.data.email,
            phone: res.data.phone,
            role: res.data.role[0].code_name,
            date_of_birth: res.data.date_of_birth,
          }
        }
        return item;
      }))
      setSuccessMessage("Cập nhật thông tin thành công");
      setErrorMessage(null);
    }).catch((err) => {
      if (err.response.status === 400) {
        var data = err.response.data;
        var message = "";
        if (data.username[0].includes("exists")) {
          message += "Tên người dùng đã tồn tại \n";
        }
        if (data.email[0].includes("exists")) {
          message += "Email đã tồn tại \n";
        }
        else if (data.email[0].includes("valid")) {
          message += "Email không hợp lệ \n";
        }
        if (data.phone[0].includes("exists")) {
          message += "Số điện thoại đã tồn tại \n";
        }
        else if (data.phone[0].includes("valid")) {
          message += "Số điện thoại không hợp lệ \n";
        }
        if (message) {
          setErrorMessage(message);
        }
      }
    })
  }

  React.useEffect(() => {
    axiosPrivate.get(`/staff/${currentItem.username}/`).then((res) => {
      setFormData({
        full_name: res.data.full_name,
        username: res.data.username,
        email: res.data.email,
        phone: res.data.phone,
        role: res.data.role[0].code_name,
        date_of_birth: res.data.date_of_birth,
        password: "",
        confirmPassword: ""
      })
      setErrorMessage(null);
    }).catch((err) => {
      setErrorMessage("Không thể lấy thông tin thành viên")
    })
  }, [currentItem]);

  const resetFormData = () => {

  }
  
  return (
    <Dialog open={open} onClose={handleCurrentClose} maxWidth="md" fullWidth >
    <form action = '/' method="POST" onSubmit={(e) => handleSubmit(e)}>
    <DialogTitle style={{ textAlign: "center", color: "#3f41a6", fontSize: "24px", fontWeight: 600 }}>Cập nhật thông tin thành viên</DialogTitle>
    <DialogContent>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Họ và tên </Typography>
          <TextField
          //   label="Họ và tên"
            value={formData.full_name}
            onChange={handleChange("full_name")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Tên người dùng </Typography>
          <TextField
          //   label="Tên người dùng"
            value={formData.username}
            onChange={handleChange("username")}
            fullWidth
            disabled
            required = {true}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Email</Typography>
          <TextField
          //   label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            fullWidth
            required
            type="email"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Số điện thoại</Typography>
          <TextField
          //   label="Số điện thoại"
            value={formData.phone}
            onChange={handleChange("phone")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Chức vụ</Typography>
          <TextField
            select
          //   label="Chức vụ"
            value={formData.role}
            onChange={handleChange("role")}
            fullWidth
            required
          >
            {positions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <Typography>Ngày sinh</Typography>
          <TextField
          //   label="Ngày sinh"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange("date_of_birth")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>
      
        <Grid item xs={6}>
          <Typography>
            Mật khẩu 
          </Typography> 
          <TextField
          //   label="Mật khẩu"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Nhập lại mật khẩu</Typography>
          <TextField
          //   label="Nhập lại mật khẩu"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            fullWidth
          />
        </Grid>
        <Alert severity="info">Điền mật khẩu nếu cần thay đổi không thì để trống</Alert>
      </Grid>
    
    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    {successMessage && <Alert severity="success">{successMessage}</Alert>}
    
    </DialogContent>
      <DialogActions>
          <Grid container justifyContent="center">
              <Grid item>
              <ButCan onClick={() => {
                  setErrorMessage(null);
                  resetFormData();
                  handleCurrentClose()
                }}>Hủy</ButCan>
              </Grid>
              <Grid item>
              <ButAdd type="submit" variant="contained" color="primary">
                  Lưu
              </ButAdd>
              </Grid>
          </Grid>
      </DialogActions>
      </form>
  </Dialog>
  )
  
}