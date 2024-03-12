// Studio Register
export const translateErr = (err) => {
  if (err.code_name && err.code_name[0].includes("already exists")) {
    err.code_name[0] = "Studio có tên này đã tồn tại.";
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
  else if (
    err ===
    "You cannot complete order if that order have not been paid completed yet"
  )
    return 'Không cập nhật "Hoàn Thành" cho đơn hàng chưa được thanh toán toàn bộ!';
  else if (err === "You cannot update a completed order")
    return "Bạn không thể cập nhật trạng thái cho đơn hàng đã hoàn thành!";
  else if (err === "You cannot cancel this order")
    return "Bạn không thể hủy đơn hàng này!";
  return err;
};
