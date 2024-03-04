const decodeJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  // console.log(JSON.parse(jsonPayload));
  return JSON.parse(jsonPayload);
};

function formatExpirationTime(timestamp) {
  const expirationDate = new Date(timestamp * 1000); // Định dạng timestamp từ miliseconds sang giây
  const year = expirationDate.getFullYear();
  const month = (expirationDate.getMonth() + 1).toString().padStart(2, "0"); // Cộng thêm 1 vì tháng trong JavaScript bắt đầu từ 0
  const day = expirationDate.getDate().toString().padStart(2, "0");
  const hours = expirationDate.getHours().toString().padStart(2, "0");
  const minutes = expirationDate.getMinutes().toString().padStart(2, "0");
  const seconds = expirationDate.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const isTokenExpired = (accessToken) => {
  const decodedToken = decodeJwt(accessToken);

  // Check if the expiration time is in the past
  // console.log(
  //   formatExpirationTime(decodedToken.exp),
  //   formatExpirationTime(Date.now() / 1000)
  // );
  return decodedToken.exp < Date.now() / 1000;
};
