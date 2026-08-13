import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <FarmProvider>
              <App />
            </FarmProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
