import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LikeSameWithProductData from "../NewAllProducts/SingleProductData/LikeSomeProductsDataView/LikeSameWithProductData";
import Footer from "../Footer/Footer";
import "./Css.css";
import NavBar_Show_After_Cart from "../Navbar/NavBar_Show_After_Cart/NavBar_Show_After_Cart";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/Wishlist";
import Spinner from "../../Spinner";
import { RiCloseCircleLine } from "react-icons/ri";
import { useAddressContext } from "../../Context/AddressContext";
import { userContext } from "../../Context/UserContext";

function ShoppingBag() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("shoppingBag");
  const { cart, Loading, updateCartQuantity, removeFromCart } = useCart();
  const { wishlistItems } = useWishlist();
  const { addresses, loading, error, fetchAddresses } = useAddressContext();
  const { setProductId, wishlistStatus, checkProductInWishlist, isLoading } =
    useWishlist();
  const { token } = useContext(userContext);

  useEffect(() => {
    if (!cart?.data?.items?.length) return; // ✅ Empty array case bhi handle ho gaya
    cart.data.items.forEach(({ product }) => {
      if (product?._id) {
        checkProductInWishlist(product._id);
      }
    });
  }, [cart]); // ✅ Ensure it runs when `cart` updates

  useEffect(() => {
    window.top.scrollTo(0, 0);
    window.scrollTo(0, 0);
    fetchAddresses();
  }, []);

  const ShippingRoute = () => {
    setActiveButton("shoppingBag");
    navigate("/Shopping_Bag");
  };

  const WishListRoute = () => {
    setActiveButton("wishlist");
    navigate("/Wishlist");
  };

  useEffect(() => {
    if (!token) {
      navigate("/Login");
    }
  }, [token]);

  useEffect(() => {
    const handleOverflow = () => {
      const body = document.querySelector("body");
      if (Swal.isVisible()) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    };

    handleOverflow();

    const observer = new MutationObserver(() => {
      handleOverflow();
    });

    observer.observe(document.body, { attributes: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const [quantities, setQuantities] = useState(
    cart?.items ? cart.items.map((item) => item.quantity) : []
  );

  useEffect(() => {
    if (cart?.items) {
      setQuantities(cart.items.map((item) => item.quantity));
    }
  }, [cart]);

  const handleCountMinus = (index, productId, size) => {
    if (quantities[index] > 1) {
      const newQuantity = quantities[index] - 1;

      setQuantities((prevQuantities) => {
        const newQuantities = [...prevQuantities];
        newQuantities[index] = newQuantity;
        return newQuantities;
      });

      // ✅ Sequence sahi kar diya
      updateCartQuantity(productId, newQuantity, size);
    }
  };

  const handleCountPlus = (index, productId, size) => {
    if (quantities[index] < 10) {
      const newQuantity = quantities[index] + 1;

      setQuantities((prevQuantities) => {
        const newQuantities = [...prevQuantities];
        newQuantities[index] = newQuantity;
        return newQuantities;
      });

      // ✅ Sequence sahi kar diya
      updateCartQuantity(productId, newQuantity, size);
    } else {
      Swal.fire({
        title: "Warning",
        text: "To add more units of this item, please contact our Customer Service team.",
        icon: "warning",
      });
    }
  };

  const sizeMapping = {
    XS: "Extra Small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    XXL: "Double Extra Large",
  };
  const product = cart?.items?.find((item) => item.product?._id)?.product;

  const handlecartdata = () => {
    const defaultAddress = addresses.find((address) => address.isDefault);

    if (defaultAddress) {
      navigate("/Order_Summary");
    } else {
      navigate("/Address_Conform");
    }
  };

  return (
    <div>
      {(Loading || isLoading) && (
        <div className="cart-spinner">
          <Spinner />
        </div>
      )}

      <div className="sticky top-0 z-50" style={{ marginTop: "-9px" }}>
        <div
          className="absolute w-full"
          style={{
            backgroundColor: "var(--bg-color)",
          }}
        >
          <NavBar_Show_After_Cart />
          <div className="text-black mt-6 ShippingFavoButton">
            <button
              className={
                activeButton === "shoppingBag"
                  ? "activeButton ShippingButton"
                  : "ShippingButton"
              }
              onClick={ShippingRoute}
            >
              <div className="shopping-bag-title">
                SHOPPING BAG ({cart?.items?.length || 0})
              </div>
            </button>
            <button
              className={
                activeButton === "wishlist"
                  ? "activeButton WishListButton"
                  : "WishListButton"
              }
              onClick={WishListRoute}
            >
              FAVOURITES ({wishlistItems.length})
            </button>
          </div>
        </div>
      </div>
      <div className="ShoppingBAg">
        <div className="CartProducts">
          <div className="Cartdata">
            {cart?.items?.length > 0 ? (
              cart.items.map((item, index) => (
                <div className="CartGridView" key={index}>
                  <div className="cartproductimage">
                    <img src={item.product?.MainImage} alt="" />
                  </div>
                  <div className="cartprdocutsdetailes">
                    <div className="cartseconds">
                      <div>
                        <div>
                          {item.product?.Name?.length > 19
                            ? item.product.Name.substring(0, 19) + "..."
                            : item.product?.Name || "No Name"}
                        </div>

                        {item?.price && (
                          <div>
                            {item.price.discount > 0 &&
                            item.price.discount < item.price.real ? (
                              <div className="flex gap-2">
                                <span className="discount-price text-red-500 font-bold">
                                  Rs. {item.price.discount}
                                </span>
                                <span
                                  className="original-price line-through"
                                  style={{ color: "var(--text-color)" }}
                                >
                                  Rs. {item.price.real}
                                </span>
                              </div>
                            ) : (
                              <span className="original-price font-bold">
                                Rs. {item.price.real}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-2">
                          {sizeMapping[item.variation?.size] ||
                            item.variation?.size ||
                            "No Size"}
                        </div>
                      </div>

                      <div className="cartitemicons">
                        {wishlistStatus[item.product?._id] ? (
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
                              setProductId(item.product?._id); // ✅ Fixed
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

                        <RiCloseCircleLine
                          title="Remove from Cart"
                          style={{ width: "18px", height: "18px" }}
                          onClick={() =>
                            removeFromCart(
                              item.product?._id,
                              item.variation?.size
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="cartitemquantity">
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          handleCountMinus(
                            index,
                            item.product?._id,
                            item.variation?.size
                          )
                        }
                      >
                        -
                      </div>
                      <div className="cursor-default">
                        {quantities[index] || 1}
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          handleCountPlus(
                            index,
                            item.product?._id,
                            item.variation?.size
                          )
                        }
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Cart is empty</p>
            )}
          </div>
        </div>
      </div>
      <div className="CartLikeProducts">
        <LikeSameWithProductData product={product} />
      </div>
      <Footer />
      <div className="Cartpropccess-Main">
        <div className="CartpropccessOrder">
          <div className="CartPropssesstitle">
            *By continuing, I declare that I have read and accept the Purchase
            Conditions and understand Zara's Privacy and Cookie Policy.
          </div>
          <div className="CartProccesses">
            <div
              className="CardTotalShow flex gap-5"
              style={{ padding: "0px" }}
            >
              <div>TOTAL</div>
              <div className="flex-col">
                <div className="">PKR = {cart.totalPrice} Only.</div>
                <div
                  className="text-gray-700"
                  style={{
                    fontSize: "9px",
                  }}
                ></div>
              </div>
            </div>
            <Link
              className="Cartcontinuebutton"
              onClick={(e) => {
                e.preventDefault();
                handlecartdata(cart);
              }}
            >
              <button className="Contiun">CONTINUE</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingBag;
