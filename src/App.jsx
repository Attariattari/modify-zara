import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { userContext } from "./Context/UserContext.jsx";
import "./App.css";
import ProtectedRoutes from "./Context/ProtectedRoutes.jsx";
import FinalCartProductView from "./Components/FinalCartProductView/FinalCartProductView.jsx";
import SingleProduct from "./Components/NewAllProducts/SingleProductData/SingleProduct.jsx";
import InterCardData from "./Components/PaymentMethod/InterCardData/InterCardData";
import SelectCardsForPay from "./Components/PaymentMethod/SelectCardsForPay.jsx";
import ShoppingBag from "./Components/ShoppingAndWishListBag/ShoppingBag.jsx";
import Address_Conform from "./Components/BillingAddress/Address_Conform";
import Wishlist from "./Components/ShoppingAndWishListBag/Wishlist.jsx";
import Order_Summary from "./Components/Order_Summary/Order_Summary";
import UserOrder from "./Components/UserOrder/UserOrder.jsx";
import Signup from "./Components/LoginSingup/Singup.jsx";
import Login from "./Components/LoginSingup/Login.jsx";
import New from "./Components/NewAllProducts/New.jsx";
import Search from "./Components/Search/Search.jsx";
import Welcome from "./Components/Welcome/Welcome";
import Help from "./Components/Help/Help.jsx";
import Chat from "./Components/Chat/Chat.jsx";
import Home from "./Pages/Home";
import Authanticate from "./Zara_Admin/Authanticate/Authanticate";
import Dashboard from "./Zara_Admin/Home/Dashboard";
import NavLayout from "./Zara_Admin/NavLayout/NavLayout.jsx";
import Product from "./Zara_Admin/Product/Product.jsx";
import User from "./Zara_Admin/User/User.jsx";
import ManageUsers from "./Zara_Admin/Manage Users/ManageUsers.jsx";
import Notification from "./Zara_Admin/Notification/Notification.jsx";
import Messages from "./Zara_Admin/Messages/Messages.jsx";
import FeaturedProduct from "./Zara_Admin/Featured Product/FeaturedProduct.jsx";
import SalesProduct from "./Zara_Admin/Sales Product/SalesProduct.jsx";
import MainCarousel from "./Zara_Admin/Main/MainCarousel.jsx";
import ProductsDetails from "./Zara_Admin/Products Details/ProductsDetails.jsx";
import Catgeory from "./Zara_Admin/Catgeory/Catgeory.jsx";
import AddProducts from "./Zara_Admin/Add Products/AddProducts.jsx";
import ShoppingCart from "./Zara_Admin/Shopping Cart/ShoppingCart.jsx";
import Order from "./Zara_Admin/Order/Order.jsx";
import OrderDetails from "./Zara_Admin/OrderDetails/OrderDetails.jsx";
import Gallery from "./Zara_Admin/Gallery/Gallery";
import Uploadimages from "./Zara_Admin/Gallery/Upload/Uploadimages.jsx";
import OrderSummary from "./Zara_Admin/Home/Order-Summry/OrderSummry.jsx";

