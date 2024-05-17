const convertRole = (roles) => {
  for (let i = 0; i < roles?.length; i++) {
    var role = roles[i]
    if (typeof role === "object") {
      role = role.code_name
    }
    if (role.includes("admin")) {
      return "Quản lý"
    }
    if (roles[i].code_name === "staff") {
      return "Nhân viên"
    }
    else {
      return "Khách hàng"
    }
  }
}

const convertTime = (time) => {
  const date = new Date(time)
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return `${date.getHours()}:${minutes}, ${date.getDate()} Tháng ${date.getMonth() + 1} ${date.getFullYear()}`
}

const convertStatus = (status) => {
  if (status === "PENDING") {
    return "Chờ xử lý"
  }
  if (status === "RESOLVED") {
    return "Đã giải quyết"
  }
  if (status === "IN_PROGRESS") {
    return "Đang xử lý"
  }

}

export { convertRole, convertTime, convertStatus }