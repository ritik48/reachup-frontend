import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import Layout from "./components/Layout";
import { Lead } from "./pages/Leads/Lead";
import { Connect } from "./pages/Connect/Connect";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { UserProvider } from "./contexts/UserContext";
import SignUpPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import { LeadsSetup } from "./pages/Leads/LeadsSetup";
import { LeadsDetail } from "./pages/Leads/LeadsDetail";
import { WorkflowExecution } from "./pages/Workflow/NewWorkflow";
import { Workflow } from "./pages/Workflow/Workflow";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="leads" element={<Lead />} />
              <Route path="leads/:id/new" element={<LeadsSetup />} />
              <Route path="leads/:id" element={<LeadsDetail />} />
              <Route path="connect" element={<Connect />} />

              <Route path="workflow" element={<Workflow />} />
              <Route path="workflow/:id" element={<WorkflowExecution />} />
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
