import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { userContext } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [Loading, setLoading] = useState(false);
  const { token } = useContext(userContext);

  // ✅ Common function for Swal alerts
  const showAlert = (type, title, text, timer = 1500) => {
    Swal.fire({
      icon: type,
      title,
      text,
      showConfirmButton: type !== "success",
      timer: type === "success" ? timer : undefined,
    });
  };

  // ✅ Handle API Request with error handling
  const handleRequest = async (apiCall, successMsg, callback) => {
    setLoading(true);
    try {
      const response = await apiCall();
      if (response.status === 200 || response.status === 201) {
        showAlert("success", "✅ Success", successMsg);
        callback && callback(response.data);
      } else {
        showAlert("error", "❌ Failed", "Something went wrong! Try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      showAlert(
        "error",
        "❌ Error",
        error.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };
  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:1122/CartProduct/getallcart",
        {
          headers: {
            Authenticate: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCart(response.data || []);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // ✅ Cart empty kar do error pr
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // ✅ Add to Cart
  const addToCart = (product, activeVariation, selectedSize) => {
    handleRequest(
      () =>
        axios.post(
          "http://localhost:1122/CartProduct/add",
          {
            product: product?._id,
            variationId: activeVariation?._id,
            size: selectedSize || null,
          },
          {
            headers: { Authenticate: `Bearer ${token}` },
            withCredentials: true,
          }
        ),
      "Product added to cart successfully!",
      getCart
    );
  };

  // ✅ Update Cart Quantity
  const updateCartQuantity = (productId, quantity, size) => {
    if (quantity < 1) {
      showAlert(
        "error",
        "❌ Invalid Quantity",
        "Quantity cannot be less than 1."
      );
      return;
    }

    handleRequest(
      () =>
        axios.put(
          "http://localhost:1122/CartProduct/update_cart_quantity",
          { product: productId, size, quantity },
          {
            headers: { Authenticate: `Bearer ${token}` },
            withCredentials: true,
          }
        ),
      "Cart updated successfully!",
      getCart
    );
  };

  // ✅ Remove From Cart
  const removeFromCart = (productId, size) => {
    handleRequest(
      () =>
        axios.delete("http://localhost:1122/CartProduct/remove", {
          data: { product: productId, size },
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }),
      `Size ${size} removed from cart successfully!`,
      getCart
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getCart,
        updateCartQuantity,
        removeFromCart,
        Loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Custom hook for using cart context
export const useCart = () => useContext(CartContext);

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";
// import { userContext } from "./UserContext";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [Loading, setLoading] = useState(false);
//   const { token } = useContext(userContext);

//   // ✅ Get Cart API
//   const getCart = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         "http://localhost:1122/CartProduct/getallcart",
//         {
//           headers: {
//             Authenticate: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         setCart(response.data || []);
//       } else {
//         setCart([]);
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       setCart([]); // ✅ Cart empty kar do error pr
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Auto Fetch Cart on Mount
//   useEffect(() => {
//     getCart();
//   }, []);

//   const addToCart = async (product, activeVariation, selectedSize) => {
//     setLoading(true);
//     window.scrollTo(0, 0);

//     const requestData = {
//       product: product?._id,
//       variationId: activeVariation?._id,
//       size: selectedSize || null,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:1122/CartProduct/add",
//         requestData,
//         {
//           headers: {
//             Authenticate: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         Swal.fire({
//           icon: "success",
//           title: "🛍️ Success!",
//           text: "Product added to cart successfully!",
//           showConfirmButton: true,
//           timer: 1500,
//         });

//         // ✅ Add to Cart ke baad Get Cart API Call karo
//         getCart();
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "❌ Failed",
//           text: "Something went wrong! Try again.",
//           showConfirmButton: true,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "❌ Error",
//         text: "Unable to add product. Try again!",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Update Cart Quantity Function (Real-Time)
//   const updateCartQuantity = async (productId, quantity, size) => {
//     if (quantity < 1) {
//       Swal.fire({
//         icon: "error",
//         title: "❌ Invalid Quantity",
//         text: "Quantity cannot be less than 1.",
//         showConfirmButton: true,
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.put(
//         "http://localhost:1122/CartProduct/update_cart_quantity",
//         { product: productId, size, quantity },
//         {
//           headers: {
//             Authenticate: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "✔ Updated!",
//           text: "Cart updated successfully!",
//           showConfirmButton: false,
//           timer: 1000,
//         });

//         // ✅ Real-time update without API call
//         setCart((prevCart) => ({
//           ...prevCart,
//           items: prevCart.items.map((item) =>
//             item.product === productId && item.size === size
//               ? { ...item, quantity }
//               : item
//           ),
//         }));

//         getCart(); // ✅ Latest cart fetch karo
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "❌ Failed",
//           text: "Something went wrong! Try again.",
//           showConfirmButton: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error updating cart:", error);
//       Swal.fire({
//         icon: "error",
//         title: "❌ Error",
//         text: "Unable to update cart. Try again!",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Remove From Cart Function
//   const removeFromCart = async (productId, size) => {
//     setLoading(true);
//     try {
//       const response = await axios.delete(
//         `http://localhost:1122/CartProduct/remove`,
//         {
//           data: { product: productId, size }, // ✅ Ab size bhi send hoga
//           headers: {
//             Authenticate: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "🛒 Removed!",
//           text: `Size ${size} removed from cart successfully!`,
//           showConfirmButton: true,
//           timer: 1500,
//         });

//         getCart(); // ✅ Remove ke baad Cart Refresh
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "❌ Failed",
//           text: "Unable to remove product. Try again.",
//           showConfirmButton: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error removing product from cart:", error);
//       Swal.fire({
//         icon: "error",
//         title: "❌ Error",
//         text: "Failed to remove product from cart.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         getCart,
//         updateCartQuantity,
//         removeFromCart,
//         Loading,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook for using cart context
// export const useCart = () => useContext(CartContext);
