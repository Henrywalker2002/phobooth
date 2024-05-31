import * as React from "react";
import {
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Menu,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircleIcon from "@mui/icons-material/Circle";
import handleContentNotification from "./handleContentNotification";
import { useNavigate } from "react-router-dom";

function NotificationContent({ title, message, timestamp }) {
  return (
    <div className="flex flex-col justify-center py-1 gap-0.5">
      <h3 className="text-sm font-semibold leading-5 text-neutral-800 gap-2">
        {title}
      </h3>
      <p className="text-[15px] leading-5 text-gray-500 truncate">{message}</p>
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
    .put("/notification/read-all/", {})
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

function NotificationItem({
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
      onClick={() =>
        handle_redirect_url(id, is_read, redirect_url, navigate, axiosPrivate)
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ color: "#3F41A6", bgcolor: "#E2E5FF" }}>
          {image.icon}
        </Avatar>
      </ListItemAvatar>
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
            marginLeft: "10px",
          }}
        />
      )}
    </MenuItem>
  );
}

function NotificationList({ anchorNoti, handleClose }) {
  const [notifications, setNotifications] = React.useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  React.useEffect(() => {
    axiosPrivate
      .get("/notification/")
      .then((response) => {
        const results = response.data.results;
        setNotifications(
          results.map((notification) => handleContentNotification(notification))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Menu
      anchorEl={anchorNoti}
      open={Boolean(anchorNoti)}
      onClose={handleClose}
    >
      {notifications.length === 0 ? (
        <Box
          sx={{
            width: "200px",
            minWidth: "200px",
            maxWidth: "400px",
          }}
        >
          <MenuItem>
            <p>Không có thông báo</p>
          </MenuItem>
        </Box>
      ) : (
        <div>
          {notifications.map((notification, i) => (
            <Box
              sx={{
                minWidth: "300px",
                maxWidth: "450px",
              }}
              key={i}
            >
              <NotificationItem
                id={notification.id}
                image={notification.image}
                title={notification.title}
                message={notification.message}
                timestamp={notification.timestamp}
                is_read={notification.is_read}
                redirect_url={notification.redirect_url}
                navigate={navigate}
                axiosPrivate={axiosPrivate}
              />
              {i !== notifications.length - 1 && <Divider />}
            </Box>
          ))}
          <Divider />
          <MenuItem
            onClick={() =>
              handle_read_all(axiosPrivate, notifications, setNotifications)
            }
          >
            Đánh dấu đã đọc tất cả
          </MenuItem>
          <MenuItem onClick={() => navigate("/notification")}>
            Xem tất cả
          </MenuItem>
        </div>
      )}
    </Menu>
  );
}

export default NotificationList;
