import { Route, Routes } from "react-router-dom";
import IssuesPage from "./pages/IssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IssuesPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
