import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { Typography, styled } from "@mui/material";

const positions = [
  { value: "nhanvien", label: "Nhân viên" },
  { value: "quản lý", label: "Quản lý" },
  { value: "giám đốc", label: "Giám đốc" }
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
function AddEmployeeDialog({ open, handleClose }) {
  const [formData, setFormData] = React.useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    position: "",
    dob: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    // Handle form submission here
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth >
      <DialogTitle style={{ textAlign: "center", color: "#3f41a6", fontSize: "24px", fontWeight: 600 }}>Thêm nhân viên</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Họ và tên *</Typography>
            <TextField
            //   label="Họ và tên"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Tên người dùng *</Typography>
            <TextField
            //   label="Tên người dùng"
              value={formData.username}
              onChange={handleChange("username")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Email</Typography>
            <TextField
            //   label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Số điện thoại</Typography>
            <TextField
            //   label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange("phoneNumber")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Chức vụ</Typography>
            <TextField
              select
            //   label="Chức vụ"
              value={formData.position}
              onChange={handleChange("position")}
              fullWidth
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
              value={formData.dob}
              onChange={handleChange("dob")}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Mật khẩu</Typography>
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
        </Grid>
      </DialogContent>
        <DialogActions>
            <Grid container justifyContent="center">
                <Grid item>
                <ButCan onClick={handleClose}>Hủy</ButCan>
                </Grid>
                <Grid item>
                <ButAdd onClick={handleSubmit} variant="contained" color="primary">
                    Thêm
                </ButAdd>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
  );
}

export default AddEmployeeDialog;
