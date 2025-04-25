import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Fix for mobile viewport height issues
const setDocumentHeight = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};

window.addEventListener('resize', setDocumentHeight);
window.addEventListener('orientationchange', setDocumentHeight);
setDocumentHeight();

createRoot(document.getElementById("root")!).render(<App />);
