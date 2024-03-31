import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CookiesProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </CookiesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
