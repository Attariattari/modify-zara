import { createContext, useContext, useState } from "react";
import axios from "axios";
import { userContext } from "./UserContext";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [state, setState] = useState({
    data: [],
    Newdata: [],
    singledata: null,
    Relateddata: [],
    Relatedloading: false,
    loading: false,
    error: null,
  });

  const { token } = useContext(userContext);

  const fetchProducts = async () => {
    setState((prevState) => ({ ...prevState, loading: true, data: [] }));

    try {
      const { data } = await axios.get(
        "http://localhost:1122/Product/carousel-products",
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setState((prevState) => ({
        ...prevState,
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data?.message || error.message
      );

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.message || error.message,
      }));
    }
  };

  const fetchNewProducts = async (cid, csid) => {
    if (!cid) return;

    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const { data } = await axios.get(
        csid
          ? `http://localhost:1122/Product/Category/${cid}/${csid}`
          : `http://localhost:1122/Product/products/new/${cid}`,
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setState((prevState) => ({
        ...prevState,
        Newdata: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error(
        "Error fetching new products:",
        error.response?.data?.message || error.message
      );

      setState((prevState) => ({
        ...prevState,
        loading: false,
        Newdata: [],
        error: error.response?.data?.message || error.message,
      }));
    }
  };

  const fetchSingleProduct = async (id) => {
    if (!id) {
      console.error("Error: Product ID is missing");
      return;
    }

    setState((prevState) => ({
      ...prevState,
      singledata: null,
      Relateddata: [],
      loading: true,
    }));

    try {
      const { data } = await axios.get(`http://localhost:1122/Product/${id}`, {
        headers: { Authenticate: `Bearer ${token}` },
        withCredentials: true,
      });

      setState((prevState) => ({
        ...prevState,
        singledata: data || null,
        loading: false,
        error: null,
      }));

      fetchRelatedProducts(id);
    } catch (error) {
      console.error(
        "Error fetching single product:",
        error.response?.data?.message || error.message
      );

      setState((prevState) => ({
        ...prevState,
        singledata: null,
        loading: false,
        error: error.response?.data?.message || error.message,
      }));
    }
  };

  const fetchRelatedProducts = async (productId) => {
    if (!productId) return;

    setState((prevState) => ({
      ...prevState,
      Relatedloading: true,
    }));

    try {
      const { data } = await axios.get(
        `http://localhost:1122/Product/product/${productId}/related`,
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setState((prevState) => ({
        ...prevState,
        Relateddata: Array.isArray(data) ? data : [],
        Relatedloading: false,
      }));
    } catch (error) {
      console.error(
        "Error fetching related products:",
        error.response?.data?.message || error.message
      );

      setState((prevState) => ({
        ...prevState,
        Relateddata: [],
        Relatedloading: false,
        error: error.response?.data?.message || error.message,
      }));
    }
  };

  return (
    <ProductContext.Provider
      value={{
        ...state,
        fetchProducts,
        fetchNewProducts,
        fetchSingleProduct,
        fetchRelatedProducts,
        Relatedloading: state.Relatedloading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook taake easily context use kar sakein
const useProductContext = () => {
  return useContext(ProductContext);
};

export { ProductProvider, useProductContext };
