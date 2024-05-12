import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import { FaXmark } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

function StaffFilter({ open, handleClose, filterVal, setFilterVal }) {
  // local
  const roleList = [
    { value: "staff", label: "Nhân viên" },
    { value: "admin", label: "Quản lý" },
    { value: "all", label: "Tất cả" },
  ];

  const statusList = [
    { value: true, label: "Hoạt động" },
    { value: false, label: "Không hoạt động" },
    { value: "all", label: "Tất cả" },
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    is_active: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const resetFormData = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      role: "",
      is_active: "",
    });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFilter = (event) => {
    var data = {};
    if (formData.username !== "") {
      data.username = formData.username;
    }
    if (formData.email !== "") {
      data.email = formData.email;
    }
    if (formData.phone !== "") {
      data.phone = formData.phone;
    }
    if (formData.role !== "all" && formData.role !== "") {
      data.role = formData.role;
    }
    if (formData.is_active !== "all" && formData.is_active !== "") {
      data.is_active = formData.is_active;
    }
    else if (formData.is_active === "all") {
      data.is_active = "";
    }

    if (data) {
      setFilterVal({ ...filterVal, ...data });
    }

    handleClose();
  };

  return (
    <Dialog
      sx={{ minWidth: "400px" }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>
        <div className="shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Bộ lọc
          </div>
          <IconButton
            onClick={() => {
              handleClose();
            }}
          >
            <FaXmark />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        dividers={true}
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <div className="min-w-[350px] flex flex-col gap-4 px-7">
          <Typography>Chức vụ</Typography>
          <TextField
            select
            value={formData.role}
            defaultValue={"all"}
            onChange={handleChange}
            name="role"
          >
            {roleList.map((role) => {
              return (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              );
            })}
          </TextField>

          <Typography>Tên người dùng</Typography>
          <TextField
            value={formData.username}
            onChange={handleChange}
            name="username"
          />

          <Typography>Email</Typography>
          <TextField
            value={formData.email}
            onChange={handleChange}
            name="email"
          />

          <Typography>Số điện thoại</Typography>
          <TextField
            value={formData.phone}
            onChange={handleChange}
            name="phone"
          />

          <Typography>Trạng thái</Typography>
          <TextField
            select
            value={formData.is_active}
            defaultValue={"all"}
            onChange={handleChange}
            name="is_active"
          >
            {statusList.map((status) => {
              return (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
      </DialogContent>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <DialogActions>
        <div className="flex gap-5 justify-center mx-auto my-2">
          <Button
            variant="outlined"
            onClick={() => {
              resetFormData();
              handleClose();
            }}
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
          >
            Hủy bộ lọc
          </Button>
          <Button
            // disabled={
            //   checkDateFrom(newFilterVal.date_from ?? filterVal?.date_from) !==
            //   ""
            // }
            variant="contained"
            onClick={handleFilter}
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
            Lọc danh sách
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default StaffFilter;
