import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b bg-white">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sentinel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Hi, {user?.name}</span>
          <button
            onClick={() => logout()}
            className="text-sm text-blue-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
