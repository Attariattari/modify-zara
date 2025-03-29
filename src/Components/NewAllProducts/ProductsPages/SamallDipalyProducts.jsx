import React, { useEffect, useState } from "react";
import "./MainCss.css"; // Updated CSS file name for better clarity
import Footer from "../../Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../../Spinner";
import { GoPlus } from "react-icons/go";
import Cartpopup from "./Cartpopup";

function SmallDisplayProducts({ data, loading }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="product-grid-container">
      {loading && (
        <div className="w-full p-10 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="product-grid">
        {data.map((product) => (
          <div
            className="product-card"
            key={product._id} // Use product._id as key
            title={product.Name}
            onClick={() => handleNavigate(product)}
          >
            <img src={product.MainImage} alt={`Product ${product.Name}`} />
            {product.variations?.[0]?.price?.discount > 0 &&
              product.variations[0].price.discount <
                product.variations[0].price.real && (
                <div className="Discount-show">
                  {calculateDiscountPercentage(product)}%
                </div>
              )}
            <div
              className="CartSmallButtonArea"
              title="Add to Cart"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click event
                handleNavigate(product);
              }}
            >
              <GoPlus />
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default SmallDisplayProducts;
