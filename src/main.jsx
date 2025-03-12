import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserContextWrapper from "./Context/UserContextWrapper.jsx";
import { MeasureProvider } from "./Context/Drawer_state_controller.jsx";
import { ThemeProvider } from "./Zara_Admin/Context/ThemeContext.jsx";
import { SidebarProvider } from "./Zara_Admin/Context/SidebarContext.jsx";
import { WishlistProvider } from "./Context/Wishlist.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import { ProductProvider } from "./Context/ProductContext.jsx";
import { AddressProvider } from "./Context/AddressContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextWrapper>
      <ThemeProvider>
        <ProductProvider>
          <MeasureProvider>
            <SidebarProvider>
              <WishlistProvider>
                <CartProvider>
                  <AddressProvider>
                    <App />
                  </AddressProvider>
                </CartProvider>
              </WishlistProvider>
            </SidebarProvider>
          </MeasureProvider>
        </ProductProvider>
      </ThemeProvider>
    </UserContextWrapper>
  </React.StrictMode>
);
// {" "}
//                   <ToastContainer
//                     position="top-right"
//                     autoClose={3000}
//                     hideProgressBar={false}
//                     newestOnTop={true}
//                     closeOnClick
//                     rtl={false}
//                     pauseOnFocusLoss={false}
//                     draggable={false}
//                     pauseOnHover={false}
//                     closeButton={false} // ✅ Close button removed
//                     toastStyle={{
//                       borderRadius: "10px",
//                       boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
//                       fontFamily: "Poppins, sans-serif",
//                       padding: "10px",
//                       background: "#000", // ✅ Black Background
//                       color: "#fff", // ✅ White Text
//                     }}
//                     bodyStyle={{
//                       fontSize: "14px",
//                       fontWeight: "500",
//                     }}
//                     style={{
//                       zIndex: 9999,
//                     }}
//                   />
