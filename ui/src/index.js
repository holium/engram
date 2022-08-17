import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles.css";
import "./assets/app.css";
import "./assets/theme.css";
import "./components/document/document.css";
import "./components/document/prosemirror.css";
import 'remixicon/fonts/remixicon.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
