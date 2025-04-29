import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

export const userContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : { firstname: "" };
    } catch (e) {
      console.error("Error parsing stored user:", e);
      return { firstname: "" };
    }
  });

  const [Admin, setAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem("admin");
      return storedAdmin && storedAdmin !== "undefined"
        ? JSON.parse(storedAdmin)
        : null;
    } catch (e) {
      console.error("Error parsing stored admin:", e);
      return null;
    }
  });

  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [token, setToken] = useState(null);
  const logoutTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (Admin) {
      checkTokenValidity();
      fetchUserData(); // Fetch user data immediately after setting Admin
    }
  }, [Admin]);

  const handleLogout = async () => {
    try {
      setLoading(true); // 🔵 Start loading
      console.log("🔵 Starting logout process...");

      const response = await axios.post(
        "http://localhost:1122/user/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        console.log("✅ Backend logout successful.");

        // Clear frontend states and storage
        setAdmin(null);
        setToken(null);
        setUser(null);
        setIsTokenValid(false);

        localStorage.removeItem("user");
        localStorage.removeItem("admin");

        Cookies.remove("token", { path: "/" });
        Cookies.remove("userId", { path: "/" });

        console.log("✅ Frontend logout cleanup done.");

        // Redirect to login or home
        navigate("/login", { replace: true });
      } else {
        console.error("❌ Backend logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setLoading(false); // 🔵 Always stop loading, success or error dono case me
    }
  };

  const scheduleAutoLogout = (time) => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    logoutTimeoutRef.current = setTimeout(() => {
      handleLogout();
    }, time);
  };

  const checkTokenValidity = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:1122/user/checkToken",
        {},
        { withCredentials: true }
      );
      if (response.data.status !== "success") {
        throw new Error("Token is invalid or expired");
      }
      scheduleAutoLogout(response.data.expiresIn);
      setIsTokenValid(true);
    } catch (error) {
      console.error("Token check failed:", error.message);
      setIsTokenValid(false);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (passedToken) => {
    const effectiveToken = passedToken || token; // Use passedToken if available
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:1122/user/getUserInfo",
        {},
        {
          headers: { Authenticate: `Bearer ${effectiveToken}` },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        const userId = response.data.userId;
        const newToken = response.data.token;
        setToken(newToken); // update the token in context

        const userDataResponse = await axios.get(
          `http://localhost:1122/user/Auth/${userId}`,
          {
            headers: { Authenticate: `Bearer ${newToken}` },
            withCredentials: true,
          }
        );

        if (userDataResponse.data.status === "success") {
          setUser(userDataResponse.data.user);
          localStorage.setItem(
            "user",
            JSON.stringify(userDataResponse.data.user)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserDetailsById = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:1122/user/checkDetailsID",
        {
          userId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("User ID check failed", error);
      throw new Error("Failed to check user details. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (Admin) {
      const tokenCheckInterval = setInterval(checkTokenValidity, 3600000); // Check token every 1 hour
      return () => clearInterval(tokenCheckInterval);
    }
  }, [Admin]);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        Admin,
        setAdmin,
        authError,
        setAuthError,
        fetchUserData,
        loading,
        setLoading,
        handleLogout,
        scheduleAutoLogout,
        isTokenValid,
        token,
        checkUserDetailsById,
      }}
    >
      {loading ? (
        <div className="overlay">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </userContext.Provider>
  );
}
