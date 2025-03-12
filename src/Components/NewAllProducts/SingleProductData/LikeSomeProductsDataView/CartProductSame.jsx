import React, { useContext, useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { userContext } from "../../../../Context/UserContext";
import { useWishlist } from "../../../../Context/Wishlist";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../Spinner";
function CartProductSame({ product }) {
  const { setProductId, wishlistStatus, checkProductInWishlist, isLoading } =
    useWishlist();
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
  });
  const { token } = useContext(userContext);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    if (!product?._id) return;

    setState((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.get(
        `http://localhost:1122/Product/product/${product._id}/related`,
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setState((prevState) => ({
        ...prevState,
        data: Array.isArray(response.data) ? response.data : [],
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message,
      }));
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [product]);
  useEffect(() => {
    if (state.data.length > 0) {
      state.data.forEach((item) => {
        if (item._id) {
          checkProductInWishlist(item._id);
        }
      });
    }
  }, [state.data]);

  const handleNavigate = (product) => {
    navigate(`/SingleProduct/${product.Name}/${product._id}`);
  };

  return (
    <div className="YOU_MAY_LIKE">
      <p>YOU MAY ALSO LIKE</p>
      <div className="DetailedProducts relative">
        {state.loading ? (
          <div className="w-full h-{200px} absolute top-0 left-0 flex items-center justify-center bg-white/10 backdrop-blur-xl">
            <Spinner />
          </div>
        ) : (
          <div className="CartProductArea  cursor-pointer">
            {state.data.map((product, index) => (
              <div className="ProductGridView" key={index}>
                <div className="Productproductimage">
                  <img src={product.MainImage} alt="" />
                </div>
                <div className="CartButtonArea">
                  <div
                    className="AddToCartIcon"
                    onClick={() => handleNavigate(product)}
                  >
                    <GoPlus />
                  </div>
                </div>
                <div className="Detailed">
                  <div className="DetailedTitleandSVG">
                    <h4>
                      {product.Name.length > 25
                        ? `${product.Name.substring(0, 25)}...`
                        : product.Name}
                    </h4>
                    {wishlistStatus[product._id] ? (
                      <svg
                        className="wishlist-icon wishlist-icon--productDetail"
                        preserveAspectRatio="xMidYMid slice"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="var(--text-color)"
                        stroke="inherit"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Product already in wishlist!");
                        }}
                      >
                        <title>Product already in wishlist</title>{" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 15.238L17 20V4H7v16l5-4.762z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="wishlist-icon wishlist-icon--productDetail"
                        preserveAspectRatio="xMidYMid slice"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="var(--text-color)"
                        stroke="inherit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductId(product._id);
                        }}
                      >
                        <title>Add to Wishlist</title>{" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 15.238L17 20V4H7v16l5-4.762zm-4 2.429l4-3.81 4 3.81V5H8v12.667z"
                        ></path>
                      </svg>
                    )}
                  </div>
                  <div className="PriceSection space-x-3">
                    {product.variations?.[0] && (
                      <div className="price flex gap-2">
                        {product.variations[0].price.discount > 0 &&
                        product.variations[0].price.discount <
                          product.variations[0].price.real ? (
                          <>
                            <span className="discount-price text-red-500 font-bold">
                              Rs. {product.variations[0].price.discount}
                            </span>
                            <span
                              className="original-price line-through"
                              style={{ color: "var(--text-color)" }}
                            >
                              Rs. {product.variations[0].price.real}
                            </span>
                          </>
                        ) : (
                          <span className="original-price font-bold">
                            Rs. {product.variations[0].price.real}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CartProductSame;
