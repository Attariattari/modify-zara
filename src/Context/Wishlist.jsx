import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2"; // ✅ Import SweetAlert
import { userContext } from "./UserContext";
import "sweetalert2/dist/sweetalert2.min.css";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlists, setWishlists] = useState([]); // ✅ Naya state
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState(null);
  const { token } = useContext(userContext);

  // ✅ Check if product is in wishlist
  // const checkProductInWishlist = async (productId) => {
  //   if (!productId) return;

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:1122/Wishlist/check-product",
  //       { productId },
  //       {
  //         headers: { Authenticate: `Bearer ${token}` },
  //         withCredentials: true,
  //       }
  //     );

  //     setWishlistStatus((prev) => ({
  //       ...prev,
  //       [productId]: response.data.isInWishlist,
  //     }));

  //     toast.success("Wishlist status updated! ✅");
  //   } catch (error) {
  //     toast.error(error.response?.data?.error || "Something went wrong!");
  //   } finally {
  //   }
  // };
  const checkProductInWishlist = async (productIds) => {
    if (!productIds || productIds.length === 0) return;

    try {
      const response = await axios.post(
        "http://localhost:1122/Wishlist/check-product",
        { productId: productIds }, // Send array
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Pehle se koi toast show ho raha ho to hata do
      toast.dismiss("wishlist-toast");

      if (response.data.success) {
        const updatedStatus = response.data.products.reduce(
          (acc, { productId, isInWishlist }) => {
            acc[productId] = isInWishlist;
            return acc;
          },
          {}
        );

        // Ek hi dafa state update hogi
        setWishlistStatus((prev) => ({ ...prev, ...updatedStatus }));
      } else {
      }
    } catch (error) {}
  };

  // ✅ Wishlist ka naam aur ID fetch karna
  const getAllWishlists = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:1122/Wishlist/getWishlist",
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (!response.data || !response.data.wishlists) {
        console.error("Wishlist data is missing in API response!");
        return;
      }

      setWishlists(response.data.wishlists); // ✅ Wishlists ka naam aur ID store ho raha hai
    } catch (error) {
      console.error("Error Fetching Wishlists:", error);
      toast.error(error.response?.data?.error || "Failed to fetch wishlists!");
    } finally {
      setIsLoading(false);
    }
  };

  const getWishlist = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("http://localhost:1122/Wishlist/get", {
        headers: { Authenticate: `Bearer ${token}` },
        withCredentials: true,
      });

      // ✅ Backend ke structure ke mutabiq data extract kar rahe hain
      const wishlistData = response.data?.wishlist?.products;

      if (!wishlistData || wishlistData.length === 0) {
        console.log("No items found in wishlist!");
        setWishlistItems([]); // Agar wishlist empty ho to bhi state update ho
        return;
      }

      setWishlistItems(wishlistData); // ✅ Sirf products ko store karna hai
    } catch (error) {
      console.error("Error Fetching Wishlist:", error);
      toast.error(error.response?.data?.error || "Failed to fetch wishlist!");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Add product to wishlist
  useEffect(() => {
    if (!productId) return;

    const addToWishlist = async () => {
      setIsLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:1122/Wishlist/add",
          { productId },
          {
            headers: {
              Authenticate: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setWishlistStatus((prev) => ({
          ...prev,
          [productId]: true,
        }));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product added to wishlist successfully!",
        });

        getWishlist(); // ✅ Refresh wishlist after adding
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to add product to wishlist. Please try again.",
        });
      } finally {
        setIsLoading(false);
        setProductId(null);
      }
    };

    addToWishlist();
  }, [productId]);

  // ✅ Wishlist ko default set karna
  const setDefaultWishlist = async (wishlistId) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `http://localhost:1122/Wishlist/${wishlistId}/setDefault`,
        {},
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // ✅ Check agar wishlist already default thi to info alert show karein
      if (
        response.data.message === "This wishlist is already set as default."
      ) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: response.data.message,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
      }

      // ✅ Wishlists dobara fetch karna taake UI update ho
      getAllWishlists();
    } catch (error) {
      console.error("Error setting default wishlist:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to set default wishlist!",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const createWishlist = async (name) => {
    if (!name) {
      return toast.error("Wishlist name is required!");
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:1122/Wishlist/Create",
        { name },
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Wishlist Created",
        text: response.data.message,
      });

      getAllWishlists(); // ✅ Wishlists ko refresh karna taake naye wishlist UI me show ho
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create wishlist!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    if (productId) {
      checkProductInWishlist(productId);
    }

    getWishlist(); // ✅ Fetch wishlist on mount
    getAllWishlists(); // ✅ Fetch all wishlists
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistStatus,
        wishlistItems,
        checkProductInWishlist,
        getWishlist,
        wishlists,
        setDefaultWishlist,
        isLoading, // ✅ Now properly handling loading
        setProductId,
        createWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
