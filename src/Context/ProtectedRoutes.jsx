import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userContext } from "../Context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";

import Spinner from "../Spinner";

const ProtectedRoutes = () => {
  const { user, setUser, token, setAdmin, checkUserDetailsById } =
    useContext(userContext);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    console.log(user._id, "User ID from context");

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
        setIsAuthenticated(false);
      }
    };

    checkTokenValidity();
  }, [token, setUser, setAdmin]);

  useEffect(() => {
    if (user && user._id) {
      checkUserDetailsById(user._id).then((data) => {
        if (data?.pageRoll === 1) {
          setAdmin(true);
          setIsAuthenticated(true);
        } else {
          setAdmin(false);
          setIsAuthenticated(false);

          // SweetAlert instead of alert
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You are not authorized to access the admin dashboard.",
            confirmButtonColor: "#d33",
            confirmButtonText: "Okay",
          });
        }
      });
    }
  }, [user, checkUserDetailsById]);

  if (isAuthenticated === null) {
    return (
      <div className="cart-spinner">
        <span className="text-lg font-semibold">
          <Spinner />
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/Admin/Autanticate" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
