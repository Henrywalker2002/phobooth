// Studio Register
export const translateErr = (err) => {
  if (err.code_name && err.code_name[0].includes("already exists")) {
    err.code_name[0] = "Cửa hàng có mã này đã tồn tại.";
  }
  else if (err.code_name && err.code_name[0].includes("Code name must start with")) {
    err.code_name[0] = "Tên cửa hàng phải bắt đầu bằng chữ cái hoặc số và chỉ bao gồm chữ cái số, kí tự và dấu gạch dưới.";
  }

  if (err.phone) {
    if (err.phone[0].includes("already exists"))
      err.phone[0] = "Studio có số điện thoại này đã tồn tại.";
    else if (err.phone[0].includes("0"))
      err.phone[0] = "Số điện thoại phải bắt đầu bằng số 0 và chỉ chứa số.";
  }

  if (err.email) {
    if (err.email[0].includes("already exists")) {
      err.email[0] = "Studio có email này đã tồn tại.";
    } else if (err.email[0].includes("valid")) {
      err.email[0] = "Email chưa đúng định dạng.";
    }
  }

  //   console.log(err);
  return err;
};

export const translateErrStatusOrder = (err) => {
  if (
    err ===
    "You cannot update this order to in process, please update all price of order item first"
  )
    return "Bạn cần phải cập nhật giá của tất cả sản phẩm trước khi cập nhật trạng thái tiếp theo !";
  else if (err === "You cannot update this order to in process")
    return "Bạn không thể cập nhật đơn hàng này sang trạng thái 'Đang tiến hành'.";
  else if (
    err ===
    "You cannot complete order if that order have not been paid completed yet"
  )
    return 'Không cập nhật "Hoàn Thành" cho đơn hàng chưa được thanh toán toàn bộ!';
  else if (
    err === "You cannot complete order if have any order item is not completed"
  )
    return "Bạn không thể hoàn thành đơn hàng nếu có sản phẩm chưa được hoàn thành.";
  else if (err === "You cannot update a completed order")
    return "Bạn không thể cập nhật trạng thái cho đơn hàng đã hoàn thành!";
  else if (err === "You cannot cancel this order")
    return "Bạn không thể hủy đơn hàng này!";
  return err;
};

export const translateErrUserInfo = (err) => {
  if (
    err.username &&
    err.username[0] == "user with this username already exists."
  ) {
    err.code_name[0] = "Tên này đã tồn tại.";
  }

  if (err.phone && err.phone[0] == "Invalid phone number")
    err.phone[0] = "Số điện thoại không hợp lệ!";

  if (
    err.password &&
    err.password[0] == "Password must be at least 8 characters long"
  )
    err.password[0] = "Mật khẩu phải có ít nhất 8 kí tự!";

  return err;
};

export const translateErrSignUp = (err) => {
  if (
    err.username &&
    err.username[0] == "user with this username already exists."
  ) {
    err.username[0] = "Tên nguời dùng này đã tồn tại.";
  }

  if (
    err.password &&
    err.password[0] == "Password must be at least 8 characters long"
  ) {
    err.password[0] = "Mật khẩu phải có ít nhất 8 kí tự.";
  }

  if (err.email) {
    if (err.email[0] == "user with this email already exists.") {
      err.email[0] = "Người dùng có email này đã tồn tại.";
    } else if (err.email[0] == "Enter a valid email address.") {
      err.email[0] = "Email chưa đúng định dạng.";
    }
  }
  return err;
};

export const translateOrderStatus = (status) => {
  if (status === "ORDERED") return "Đã đặt";
  else if (status === "IN_PROCESS") return "Đang tiến hành";
  else if (status === "SHIPPING") return "Vận chuyển";
  else if (status === "COMPLETED") return "Hoàn thành";
  else if (status === "CANCELED") return "Hủy đơn";
  return "";
};

export const translateType = (typ) => {
  if (typ === "SERVICE") return "Dịch vụ";
  else if (typ === "PRODUCT") return "Hàng hóa";
  else if (typ === "ACCESSORY") return "Dịch vụ hỗ trợ";
  else if (typ === "SERVICE_PACK") return "Gói dịch vụ";
  return typ;
};

export const translateErrCategory = (err) => {
  if (err.description && err.description[0] == "This field may not be blank.") {
    err.description[0] = "Bạn không được để trống trường này.";
  }

  if (
    err.type &&
    (err.type[0] == '"" is not a valid choice.' ||
      err.type[0] == "This field is required.")
  ) {
    err.type[0] = "Bạn cần chọn loại cho danh mục.";
  }

  if (err.title) {
    if (err.title[0] == "category with this title already exists.") {
      err.title[0] = "Danh mục có tiêu đề này đã tồn tại.";
    } else if (err.title[0] == "This field may not be blank.") {
      err.title[0] = "Bạn không được để trống trường này.";
    }
  }
  return err;
};

export const translateRole = (role) => {
  if (role == "admin") return "Quản lý";
  else if (role == "staff") return "Nhân viên";
};

export const translateComplainType = (type) => {
  if (type === "REFUND") return "Hoàn tiền";
  else if (type === "OTHER") return "Loại khác";

  return "";
};
