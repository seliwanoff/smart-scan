import { Routes, Route } from "react-router-dom";
import Home from "./lib/home";
import AuthPage from "./pages/auth";
import Dashboard from "./components/pages/dashboard";
import PricingPage from "./components/pages/pricing";
//import OCRPage from "./pages/OCRPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  );
}
