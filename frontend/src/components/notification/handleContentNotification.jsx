import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import DoDisturbAltTwoToneIcon from '@mui/icons-material/DoDisturbAltTwoTone';
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

class NotificationTypeChoices {
    static CREATED = "CREATED";
    static COMPLETED = "COMPLETED";
    static PAID = "PAID";
    static CANCELED = "CANCELED";
    static ADD = "ADD";
    static ACCEPTED = "ACCEPTED";
    static DENIED = "DENIED";
}

function handle_timestamp(create_at) {
    const time_stamp = new Date(create_at);
    const now = new Date();
    const diff = new Date(now - time_stamp);
    // does not handle for multi years 
    var dayDiff = diff.getUTCDate() - 1;
    if (dayDiff <= 0) {
        return 'Hôm nay';
    }
    else {
        return `${diff.getUTCDate() - 1} ngày trước`
    }
}

class Notification {
    constructor(id, title, type, message, redirect_url, create_at, image, is_read) {
        this.id = id
        this.type = type;
        this.message = message;
        this.redirect_url = redirect_url;
        this.timestamp = handle_timestamp(create_at);
        this.image = image;
        this.title = title;
        this.is_read = is_read;
    }
}

function handleContentNotification(notification) {
    // hard code to gen message for notification
    var message = "";
    var redirect_url = "";
    var image = {};
    if (notification.verb == NotificationTypeChoices.CREATED) {
        message = `${notification.subject} đã tạo ${notification.direct_object}`;
        if (notification.direct_object.includes("order")) { 
            redirect_url = `/studio/order/detail/${notification.redirect_id}`;
        }
        if (notification.direct_object.includes("payment")) {
            redirect_url = `/order/detail/${notification.redirect_id}`
        }
        image = <EditCalendarTwoToneIcon />
    }
    else if (notification.verb == NotificationTypeChoices.COMPLETED) {
        message = `${notification.subject} đã hoàn thành ${notification.direct_object}`;
        redirect_url = `/order/detail/${notification.redirect_id}`;

        image = <CheckCircleTwoToneIcon />
    }
    else if (notification.verb == NotificationTypeChoices.ACCEPTED) {
        message = `${notification.subject} đã chấp nhận ${notification.direct_object}`;
        if (notification.redirect_type == "ORDER") {
            redirect_url = `/order/detail/${notification.redirect_id}`;
        }
        redirect_url = `/order/detail/${notification.redirect_id}`;
        image = <HandshakeTwoToneIcon />
    }
    else if (notification.verb == NotificationTypeChoices.DENIED) {
        message = `${notification.subject} đã từ chối ${notification.direct_object}`;
        redirect_url = `/order/detail/${notification.redirect_id}`;

        image = <DoDisturbAltTwoToneIcon />
    }
    else if (notification.verb == NotificationTypeChoices.PAID) {
        message = `${notification.subject} đã thanh toán ${notification.direct_object}`;
        redirect_url = `studio/order/detail/${notification.redirect_id}`;

        image = <PriceCheckTwoToneIcon />
    }
    else if (notification.verb == NotificationTypeChoices.CANCELED) {
        message = `${notification.subject} đã hủy ${notification.direct_object}`;
        redirect_url = `studio/order/detail/${notification.redirect_id}`;

        image = <CancelTwoToneIcon />
    }
    return new Notification(
        notification.id, notification.subject, notification.verb, 
        message, redirect_url, notification.created_at, image, 
        notification.is_read);
}

export default handleContentNotification;