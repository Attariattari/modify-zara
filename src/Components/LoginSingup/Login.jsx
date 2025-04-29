import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { userContext } from "../../Context/UserContext.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import Spinner from "../../Spinner.jsx";

function validateEmail(value) {
  let error;
  if (!value) {
    error = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}

function validatePassword(value) {
  let error;
  if (value.length < 6) {
    error = "Invalid Password!";
  }
  return error;
}

export default function Login() {
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, setAdmin, fetchUserData, token } = useContext(userContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // ✅ Hook used here
  const location = useLocation(); // ✅ useLocation to get the previous route
  const from = location.state?.from?.pathname || "/";
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      console.log("🔵 Starting login process for:", values.email);

      const checkAdminDetails = async (email) => {
        try {
          console.log("🔵 Checking admin details for:", email);
          const response = await axios.post(
            "http://localhost:1122/user/checkDetails",
            { email }
          );
          console.log("✅ Admin details response:", response.data);
          return response.data;
        } catch (error) {
          console.error("❌ Admin check failed", error);
          throw new Error("Failed to check admin details. Please try again.");
        }
      };

      console.log("🔵 Authenticating user...");
      const response = await axios.post(
        "http://localhost:1122/user/authenticate",
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );

      const { token, user } = response.data;
      console.log("✅ Authentication successful:", user);

      // ✅ Store token in cookies
      document.cookie = `token=${token}; path=/`;
      console.log("✅ Token stored in cookies.");

      // ✅ Set user in context
      setUser(user);

      // ✅ Always fetch fresh user data (admin or not)
      await fetchUserData();

      // ✅ Check admin status
      const adminDetails = await checkAdminDetails(values.email);
      if (adminDetails.status === "success" && adminDetails.pageRoll === 1) {
        setAdmin(adminDetails);
        localStorage.setItem("admin", JSON.stringify(adminDetails));
        console.log("✅ User is an admin. Admin details set:", adminDetails);
      } else {
        console.log("ℹ️ User is not an admin.");
      }

      // ✅ Redirect to previous route or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleAutoFill = () => {
      const form = document.getElementById("LoginForm");
      const inputs = form.querySelectorAll("input");

      const allFieldsFilled = Array.from(inputs).every(
        (input) => input.value !== ""
      );

      if (allFieldsFilled) {
        setFocusedEmail("true");
        setFocusedPassword("true");
      }
    };

    // Listen for changes in the form
    const form = document.getElementById("LoginForm");
    form.addEventListener("change", handleAutoFill);

    // Clean up event listener
    return () => {
      form.removeEventListener("change", handleAutoFill);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const delayTime = 0; // 1 second delay

    const timer = setTimeout(() => {
      if (token) {
        const returnPath = location.state?.from || "/";
        navigate(returnPath);
      }
    }, delayTime);

    return () => clearTimeout(timer);
  }, [token, navigate, location]);
  return (
    <div className="">
      <div
        className="sticky top-0 z-10"
        style={{
          marginTop: "-9px",
        }}
      >
        <div
          className="absolute w-full"
          style={{ backgroundColor: "var(--bg-color)" }}
        >
          <Navbar />
        </div>
      </div>{" "}
      <div className="login">
        {loading ? (
          <div className="cart-spinner">
            <span className="text-lg font-semibold">
              <Spinner />
            </span>
          </div>
        ) : (
          <>
            <Formik
              initialValues={{
                password: "",
                email: "",
              }}
              onSubmit={(values) => {
                handleLogin(values);
              }}
            >
              <Form>
                <div className="loginarea" id="LoginForm">
                  <p className="logintext font-extralight">
                    LOG IN TO YOUR ACCOUNT
                  </p>

                  <div
                    className={`mb-4 relative ${
                      errors.email ? "border-b-1 border-red-500" : "border-b-1"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-xs transition-all duration-150 " +
                        (!focusedEmail ? "-z-10 top-5" : "")
                      }
                    >
                      Email
                    </label>
                    <Field
                      className="pt-5 pb-2 outline-none w-full text-xs"
                      name="email"
                      type="email"
                      placeholder={!focusedEmail ? "Email" : ""}
                      onFocus={() => setFocusedEmail(true)}
                      onBlur={(ev) => {
                        if (ev.target.value.length === 0)
                          setFocusedEmail(false);
                        setErrors({
                          ...errors,
                          email: validateEmail(ev.target.value),
                        });
                      }}
                      style={{
                        borderBottom: errors.email
                          ? "1px solid red"
                          : "1px solid var(--border-color)",
                        color: "var(--text-color)",
                        backgroundColor: "var(--bg-color)",
                      }}
                    />
                    {errors.email && (
                      <div className="text-red-500 text-xs absolute">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div
                    className={`mb-4 relative ${
                      errors.password
                        ? "border-b-1 border-red-500"
                        : "border-b-1"
                    }`}
                    style={{
                      color: "var=--text-color",
                      backgroundColor: "var(--bg-color)",
                    }}
                  >
                    <label
                      className={
                        "absolute mb-3 text-xs transition-all duration-150 " +
                        (!focusedPassword ? "-z-10 top-5" : "")
                      }
                      style={{
                        color: "var=--text-color",
                        backgroundColor: "var(--bg-color)",
                      }}
                    >
                      Password
                    </label>
                    <Field
                      className="pt-5 pb-2 outline-none w-full text-xs"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={!focusedPassword ? "Password" : ""}
                      onFocus={() => setFocusedPassword(true)}
                      onBlur={(ev) => {
                        if (ev.target.value.length === 0)
                          setFocusedPassword(false);
                        setErrors({
                          ...errors,
                          password: validatePassword(ev.target.value),
                        });
                      }}
                      style={{
                        borderBottom: errors.password
                          ? "1px solid red"
                          : "1px solid var(--border-color)",
                        color: "var(--text-color)",
                        backgroundColor: "var(--bg-color)",
                      }}
                    />
                    {showPassword ? (
                      <IoIosEyeOff
                        className="absolute right-0 top-6 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <IoIosEye
                        className="absolute right-0 top-6 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                    {errors.password && (
                      <div className="text-red-500 text-xs absolute">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <button className="Loginbutton" type="submit">
                    LOG IN
                  </button>
                  <div className="Fogotten">
                    <Link to="#">Have you forgotten your password?</Link>
                  </div>
                </div>
              </Form>
            </Formik>
            <div className="singuparea">
              <p className="singuptext font-extralight uppercase">
                do you need an account?
              </p>
              <Link className="Registerbutton" to="/Signup">
                REGISTER
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
