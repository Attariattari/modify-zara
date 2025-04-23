import React, { useContext, useEffect, useState } from "react";
import "./MainCss.css";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import Footer from "../../Footer/Footer";
import Spinner from "../../../Spinner";
import { useWishlist } from "../../../Context/Wishlist";

function DetailsDisplayProduct({ data, loading }) {
  const navigate = useNavigate();
  const { setProductId, wishlistStatus, checkProductInWishlist, isLoading } =
    useWishlist();

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach((product) => {
        if (product._id) {
          checkProductInWishlist(product._id); // ✅ Auto-check for each product
        } else {
          console.warn("Product ID missing:", product); // ❌ Warn if product ID is missing
        }
      });
    }
  }, [data]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (product) => {
    navigate(`/SingleProduct/${product.Name}/${product._id}`);
  };
  const calculateDiscountPercentage = (product) => {
    if (!product?.variations?.[0]?.price) return null;

    const real = Number(product.variations[0].price.real);
    const discount = Number(product.variations[0].price.discount);

    if (!real || !discount || discount >= real) return null;

    return Math.round(((real - discount) / real) * 100);
  };

  return (
    <div className="DetailedProducts">
      {loading || isLoading ? (
        <div className="cart-spinner">
          <Spinner />
        </div>
      ) : (
        <div className="ProductArea cursor-pointer">
          {data.map((product, index) => {
            return (
              <div className="ProductGridView" key={index} title={product.Name}>
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
                    title="Add to Cart"
                    onClick={() => handleNavigate(product)}
                  >
                    <GoPlus />
                  </div>
                </div>
                <div className="Detailed">
                  <div className="DetailedTitleandSVG">
                    <h4 className="Detailedtitle">
                      {product.Name.length > 24
                        ? `${product.Name.substring(0, 24)}...`
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
                            <span className="discount-price text-green-900 font-bold">
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
            );
          })}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default DetailsDisplayProduct;
