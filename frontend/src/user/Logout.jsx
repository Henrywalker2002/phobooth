import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  sessionStorage.removeItem("username");
  useEffect(() => {
    navigate("/login");
  }, []);
  return <div></div>;
}

export default Logout;
