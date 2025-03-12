import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import "./Css.css";
import { useNavigate } from "react-router-dom";
import LikeSameWithProductData from "../../NewAllProducts/SingleProductData/LikeSomeProductsDataView/LikeSameWithProductData";
import Spinner from "../../../Spinner";
function WishlistProducts({ wishlistItem, isLoading }) {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0); // Page load ya refresh pe top pe scroll karega
  }, []);
  const handleNavigate = (product) => {
    navigate(`/SingleProduct/${product.Name}/${product._id}`);
  };
  const product = wishlistItem.find((item) => item?._id);
  return (
    <div className="Wish_List_Product">
      {isLoading && (
        <div className="w-full p-10  flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="Wishdata">
        {wishlistItem.map((product, index) => (
          <>
            {" "}
            <div className="WishGridView" key={index}>
              <div className="Wishproductimage relative">
                <img src={product.MainImage} alt="" />
                <div className="wishlistButtonArea">
                  <div
                    className="AddToCartIcon"
                    title="Add to Cart"
                    onClick={() => handleNavigate(product)}
                  >
                    <GoPlus />
                  </div>
                </div>
              </div>
              <div className="Wishprdocutsdetailes">
                <div className="Wishseconds">
                  <div>
                    <div>
                      {product.Name.length > 19
                        ? product.Name.substring(0, 19) + "..."
                        : product.Name}
                    </div>
                    {product.variations?.[0] && (
                      <div className="price flex gap-2">
                        {product.variations[0].price.discount > 0 &&
                        product.variations[0].price.discount !==
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
                  <div className="Wishitemicons">
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
                  </div>
                </div>
              </div>
            </div>{" "}
          </>
        ))}
      </div>{" "}
      <div className="CartLikeProducts">
        <LikeSameWithProductData product={product} />
      </div>
    </div>
  );
}

export default WishlistProducts;
