import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FarmProvider>
          <App />
        </FarmProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
