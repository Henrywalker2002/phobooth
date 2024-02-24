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
