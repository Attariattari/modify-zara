import React, { useContext, useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { userContext } from "../../../../Context/UserContext";
import { useWishlist } from "../../../../Context/Wishlist";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../Spinner";
import { useProductContext } from "../../../../Context/ProductContext";
function LikeSameWithProductData({ product }) {
  const { setProductId, wishlistStatus, checkProductInWishlist, isLoading } =
    useWishlist();
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
  });
  const { token } = useContext(userContext);
  const { fetchRelatedProducts, Relateddata, Relatedloading, loading } =
    useProductContext();
  const productId = product?._id;

  useEffect(() => {
    if (productId) {
      fetchRelatedProducts();
      Relateddata;
    }
  }, [productId]);
  useEffect(() => {
    if (productId) {
      fetchRelatedProducts(productId);
    }
  }, [productId]);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Page load ya refresh pe top pe scroll karega
  }, []);

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
    if (Relatedloading || isLoading || loading) return;

    if (Relateddata.length > 0) {
      Relateddata.forEach((item) => {
        if (item._id) {
          checkProductInWishlist(item._id);
        }
      });
    }
  }, [Relateddata, Relatedloading, isLoading, loading]);

  const handleNavigate = (product) => {
    navigate(`/SingleProduct/${product.Name}/${product._id}`);
  };
  const calculateDiscountPercentage = (product) => {
    if (!product?.variations?.[0]?.price) return null; // Agar price nahi mila toh return null

    const { real, discount } = product.variations[0].price;

    if (!real || !discount || discount >= real) return null; // Agar discount na ho ya galat ho

    return Math.round(((real - discount) / real) * 100);
  };
  return (
    <div className="YOU_MAY_LIKE">
      <p>YOU MAY ALSO LIKE</p>
      <div className="DetailedProducts relative">
        {isLoading && (
          <div className="w-full p-10  flex justify-center items-center">
            <Spinner />
          </div>
        )}
        {Relatedloading || isLoading || loading ? (
          <div className="w-full p-10  flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="ProductArea  cursor-pointer">
            {Relateddata.map((product, index) => (
              <div className="ProductGridView" key={index}>
                <div className="Productproductimage">
                  <img src={product.MainImage} alt="" />
                  {product.variations?.[0]?.price?.discount > 0 &&
                    product.variations[0].price.discount <
                      product.variations[0].price.real && (
                      <div className="Discount-show">
                        {calculateDiscountPercentage(product)}%
                      </div>
                    )}
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

export default LikeSameWithProductData;
