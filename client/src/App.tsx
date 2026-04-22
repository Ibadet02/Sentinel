import { Route, Routes } from "react-router-dom";
import IssuesPage from "./pages/IssuesPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IssuesPage />} />
      </Routes>
    </>
  );
}

export default App;
