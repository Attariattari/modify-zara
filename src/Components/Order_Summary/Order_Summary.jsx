import React, { useEffect, useState } from "react";
import "./Order_Summary.css";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { ZaraProducts } from "../DummyData/Data";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import NavBar_Show_After_Cart from "../Navbar/NavBar_Show_After_Cart/NavBar_Show_After_Cart";
import { useAddressContext } from "../../Context/AddressContext";
import { useCart } from "../../Context/CartContext";
const Order_Summary = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { addresses, loading, error, fetchAddresses } = useAddressContext();
  const { cart, Loading, updateCartQuantity, removeFromCart } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [FullDisplayData, setFullDisplayData] = useState(
    window.innerWidth < 768
  );
  const [expendview, setExpendview] = useState();
  const [Totoalitemshow, setTotoalitemshow] = useState(null);
  const defaultAddress = addresses.find((address) => address.isDefault);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    fetchAddresses();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleDataView = () => {
      setFullDisplayData(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleDataView);

    return () => {
      window.removeEventListener("resize", handleDataView);
    };
  }, []);

  const Totalviewshow = () => {
    setTotoalitemshow(true);
  };

  const Totalviewfalse = () => {
    setTotoalitemshow(false);
  };
  const Expendfortotal = () => {
    setExpendview(!expendview);
  };

  const womenProducts = [
    ZaraProducts.Women.LINEN_BLEND_ROLL_UP,
    ZaraProducts.Women.SATINY_BLAZER,
    ZaraProducts.Women.FITTED_BLAZER,
    ZaraProducts.Women.ASYMMETRIC_TULLE_DRESS,
    ZaraProducts.Women.MINIMALIST_FITTED_BLAZER,
    ZaraProducts.Women.OVERSIZE_CRINKLE,
    ZaraProducts.Women.OVERSIZE_CRINKLE,
  ];
  const getDeliveryRange = (estimatedDelivery) => {
    if (!estimatedDelivery) return "Delivery date not available";

    const today = new Date(); // Get current date
    const [minDays, maxDays] = estimatedDelivery
      .split("-")
      .map((d) => parseInt(d.trim())); // Extract days range

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    // Format dates
    const formatOptions = { weekday: "long", day: "2-digit", month: "long" };
    const minDateStr = minDate
      .toLocaleDateString("en-US", formatOptions)
      .toUpperCase();
    const maxDateStr = maxDate
      .toLocaleDateString("en-US", formatOptions)
      .toUpperCase();

    return `${minDateStr} - ${maxDateStr}`;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-10 ">
        <div className={`absolute w-full ${isScrolled ? "bg-white" : ""}`}>
          <NavBar_Show_After_Cart />
        </div>
      </div>

      {FullDisplayData ? (
        <div className="Order_Summary">
          <div className="Order_Summary_Main">
            <div className="Order_Summary_Title_Main">
              <p className="Order_Summary_Title">
                If import costs are not included in your order, you will need to
                pay them locally.
              </p>
            </div>
            <div className="Order_Summary_Data_Mobile">
              <div className="Order_Summary_Data_Mobile_Delivery">
                <p>
                  DELIVERY{" "}
                  {defaultAddress
                    ? getDeliveryRange(defaultAddress.estimatedDelivery)
                    : "No estimated delivery date"}
                </p>
                <p>{cart.totalQuantity} PRODUCTS</p>
              </div>
              <div className="Order_Summary_Data_Mobile_Product_Swiper">
                <Swiper
                  slidesPerView={6}
                  breakpoints={{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 4 },
                    640: { slidesPerView: 4 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                  }}
                  spaceBetween={0}
                  className="mySwiper"
                >
                  {cart?.items?.length > 0
                    ? cart.items.map((item, index) => (
                        <SwiperSlide key={index}>
                          <img
                            className="Order_Summary_Shipping_Product_Swiper_Slide"
                            src={item.product?.MainImage}
                            alt=""
                          />
                          <div className="Order_Summary_Shipping_Product_Quantity">
                            {item.quantity}
                          </div>
                        </SwiperSlide>
                      ))
                    : null}
                </Swiper>
              </div>
              <div className="Order_Summary_Data_Mobile_Delivery_Type">
                <div>
                  <p>EXPRESS HOME DELIVERY</p>
                  <p>
                    {" "}
                    {defaultAddress
                      ? getDeliveryRange(defaultAddress.estimatedDelivery)
                      : "No estimated delivery date"}
                  </p>{" "}
                </div>
                <div>
                  <svg
                    class="order-summary-block__link-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="inherit"
                    stroke="inherit"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.336 12L8.624 4.33l.752-.66L16.665 12l-7.289 8.33-.752-.66L15.336 12z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="Order_Summary_Data_Mobile_Address_View">
                <div>
                  {defaultAddress ? (
                    <>
                      <p>{`${defaultAddress.firstName.toUpperCase()} ${defaultAddress.lastName.toUpperCase()}`}</p>
                      <p>
                        {defaultAddress.address.toUpperCase()} <br />{" "}
                        {defaultAddress.addressSecond.toUpperCase()}{" "}
                      </p>
                      <p>{defaultAddress.cityTown.toUpperCase()}</p>
                      <p>{defaultAddress.zipCode.toUpperCase()}</p>
                      <p>{defaultAddress.cityTown.toUpperCase()}</p>
                      <p>{defaultAddress.stateProvince.toUpperCase()}</p>
                      <p>{defaultAddress.countries.toUpperCase()}</p>
                      <p>{`${defaultAddress.prefix} ${defaultAddress.phoneNumber}`}</p>
                    </>
                  ) : (
                    <p>No default address found</p>
                  )}
                </div>
                <div className="Order_Summary_Data_Mobile_Address_View_SVG">
                  <svg
                    class="order-summary-block__link-icon cursor-pointer"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="inherit"
                    stroke="inherit"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.336 12L8.624 4.33l.752-.66L16.665 12l-7.289 8.33-.752-.66L15.336 12z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="Order_Summary_Data_Mobile_Payment_Method">
                <div className="Order_Summary_Payment_Data">
                  <div className="Order_Summary_Payment_Image">
                    <img
                      src="https://static.zara.net/static/images/payment/NewIcon/Icons_Payment_Methods/Payments/SVG/icon-payment-paypal_new.svg"
                      alt=""
                    />
                  </div>
                  <div>
                    <p>PAYPAL</p>
                    <p>
                      You will be redirected to the PayPal website, where you
                      can finalise payment.
                    </p>
                  </div>
                </div>{" "}
                <svg
                  class="order-summary-block__link-icon cursor-pointer"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="inherit"
                  stroke="inherit"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.336 12L8.624 4.33l.752-.66L16.665 12l-7.289 8.33-.752-.66L15.336 12z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="Order_Summary">
          <div className="Order_Summary_Main">
            <div className="Order_Summary_Data">
              <div className="Order_Summary_DELIVERY_Payment">
                <div className="Order_Summary_DELIVERY">
                  <p>DELIVERY</p>
                  <div className="Order_Summary_DELIVERY_Child">
                    <div className="Order_Summary_DELIVERY_Child_one">
                      <p>
                        EXPRESS HOME DELIVERY ={" "}
                        {defaultAddress
                          ? getDeliveryRange(defaultAddress.estimatedDelivery)
                          : "No estimated delivery date"}
                      </p>
                    </div>
                    <div className="Order_Summary_DELIVERY_Child_Two">
                      {defaultAddress ? (
                        <>
                          <p>{`${defaultAddress.firstName.toUpperCase()} ${defaultAddress.lastName.toUpperCase()}`}</p>
                          <p>
                            {defaultAddress.address.toUpperCase()} <br />{" "}
                            {defaultAddress.addressSecond.toUpperCase()}{" "}
                          </p>
                          <p>{defaultAddress.cityTown.toUpperCase()}</p>
                          <p>{defaultAddress.zipCode.toUpperCase()}</p>
                          <p>{defaultAddress.cityTown.toUpperCase()}</p>
                          <p>{defaultAddress.stateProvince.toUpperCase()}</p>
                          <p>{defaultAddress.countries.toUpperCase()}</p>
                          <p>{`${defaultAddress.prefix} ${defaultAddress.phoneNumber}`}</p>
                        </>
                      ) : (
                        <p>No default address found</p>
                      )}
                      <div className="Order_Summart_Edit">
                        <Link>EDIT</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="Order_Summary_Payment_Method">
                  <p>PAYMENT</p>
                  <div className="Order_Summary_Payment_Main">
                    <div className="Order_Summary_Payment_Data">
                      <div className="Order_Summary_Payment_Image">
                        <img
                          src="https://static.zara.net/static/images/payment/NewIcon/Icons_Payment_Methods/Payments/SVG/icon-payment-paypal_new.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <p>PAYPAL</p>
                        <p>
                          You will be redirected to the PayPal website, where
                          you can finalise payment.
                        </p>
                      </div>
                    </div>{" "}
                    <div className="Order_Summart_Edit">
                      <Link>EDIT</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Order_Summary_Shipping">
                <div className="Order_Summary_Shipping_Main">
                  <p> SHIPPING DETAILS</p>
                  <div className="Order_Summary_Shipping_Data">
                    <div className="Order_Summary_Shipping_Child">
                      <p>
                        DELIVERY ={" "}
                        {defaultAddress
                          ? getDeliveryRange(defaultAddress.estimatedDelivery)
                          : "No estimated delivery date"}
                      </p>
                      <p>{cart.totalQuantity} PRODUCTS</p>
                    </div>
                    <div className="Order_Summary_Shipping_Product_Swiper">
                      <Swiper
                        breakpoints={{
                          320: {
                            slidesPerView: 1,
                          },
                          480: {
                            slidesPerView: 2,
                          },
                          640: {
                            slidesPerView: 3,
                          },
                          768: {
                            slidesPerView: 4,
                          },
                          1024: {
                            slidesPerView: 6,
                          },
                        }}
                        spaceBetween={0}
                        className="mySwiper"
                      >
                        {cart?.items?.length > 0
                          ? cart.items.map((item, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  className="Order_Summary_Shipping_Product_Swiper_Slide"
                                  src={item.product?.MainImage}
                                  alt=""
                                />
                                <div className="Order_Summary_Shipping_Product_Quantity">
                                  {item.quantity}
                                </div>
                              </SwiperSlide>
                            ))
                          : null}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      {isMobile ? (
        <div className="Cartpropccess-Main">
          <div className="ExpendSVGButtonForCart">
            <div onClick={Expendfortotal}>
              <svg
                class="layout-shop-footer__swipe-icon"
                width="40"
                height="1"
                viewBox="0 0 40 0.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 0h40v1H0V0z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="CartMobileDataCountinues">
            <div className="CartProccesses">
              {!expendview && (
                <div className="CartProccessesTotal">
                  <div className="CartProccessesTotalTitle">
                    <p>TOTAL PRICE</p>
                    <div>
                      <p>PKR = {cart.totalPrice}</p>
                    </div>
                  </div>
                  <div className="CartProccessesTotalTitle">
                    <p>SHIPPING</p>
                    <div>
                      <p>
                        {defaultAddress
                          ? `PKR = ${defaultAddress.shippingCharge}`
                          : "Shipping not available"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <Link
                className="Cartcontinuebutton"
                to="/InterCardData"
                style={{ width: "100%" }}
              >
                <button className="Contiun">CONTINUE</button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="Cartpropccess-Main">
          <div
            className={`CartProccessView`}
            style={{ borderTop: !Totoalitemshow ? "1px solid black" : "" }}
          >
            <div className="CartPropssesstitle opacity-0"></div>
            <div className="CartProccesses">
              <div className="CartProccessesTotal">
                <div className="CartProccessesTotalTitle">
                  <p>PRODUCT PRICE</p>
                  <div>
                    <p>PKR = {cart.totalPrice}</p>
                  </div>
                </div>
                <div className="CartProccessesTotalTitle">
                  <p>SHIPPING</p>
                  <div>
                    <p>
                      {defaultAddress
                        ? `PKR = ${defaultAddress.shippingCharge}`
                        : "Shipping not available"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="CartProccessesTotalprice">
                <p>TOTAL PRICE</p>
                <div>
                  <p>
                    PKR ={" "}
                    {defaultAddress
                      ? cart.totalPrice + defaultAddress.shippingCharge
                      : cart.totalPrice}
                  </p>
                </div>
              </div>
              <Link className="Cartcontinuebutton" to="/InterCardData">
                <button className="Contiun">CONTINUE</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order_Summary;
