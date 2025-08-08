import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const Layout = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                ByteLearn
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Videos
                </Link>
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.fullname}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700">{user.fullname}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
