import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Popup from "reactjs-popup";
import "./css.css";
import "reactjs-popup/dist/index.css";
import axios from "axios";
import Spinner from "../../../Spinner";

const Cartpopup = ({ productid, cartPopup, closePopup }) => {
  const [state, setState] = useState({
    product: null,
    loading: false, // Add loading state
    error: null,
  });

  const getproduct = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true, // Set loading to true before fetching data
    }));

    try {
      const response = await axios.get(
        `http://localhost:1122/product/${productid}`
      );
      if (response.status === 200) {
        setState({
          product: response.data, // Store product data
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        product: null,
        loading: false,
        error: "Failed to fetch product. Please try again.",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (productid) {
      getproduct(); // Fetch product only if productid is available
    }
  }, [productid]);

  return (
    <Popup
      open={cartPopup}
      onClose={closePopup}
      destroyOnClose={false}
      closeOnDocumentClick
      modal
      lockScroll
      overlayClassName="popup-overlay"
      contentStyle={{
        padding: "0",
        background: "transparent",
        border: "none",
        width: "auto",
        boxShadow: "none",
      }}
    >
      <div className="Cart-popup">
        <button title="Close Cart Popup" onClick={closePopup}>
          <MdClose />
        </button>
        <div className="Cartpopup-content-data">
          {state.loading ? ( // Show loading spinner or message while fetching
            <div className="loading">
              <Spinner />
            </div>
          ) : state.error ? ( // Show error message if fetching fails
            <div className="error">{state.error}</div>
          ) : state.product ? ( // Display product details if available
            <div className="Cartpopup-content-area">
              <h2>{state.product.Name}</h2> {/* Product Name */}
              <img
                src={state.product.MainImage} // Product Main Image
                alt={state.product.name}
                className="product-main-image h-52"
              />
              <p>{state.product.description}</p> {/* Product Description */}
            </div>
          ) : (
            <div>No product details available.</div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default Cartpopup;
