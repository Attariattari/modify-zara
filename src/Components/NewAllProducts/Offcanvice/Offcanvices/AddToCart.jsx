import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../Css.css";
import LikeSameWithProductData from "../../SingleProductData/LikeSomeProductsDataView/LikeSameWithProductData";
import CartProductSame from "../../SingleProductData/LikeSomeProductsDataView/CartProductSame";

function AddToCart({ product, closeDrawer, tempProduct }) {
  const navigate = useNavigate();

  const Navigate = () => {
    navigate("/Shopping_Bag");
  };
  const sizeMapping = {
    XS: "Extra Small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    XXL: "Double Extra Large",
  };
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5" color="var(--text-color)">
          Added to Cart
        </Typography>
        <IconButton variant="text" onClick={closeDrawer}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--text-color)"
            stroke="inherit"
            className="zds-dialog-icon-button__icon zds-dialog-close-button__icon"
          >
            <path d="m12 12.707 6.846 6.846.708-.707L12.707 12l6.847-6.846-.707-.708L12 11.293 5.154 4.446l-.707.708L11.293 12l-6.846 6.846.707.707L12 12.707Z"></path>
          </svg>
        </IconButton>
      </div>
      {tempProduct && (
        <Typography className="mb-8 font-normal">
          <div className="cartproductinfo">
            <img src={tempProduct.image} alt={tempProduct.name} />
            <div>
              <p>{tempProduct.name}</p>
              <span className="mt-3">ECRU | 2764/637</span>
              <p>
                SIZE {sizeMapping[tempProduct.size] || tempProduct.size} ADDED
                TO YOUR SHOPPING BAG
              </p>
            </div>
          </div>
          <button className="SEESHOPPINGBASKET" onClick={Navigate}>
            SEE SHOPPING BASKET
          </button>{" "}
        </Typography>
      )}
      <div className="w=[100%] h-auto p-0 LikeProduct">
        <CartProductSame product={product} />
      </div>
    </>
  );
}

export default AddToCart;
