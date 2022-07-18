import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles.css";
import "./assets/app.css";
import "./assets/theme.css";
import "./assets/document.css";
import "./components/document/prosemirror.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
