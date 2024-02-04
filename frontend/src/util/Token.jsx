const decodeJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  console.log(JSON.parse(jsonPayload));
  return JSON.parse(jsonPayload);
};

export const isTokenExpired = (accessToken) => {
  const decodedToken = decodeJwt(accessToken);

  // Check if the expiration time is in the past
  console.log(decodedToken.exp);
  return decodedToken.exp < Date.now() / 1000;
};
