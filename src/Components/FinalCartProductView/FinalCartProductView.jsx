import React, { useEffect, useState } from "react";
import "./FinalCartProductView.css";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import SHIPPING_AND_RETURNS from "../NewAllProducts/Offcanvice/SHIPPING_AND_RETURNS";
import NavBar_Show_After_Cart from "../Navbar/NavBar_Show_After_Cart/NavBar_Show_After_Cart";
import { useCart } from "../../Context/CartContext";
import { useAddressContext } from "../../Context/AddressContext";
const FinalCartProductView = () => {
  const { addresses, loading, error, fetchAddresses } = useAddressContext();
  const { cart, Loading, updateCartQuantity, removeFromCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  console.log(addresses);

  const [SizeView, setSizeView] = useState(false);

  const openSizeViewDrawer = () => setSizeView(true);

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
    window.scrollTo(0, 0);
  }, []);
  const defaultAddress = addresses.find((address) => address.isDefault);
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
  return (
    <div>
      <div className="sticky top-0 z-10">
        <div
          className="absolute w-full"
          style={{
            backgroundColor: isScrolled ? "var(--bg-color)" : "transparent",
          }}
        >
          <NavBar_Show_After_Cart />
        </div>
      </div>
      <div className="FinalCartProductView">
        <div className="FinalView">
          <div className="FinalViewTitleFist">
            WHERE DO YOU WANT TO RECEIVE YOUR ORDER?
          </div>
          <div className="FinalViewTitleSecond">DELIVERY ADDRESS</div>
          <div className="FinalAdrees">
            <div className="FinalViewTitleForMobile">
              <p>
                {defaultAddress
                  ? defaultAddress.address
                  : "No default address found"}
              </p>
              <Link onClick={openSizeViewDrawer}>EDIT</Link>
            </div>
          </div>
          <div className="FinalDataAndDate">
            <div className="FinalData">
              <p>DELIVERY</p>
              <div className="Finalslides">
                <Swiper slidesPerView={3} spaceBetween={0} className="mySwiper">
                  {cart?.items?.length > 0
                    ? cart.items.map((item, index) => (
                        <SwiperSlide key={index} className="Swipe">
                          <img
                            className="FinalSlidesImg"
                            src={item.product?.MainImage}
                            alt=""
                          />
                          <div className="FinalSHowItemQuantity">
                            {item.quantity}
                          </div>
                        </SwiperSlide>
                      ))
                    : null}
                </Swiper>
              </div>
              <div className="FinalDelevryTime">
                <div className="Detailsfinal">
                  <input type="checkbox" checked={true} name="" id="" />
                  <span>
                    {defaultAddress
                      ? getDeliveryRange(defaultAddress.estimatedDelivery)
                      : "No estimated delivery date"}
                  </span>{" "}
                </div>
                <span>
                  <strong>
                    {defaultAddress
                      ? `${defaultAddress.shippingCharge} PKR`
                      : "Shipping not available"}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <div className="Cartpropccess-Main">
        <div className={isMobile ? "formobile" : "CartpropccessOrder"}>
          <div className="CartPropssesstitle opacity-0">
            *By continuing, I declare that I have read and accept the Purchase
            Conditions and understand Zara's Privacy and Cookie Policy.
          </div>
          <div className="CartProccesses">
            <div>
              <p>TOTAL</p>
              <p>
                {defaultAddress
                  ? `${defaultAddress.shippingCharge} PKR`
                  : "Shipping not available"}
              </p>
            </div>
            <Link className="Cartcontinuebutton" to="/Order_Summary">
              <button className="Contiun">CONTINUE</button>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ overflow: SizeView ? "hidden" : "auto" }}>
        <SHIPPING_AND_RETURNS
          SizeView={SizeView} // Pass SizeView state to control drawer visibility
          setSizeView={setSizeView} // Pass setSizeView to control drawer state
        />
      </div>
    </div>
  );
};

export default FinalCartProductView;
