import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import Layout from "./components/Layout";
import { Leads } from "./pages/Leads";
import { Connect } from "./pages/Connect/Connect";
import { ProtectedRoute } from "./components/ProtectedRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/leads" element={<Leads />} />
            <Route path="/connect" element={<Connect />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
