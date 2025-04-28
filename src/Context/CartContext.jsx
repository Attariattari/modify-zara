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

  const addToCart = (product, activeVariation, selectedSize, onSuccess) => {
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
      (data) => {
        getCart(); // ✅ Cart update karo
        if (onSuccess) onSuccess(); // ✅ Callback trigger karo
      }
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
    console.log("Removing from cart:", productId, size);
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
