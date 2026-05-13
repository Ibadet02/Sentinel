import { Route, Routes } from "react-router-dom";
import IssuesPage from "./pages/IssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<IssuesPage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
