import { createRoot } from "react-dom/client";
import clarity from '@microsoft/clarity';
import App from "./App.tsx";
import "./index.css";

// Initialize Microsoft Clarity
clarity.init('ugun1fd2jp');

createRoot(document.getElementById("root")!).render(<App />);
