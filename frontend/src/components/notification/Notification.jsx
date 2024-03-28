import * as React from "react";
import handleContentNotification from "./handleContentNotification";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  MenuList,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircleIcon from "@mui/icons-material/Circle";

function NotificationContent({ title, message, timestamp }) {
  return (
    <div className="flex flex-col justify-center py-1 gap-0.5">
      <h3 className="text-sm font-semibold leading-5 text-neutral-800 gap-2">
        {title}
      </h3>
      <p className="text-[15px] leading-5 text-gray-500">{message}</p>
      <time className="text-xs leading-5 text-neutral-500">{timestamp}</time>
    </div>
  );
}

function handle_redirect_url(id, is_read, url, navigate, axiosPrivate) {
  console.log(url);
  if (!is_read) {
    axiosPrivate
      .patch(`/notification/${id}/`, { is_read: true })
      .then((response) => {
        // console.log(response.data); 
      })
      .catch((error) => {
        console.log(error);
      });
  }
  navigate(url);
}

function handle_read_all(axiosPrivate, notifications, setNotifications) {
  axiosPrivate
    .put('/notification/read-all/', {})
    .then((response) => {
      setNotifications(
        notifications.map((notification) => {
          notification.is_read = true;
          return notification;
        })
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function Notification({
  id,
  image,
  title,
  message,
  timestamp,
  is_read,
  redirect_url,
  navigate,
  axiosPrivate,
}) {
  return (
    <MenuItem
      alignItems="flex-start"
      onClick={() => handle_redirect_url(id, is_read, redirect_url, navigate, axiosPrivate)}
    >
      {image}
      <ListItemText>
        <NotificationContent
          title={title}
          message={message}
          timestamp={timestamp}
        />
      </ListItemText>

      {!is_read && (
        <CircleIcon
          sx={{
            color: "#3F41A6",
            width: "10px",
            height: "10px",
            alignSelf: "center",
          }}
        />
      )}
    </MenuItem>
  );
}

function NotificationList({ anchorNoti, handleClose }) {
  const open = Boolean(anchorNoti);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    axiosPrivate
      .get("/notification/")
      .then((response) => {
        var results = response.data.results;
        // console.log(results);
        setNotifications(
          results.map((notification) => handleContentNotification(notification))
        );
        console.log(notifications);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Dialog
      anchorEl={anchorNoti}
      open={open}
      onClose={handleClose}
      transformOrigin={{ horizontal: "right", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      keepMounted
      PaperProps={{
        style: {
          width: "auto",
          minWidth: "450px",
          margin: "16px",
          borderRadius: "5px",
          position: "absolute",
          top: "50%",
          left: "60%",
          transform: "translate(-50%, -50%)",
        },
      }}
      BackdropProps={{
        invisible: true,
      }}
      disableBackdropClick
    >
      <DialogTitle sx={{ padding: "14px 20px" }}>
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
          Thông báo
        </div>
      </DialogTitle>

      <DialogContent
        dividers={true}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          padding: "5px 10px",
        }}
      >
        <MenuList sx={{ minWidth: "450px", bgcolor: "background.paper" }}>
          {notifications.map((notification, i) => (
            <Box key={i}>
              <Notification
                id = {notification.id}
                image={notification.image}
                title={notification.title}
                message={notification.message}
                timestamp={notification.timestamp}
                is_read={notification.is_read}
                redirect_url={notification.redirect_url}
                navigate={navigate}
                axiosPrivate = {axiosPrivate}
              />
              {i !== notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </MenuList>
      </DialogContent>

      <DialogActions>
      <Button
          autoFocus
          onClick={() => handle_read_all(axiosPrivate, notifications, setNotifications)}
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            width: "fit-content",
            padding: "5px 20px",
            fontWeight: "600",
            "&:hover": {
              bgcolor: "#E2E5FF",
            },
          }}
        >
          Đọc tất cả
        </Button>

        <Button
          autoFocus
          onClick={() => navigate("/notification")}
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            width: "fit-content",
            padding: "5px 20px",
            fontWeight: "600",
            "&:hover": {
              bgcolor: "#E2E5FF",
            },
          }}
        >
          Xem tất cả
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationList;
