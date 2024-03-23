import * as React from "react";
import handleContentNotification from "./handleContentNotification";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Dialog } from "@mui/material";

function Avatar({ src, alt }) {
  return <img loading="lazy" src={src} alt={alt} className="shrink-0 w-10 aspect-[0.66]" />;
}

function NotificationContent({ title, message, timestamp }) {
  return (
    <div className="flex flex-col justify-center py-1 max-md:max-w-full">
      <h3 className="text-sm font-semibold leading-5 text-neutral-800 max-md:max-w-full">{title}</h3>
      <p className="mt-1.5 mr-6 text-base leading-5 text-gray-500 max-md:mr-2.5 max-md:max-w-full">{message}</p>
      <time className="mr-6 text-xs leading-5 text-neutral-500 max-md:mr-2.5 max-md:max-w-full">{timestamp}</time>
    </div>
  );
}

function handle_redirect_url(url, navigate ) {
    console.log(url);
    navigate(url)
}

function Notification({ image, title, message, timestamp, is_read, redirect_url, navigate  }) {
  return (
    <article className="flex gap-5 justify-between py-2 pr-4 rounded max-w-[598px] max-md:flex-wrap" onClick={() => handle_redirect_url(redirect_url, navigate )}>
      <div className="flex gap-3.5 max-md:flex-wrap">
        <Avatar src={image.src} alt={image.alt} />
        <NotificationContent title={title} message={message} timestamp={timestamp} />
      </div>

      {!is_read && <div className="shrink-0 self-start mt-3.5 w-2.5 h-2.5 bg-indigo-800 rounded" />}
    </article>
  );
}

function NotificationList({open, handleClose}) {
  const navigate  = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {

    axiosPrivate.get("/notification/", ).then((response) => {
      var results = response.data.results;
      console.log(results);
      setNotifications(results.map((notification) => handleContentNotification(notification)));
    }).catch((error) => {
      console.log(error);
    });
  }, []);
  
  return (
    <Dialog open={open} onClose={handleClose} className="max-w-[598px]">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          image={notification.image}
          title={notification.title}
          message={notification.message}
          timestamp={notification.timestamp}
          is_read={notification.is_read}
          redirect_url={notification.redirect_url}
          navigate ={navigate}
        />
      ))}
      <div>
        <button className="w-full py-3 text-sm font-semibold text-center text-neutral-800 bg-neutral-100" onClick={handleClose}>Đóng</button>
      </div>
    </Dialog>
  );
}

export default NotificationList;