function App() {
  const [hasVisited, setHasVisited] = useState(
    localStorage.getItem("visited") === "true"
  );
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { setUser } = useContext(userContext);
  const toggleChatVisibility = () => {
    setIsChatVisible((prevIsChatVisible) => !prevIsChatVisible);
  };

  const toggleChatUnVisibility = () => {
    setIsChatVisible(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setHasVisited(localStorage.getItem("visited") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // UseEffect to handle quick update of isChatVisible state
  useEffect(() => {
    const handleChatToggle = (event) => {
      if (event.detail === "toggleChat") {
        setIsChatVisible((prev) => !prev);
      }
    };

    window.addEventListener("chatToggle", handleChatToggle);

    return () => {
      window.removeEventListener("chatToggle", handleChatToggle);
    };
  }, []);

  const authRoutes = [
    { path: "/Login", element: <Login /> },
    { path: "/Signup", element: <Signup /> },
  ];

  const userRoutes = [
    { path: "/Help", element: <Help /> },
    { path: "/Shopping_Bag", element: <ShoppingBag /> },
    { path: "/Wishlist", element: <Wishlist /> },
    { path: "/User/Order", element: <UserOrder /> },
    { path: "/Search/Products", element: <Search /> },
    { path: "/Address_Conform", element: <Address_Conform /> },
    { path: "/SelectCardsForPay", element: <SelectCardsForPay /> },
    { path: "/InterCardData", element: <InterCardData /> },
    { path: "/Order_Summary", element: <Order_Summary /> },
  ];

  const productRoutes = [
    { path: "/Product/:name/:cid/:csid", element: <New /> },
    { path: "/Product/:name/:cid", element: <New /> },
    { path: "/SingleProduct/:name/:id", element: <SingleProduct /> },
  ];
  const adminRoutes = [
    { path: "Dashboard", element: <Dashboard /> },
    { path: "Gallery", element: <Gallery /> },
    { path: "Gallery/upload", element: <Uploadimages /> },
    { path: "Users", element: <User /> },
    { path: "Manage-Users", element: <ManageUsers /> },
    { path: "Notifications", element: <Notification /> },
    { path: "Messages", element: <Messages /> },
    { path: "Product", element: <Product /> },
    { path: "Featured-Product", element: <FeaturedProduct /> },
    { path: "Sales-Product", element: <SalesProduct /> },
    { path: "Main-Carousel", element: <MainCarousel /> },
    { path: "Category", element: <Catgeory /> },
    { path: "Add-Products", element: <AddProducts /> },
    { path: "Shopping-Cart", element: <ShoppingCart /> },
    { path: "Order", element: <Order /> },
    { path: "Order-Details", element: <OrderDetails /> },
    { path: "Products-Details/:name/:id", element: <ProductsDetails /> },
  ];

  const allowedRoutes = [
    ...userRoutes.map((route) => route.path),
    ...productRoutes.map((route) => route.path),
  ];

  const location = useLocation();

  // Check if the current route matches any allowed routes (handling dynamic routes)
  const isAllowedRoute = useMemo(() => {
    return allowedRoutes.some((route) => {
      const routeRegex = new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`);
      return routeRegex.test(location.pathname);
    });
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={hasVisited ? "/Home" : "/welcome"} replace />}
        />

        {/* Welcome Page */}
        <Route
          path="/welcome"
          element={
            <ProtectedWelcomeRoute redirectTo="/Home">
              <Welcome />
            </ProtectedWelcomeRoute>
          }
        />

        {/* Home Page */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute redirectTo="/welcome">
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        {authRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute redirectTo="/welcome">{element}</ProtectedRoute>
            }
          />
        ))}

        {/* User Routes */}
        {userRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute redirectTo="/welcome">{element}</ProtectedRoute>
            }
          />
        ))}

        {/* Product Routes */}
        {productRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute redirectTo="/welcome">{element}</ProtectedRoute>
            }
          />
        ))}
        <Route path="/Admin/Autanticate" element={<Authanticate />} />
        <Route path="/Admin/*" element={<ProtectedRoutes />}>
          <Route element={<NavLayout />}>
            <Route index element={<Dashboard />} />
            {adminRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path} // Relative path use ho raha hai
                element={
                  <ProtectedRoute redirectTo="/welcome">
                    {element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
        </Route>
      </Routes>
      {hasVisited && isAllowedRoute && (
        <>
          {isChatVisible && (
            <div className="chat-component none">
              <Chat toggleChatUnVisibility={toggleChatUnVisibility} />
            </div>
          )}
          {!isChatVisible && (
            <div className="ChatPopupshow none" onClick={toggleChatVisibility}>
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill="inherit"
                stroke="inherit"
                className="tray__button-icon"
                aria-label="_tray-icon_"
                alt="tray-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.7 3.7h16.6v13h-8.14L7.3 20.172V16.7H3.7v-13Zm1 1v11h3.6v2.528l3.54-2.528h7.46v-11H4.7Z"
                ></path>
              </svg>
              <span className="text-gray-400">Chat</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProtectedRoute({ children, redirectTo }) {
  const hasVisited = localStorage.getItem("visited") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasVisited) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasVisited, navigate, redirectTo]);

  return hasVisited ? children : null;
}

function ProtectedWelcomeRoute({ children, redirectTo }) {
  const hasVisited = localStorage.getItem("visited") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    if (hasVisited) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasVisited, navigate, redirectTo]);

  return !hasVisited ? children : null;
}

export default App;
