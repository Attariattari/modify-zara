import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userContext } from "../Context/UserContext";
import axios from "axios";

const ProtectedRoutes = () => {
  const { setUser, token, setAdmin } = useContext(userContext);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const checkTokenValidity = async () => {
      try {
        const response = await axios.post(
          "http://localhost:1122/user/checkToken",
          {},
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setIsAuthenticated(true);
        } else {
          throw new Error("Token is invalid or expired");
        }
      } catch (error) {
        console.error("Token check failed:", error.message);
        handleLogout();
        setIsAuthenticated(false);
      }
    };

    const handleLogout = () => {
      setUser(null);
      setAdmin(null);
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      document.cookie = "token=; Max-Age=0; path=/;";
    };

    checkTokenValidity();
  }, [token, setUser, setAdmin]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/Admin/Autanticate" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
