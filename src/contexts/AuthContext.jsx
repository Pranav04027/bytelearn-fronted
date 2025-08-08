import { createContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginUser, logoutUser, refreshAccessToken } from "../api/auth.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      await loginUser(credentials); // just sets cookies
      // Now fetch user info
      const response = await fetchCurrentUser();
      setUser(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  const fetchCurrentUserData = async () => {
    try {
      const response = await fetchCurrentUser();
      setUser(response.data);
    } catch (err) {
      // If unauthorized, try refreshing token then retry once
      if (err?.statusCode === 401 || err?.status === 401) {
        try {
          await refreshAccessToken();
          const response = await fetchCurrentUser();
          setUser(response.data);
        } catch (refreshErr) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;