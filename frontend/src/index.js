import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Redirect 127.0.0.1 to localhost to satisfy Firebase Auth default allowed domains
if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
  const newUrl = window.location.href.replace('127.0.0.1', 'localhost');
  window.location.replace(newUrl);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
