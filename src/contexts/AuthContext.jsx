import React, { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import bcrypt from "bcryptjs";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = sessionStorage.getItem("hr_portal_session");
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const users = await api.get(`/users?email=${email}`);

      if (users.length > 0) {
        const authUser = users[0];

        const isMatched = await bcrypt.compare(password, authUser.password);

        if (isMatched) {
          const profile = await api.get(`/employees/${authUser.employeeId}`);

          const sessionData = {
            id: authUser.id,
            role: authUser.role,
            email: authUser.email,
            profile: profile,
          };

          sessionStorage.setItem(
            "hr_portal_session",
            JSON.stringify(sessionData),
          );

          if (rememberMe) {
            localStorage.setItem("hr_portal_remember", email);
          } else {
            localStorage.removeItem("hr_portal_remember");
          }

          setUser(sessionData);
          return { success: true, role: sessionData.role };
        } else {
          return { success: false, message: "Invalid email or password" };
        }
      }
      return { success: false, message: "Invalid email or password" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error connecting to server" };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("hr_portal_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
