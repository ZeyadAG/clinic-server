import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Register from "./pages/register.jsx";
import "./App.css";
import { ThemeProvider } from "@mui/material";
import "typeface-poppins";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import theme from "./theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className="navbar flex w-screen bg-teal-500 content-center">
          <h1 className="text-2xl bold flex-1 my-auto mx-12">hello world</h1>
          <Link to="/register" className="mx-12 my-4">
            Register
          </Link>
          <Link to="/" className="mx-12 my-4">
            Home
          </Link>
        </div>
      </ThemeProvider>

      <Routes>
        <Route path="/register" element={<Register />}>
          <Route index element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
