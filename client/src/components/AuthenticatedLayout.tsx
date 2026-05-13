import Header from "./Header";
import { Outlet } from "react-router-dom";

function AuthenticatedLayout() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </>
  );
}

export default AuthenticatedLayout;
