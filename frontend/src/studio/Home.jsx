import React from "react";
import useAuth from "../hooks/useAuth";
import StudioNavbar from "../components/StudioNavbar";

function Home() {
  const { auth } = useAuth();
  console.log(auth.studio);
  return (
    <div>
      <StudioNavbar />
      <h1>Studio Home</h1>
    </div>
  );
}

export default Home;
