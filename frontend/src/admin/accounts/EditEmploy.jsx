import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import {
  Typography,
  styled,
  Alert,
  FormControl,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";

const positions = [
  { value: "staff", label: "Nhân viên" },
  { value: "admin", label: "Quản lý" },
];
const ButCan = styled(Button)({
  // display: inline-flex;
  padding: "14px 32px",
  justifyContent: "center",
  // align-items: center;
  // gap: 12px;
  borderRadius: "43px",
  border: "1px solid #3F41A6",
  background: "#F6F5FB",
  textTransform: "none",
  color: "#000",
  fontWeight: 600,
  marginRight: "15px",
});
const ButAdd = styled(Button)({
  // display: inline-flex;
  padding: "14px 32px",
  justifyContent: "center",
  // align-items: center;
  // gap: 12px;
  color: "#fff",
  borderRadius: "43px",
  // border: '1px solid #3F41A6',
  background: "#3F41A6",
  textTransform: "none",
  fontWeight: 600,
  marginLeft: "15px",
});

export default function EditEmploy({
  open,
  handleClose,
  items,
  setItems,
  currentItem,
}) {
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const handleCurrentClose = () => {
    handleClose();
    setErrorMessage({});
    setSuccessMessage(null);
  };

  const [formData, setFormData] = React.useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // update staff
    var data = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      date_of_birth: formData.date_of_birth,
    };
    if (formData.password !== "") {
      if (formData.password.length < 8) {
        setErrorMessage({
          ...errorMessage,
          password: "Mật khẩu phải có ít nhất 8 ký tự",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage({
          ...errorMessage,
          confirmPassword: "Mật khẩu không khớp",
        });
        return;
      }
      data.password = formData.password;
    }

    axiosPrivate
      .patch(`/staff/${currentItem.username}/`, data)
      .then((res) => {
        setItems(
          items.map((item) => {
            if (item.username === currentItem.username) {
              return {
                ...item,
                full_name: res.data.full_name,
                email: res.data.email,
                phone: res.data.phone,
                role: res.data.role[0].code_name,
                date_of_birth: res.data.date_of_birth,
              };
            }
            return item;
          })
        );
        setSuccessMessage("Cập nhật thông tin thành công");
        setErrorMessage({});
      })
      .catch((err) => {
        if (err.response.status === 400) {
          var data = err.response.data;
          if (data.username && data.username[0].includes("exists")) {
            setErrorMessage({
              ...errorMessage,
              username: "Tên người dùng đã tồn tại",
            });
          }
          if (data.email && data.email[0].includes("exists")) {
            setErrorMessage({ ...errorMessage, email: "Email đã tồn tại" });
          } else if (data.email && data.email[0].includes("valid")) {
            setErrorMessage({ ...errorMessage, email: "Email không hợp lệ" });
          }
          if (data.phone && data.phone[0].includes("exists")) {
            setErrorMessage({
              ...errorMessage,
              phone: "Số điện thoại đã tồn tại",
            });
          } else if (data.phone && data.phone[0].includes("valid")) {
            setErrorMessage({
              ...errorMessage,
              phone: "Số điện thoại không hợp lệ",
            });
          }
        }
      });
  };

  React.useEffect(() => {
    axiosPrivate
      .get(`/staff/${currentItem.username}/`)
      .then((res) => {
        setFormData({
          full_name: res.data.full_name,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone,
          role: res.data.role[0].code_name,
          date_of_birth: res.data.date_of_birth,
          password: "",
          confirmPassword: "",
        });
        setErrorMessage({});
      })
      .catch((err) => {
        setErrorMessage("Không thể lấy thông tin thành viên");
      });
  }, [currentItem]);

  const resetFormData = () => {};

  // pwd behavior
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onClose={handleCurrentClose} maxWidth="md" fullWidth>
      <form action="/" method="POST" onSubmit={(e) => handleSubmit(e)}>
        <DialogTitle
          style={{
            textAlign: "center",
            color: "#3f41a6",
            fontSize: "24px",
            fontWeight: 600,
          }}
        >
          Cập nhật thông tin thành viên
        </DialogTitle>
        <DialogContent>
          {successMessage && (
            <Alert
              sx={{
                marginX: "auto",
                marginBottom: "10px",
                width: "fit-content",
              }}
              severity="success"
            >
              {successMessage}
            </Alert>
          )}
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
                required={true}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Email</Typography>
              <TextField
                //   label="Email"
                value={formData.email}
                onChange={handleChange("email")}
                error={errorMessage.email ? true : false}
                helperText={errorMessage.email ?? ""}
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
                error={errorMessage.phone ? true : false}
                helperText={errorMessage.phone ?? ""}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: {
                      error: false,
                    },
                  }}
                  id="date"
                  name="date"
                  sx={{
                    width: "100%",
                  }}
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    if (value)
                      setFormData({
                        ...formData,
                        date_of_birth: value.format("YYYY-MM-DD"),
                      });
                  }}
                  value={dayjs(formData.date_of_birth)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <Typography>Mật khẩu</Typography>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <TextField
                  value={formData.password}
                  onChange={handleChange("password")}
                  error={errorMessage.password ? true : false}
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText id="component-helper-text">
                  {errorMessage.password ?? ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Typography>Nhập lại mật khẩu</Typography>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <TextField
                  variant="outlined"
                  id="outlined-end-adornment"
                  name="password"
                  error={errorMessage.confirmPassword ? true : false}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText id="component-helper-text">
                  {errorMessage.confirmPassword ?? ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sx={6}>
              <Alert
                severity="info"
                sx={{
                  width: "100%",
                  bgcolor: "#E7EAFF",
                  color: "#3F41A6",
                }}
                icon={
                  <InfoOutlinedIcon
                    sx={{ color: "#3F41A6" }}
                    fontSize="inherit"
                  />
                }
              >
                Điền mật khẩu nếu cần thay đổi không thì để trống
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                onClick={() => {
                  setErrorMessage({});
                  resetFormData();
                  handleCurrentClose();
                }}
                variant="outlined"
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
                Hủy thông tin
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  textTransform: "none",
                  bgcolor: "#3F41A6",
                  width: "fit-content",
                  padding: "5px 20px",
                  borderRadius: "20px",
                  "&:hover": {
                    bgcolor: "#3949AB",
                  },
                }}
              >
                Lưu thay đổi
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
}
