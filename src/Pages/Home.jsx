import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Home.css";
import Navbar from "../Components/Navbar/Navbar";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import SocialSlidepage from "../Components/SocialPageforHome/SocialSlidepage";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../Context/ProductContext";
import Spinner from "../Spinner";

const isVideo = (url) => {
  return /\.(mp4|webm|ogg|ogv)$/i.test(url);
};

export default function Home() {
  const { data, fetchProducts, loading, error } = useProductContext();
  const [state, setState] = useState({
    currentCategory: "women",
    autoplayEnabled: true,
    scrollTimeout: true,
    manualScroll: false,
    data: [],
    selectedProducts: [], // ✅ Added in your main state
  });
  useEffect(() => {
    fetchProducts(); // Jab component mount hoga to ye function run hoga
  }, []);

  useEffect(() => {
    if (loading) return; // Jab tak loading hai, effect run na ho

    if (Array.isArray(data) && data.length > 0) {
      // Dynamic category object
      const categories = {};
      let newProducts = []; // Store multiple new products

      data.forEach((product) => {
        const categoryName =
          product?.category?.MainCategoryName || "Uncategorized";

        if (!categories[categoryName]) {
          categories[categoryName] = [];
        }

        // Create reusable product object
        const productDetails = {
          MainImage: product?.MainImage,
          Name: product?.Name,
          id: product?._id,
          cid: product?.category?._id,
          cn: product?.category?.MainCategoryName,
          csid: product?.subcategory?._id,
          csn: product?.subcategory?.SubMainCategory,
        };

        // Check if it's a 'new' product and add to newProducts array
        if (product?.new) {
          newProducts.push(productDetails);
        }

        // Add product to its category
        categories[categoryName].push(productDetails);
      });

      // ✅ **Randomly select 2 new products**
      let selectedNewProducts = [];
      if (newProducts.length > 0) {
        const shuffled = newProducts.sort(() => 0.5 - Math.random()); // Shuffle array
        selectedNewProducts = shuffled.slice(0, 2); // Get first 2 shuffled items
      }

      // Sort categories by product count
      const sortedCategories = Object.entries(categories)
        .sort((a, b) => b[1].length - a[1].length)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Update state with categories and new products
      setState((prevState) => ({
        ...prevState,
        categories: sortedCategories,
        newProducts: selectedNewProducts, // Add the 2 new products directly to state
      }));
    }
  }, [data, loading]);

  const swiperRef = useRef(null);
  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    if (loading) return; // Jab tak loading hai, function execute na ho

    setState((prevState) => ({
      ...prevState,
      currentCategory: category,
    }));

    const subcategories = state.categories[category];
    const defaultSubcategory = subcategories
      ? Object.keys(subcategories)[0]
      : null;

    const firstSlide = subcategories ? subcategories[defaultSubcategory] : [];
    const firstSlideIsVideo = isVideo(firstSlide);
    const swiper = swiperRef.current?.swiper;

    if (swiper) {
      swiper.slideTo(0);

      if (firstSlideIsVideo) {
        setState((prevState) => ({
          ...prevState,
          autoplayEnabled: true,
        }));
        swiper.autoplay.start();
      } else {
        setState((prevState) => ({
          ...prevState,
          autoplayEnabled: false,
        }));
        swiper.autoplay.stop();
      }
    }

    setState((prevState) => ({
      ...prevState,
      manualScroll: false,
    }));
  };

  useEffect(() => {
    if (loading) return; // Jab tak loading hai, effect run na ho

    const swiper = swiperRef.current?.swiper;

    const handleSlideChange = () => {
      if (!state.manualScroll) {
        swiper.autoplay.start();
      }
    };

    if (swiper) {
      swiper.on("slideChange", handleSlideChange);
    }

    return () => {
      if (swiper) {
        swiper.off("slideChange", handleSlideChange);
      }
    };
  }, [state.manualScroll, loading]); // 🔥 Dependency array mein `loading` bhi add ki

  useEffect(() => {
    if (loading) return; // Jab tak loading hai, swiper ko na chhedo

    const { swiper } = swiperRef.current || {};
    const activeIndex = swiper?.activeIndex;

    if (swiper) {
      if (activeIndex === 0 && !state.manualScroll) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
    }
  }, [state.currentCategory, state.manualScroll, loading]);

  const handleScroll = () => {
    if (loading) return; // Jab tak loading hai, manual scroll ko update na karo

    setState((prevState) => ({
      ...prevState,
      manualScroll: true,
    }));

    if (state.scrollTimeout) {
      clearTimeout(state.scrollTimeout);
    }

    const timeout = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        manualScroll: false,
      }));
    }, 500);

    setState((prevState) => ({
      ...prevState,
      scrollTimeout: timeout,
    }));
  };

  const handleNextCategory = () => {
    if (loading) return; // Jab tak loading hai, category switch na ho

    const categoriesList = Object.keys(state.categories);
    const currentIndex = categoriesList.indexOf(state.currentCategory);

    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % categoriesList.length;
    handleCategoryChange(categoriesList[nextIndex]);
  };

  const handlePrevCategory = () => {
    if (loading) return; // Jab tak loading hai, category switch na ho

    const categoriesList = Object.keys(state.categories);
    const currentIndex = categoriesList.indexOf(state.currentCategory);

    if (currentIndex === -1) return;

    const prevIndex =
      (currentIndex - 1 + categoriesList.length) % categoriesList.length;
    handleCategoryChange(categoriesList[prevIndex]);
  };

  const getCategoryButtons = () => {
    if (loading) return <div className="loader"></div>; // Agar loading ho rahi hai toh loader show karo

    if (!state.categories || Object.keys(state.categories).length === 0) {
      return <div className="loader"></div>; // Agar categories nahi mili toh bhi loader show karo
    }

    return Object.keys(state.categories).map((category) => (
      <button
        key={category}
        onClick={() => handleCategoryChange(category)}
        className={state.currentCategory === category ? "active" : "wmk"}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    ));
  };

  useEffect(() => {
    if (loading || !state.categories) return; // Jab tak loading ho, kuch bhi execute na ho

    const defaultCategory = Object.keys(state.categories)[0]; // Pehli category lo

    if (defaultCategory && state.currentCategory !== defaultCategory) {
      handleCategoryChange(defaultCategory);
    }
  }, [state.categories, loading]); // `loading` ko dependency mein add kar diya

  useEffect(() => {
    if (loading || !data || !state.currentCategory) return; // Jab tak loading ho, kuch bhi execute na ho

    // 🆕 Filter new products
    const newProducts = data.filter(
      (product) =>
        product.new === true &&
        product.category.MainCategoryName === state.currentCategory
    );

    if (newProducts.length > 0) {
      // 🌀 Randomly select 2 products
      const shuffled = [...newProducts].sort(() => 0.5 - Math.random());
      const randomSelection = shuffled.slice(0, 2);

      setState((prevState) => ({
        ...prevState,
        selectedProducts: randomSelection,
      }));
    }
  }, [state.currentCategory, data, loading]); // ✅ `loading` ko dependency mein add kiya

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🖼️ **Render Slides**
  const getCategorySlides = () => {
    if (loading || !state.categories || !state.currentCategory) {
      return []; // Jab tak data load ho raha ho, empty array return karo
    }

    const subcategories = state.categories[state.currentCategory];
    if (!subcategories) {
      return [];
    }

    const slides = [];

    if (state.selectedProducts.length > 0) {
      if (state.selectedProducts.length === 1) {
        // 🟢 Single New Product Slide
        slides.push(
          <SwiperSlide
            key={`new-single-product-slide-${state.currentCategory}`}
          >
            <div
              onClick={() => {
                const { MainCategoryName, _id: MainCategoryId } =
                  state.selectedProducts[0].category;

                navigate(`/Product/${MainCategoryName}/${MainCategoryId}`);
              }}
              className="w-full h-full flex justify-center items-center md:block md:w-full md:h-auto lg:flex lg:justify-center lg:items-center"
            >
              <img
                src={state.selectedProducts[0].MainImage}
                alt={state.selectedProducts[0].Name || "Product Image"}
                className="w-full h-auto object-cover md:max-w-[100%] lg:max-w-[50%]"
              />
              {state.selectedProducts[0].new && (
                <h3 className="absolute bottom-3 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-semibold">
                  NEW
                </h3>
              )}
            </div>
          </SwiperSlide>
        );
      } else {
        // 🟢 Multiple New Products Slide (Grid Layout)
        slides.push(
          <SwiperSlide key={`new-products-slide-${state.currentCategory}`}>
            <div className="flex w-full h-full overflow-x-auto">
              {state.selectedProducts.map((product, index) => (
                <div
                  key={`${product._id}-${index}`}
                  onClick={() => {
                    const { MainCategoryName, _id: MainCategoryId } =
                      product.category;

                    navigate(`/Product/${MainCategoryName}/${MainCategoryId}`);
                  }}
                  className={`relative shrink-0 overflow-hidden ${
                    isMobile ? (index === 0 ? "w-full" : "hidden") : "w-1/2"
                  } h-full`}
                >
                  <img
                    src={product.MainImage}
                    alt={product.Name || "Product Image"}
                    className="w-full h-full object-cover object-top"
                  />
                  {!isMobile && index % 2 !== 0 && product.new && (
                    <h3 className="absolute bottom-3 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-semibold z-10">
                      NEW
                    </h3>
                  )}
                  {isMobile && product.new && (
                    <h3 className="absolute bottom-3 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-semibold z-10">
                      NEW
                    </h3>
                  )}
                </div>
              ))}
            </div>
          </SwiperSlide>
        );
      }
    }

    const groupedByCsid = {};
    const multiProductSlides = [];
    const singleProductSlides = [];

    Object.keys(subcategories).forEach((subcategory) => {
      const products = subcategories[subcategory];
      const productArray = Array.isArray(products) ? products : [products];

      productArray.forEach((product) => {
        const { csid } = product;

        if (!groupedByCsid[csid]) {
          groupedByCsid[csid] = [];
        }

        groupedByCsid[csid].push(product);
      });
    });

    Object.keys(groupedByCsid).forEach((csid) => {
      const groupedProducts = groupedByCsid[csid];

      // // 🟢 Multi-Product Slides (Grouped)
      if (groupedProducts.length > 1) {
        multiProductSlides.push(
          <SwiperSlide
            key={`multi-${csid}`}
            onClick={() =>
              navigate(
                `/Product/${groupedProducts[0]?.cn}/${groupedProducts[0]?.cid}/${groupedProducts[0]?.csid}`
              )
            }
          >
            <div className="relative w-full h-full">
              <div className="flex w-full h-full md:block">
                {groupedProducts.slice(0, 3).map((product, index) => (
                  <img
                    key={index}
                    src={product.MainImage}
                    alt={product.Name}
                    className="Swiper_Slider_Images md:w-full md:h-auto"
                    style={{
                      width: `${100 / groupedProducts.length}%`,
                      height: "100%",
                      flexShrink: 0,
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
              <h3 className="absolute bottom-3 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-semibold">
                {groupedProducts[0]?.csn || "No Name Available"}
              </h3>
            </div>
          </SwiperSlide>
        );
      }

      // 🟢 Single Product Slides
      if (groupedProducts.length > 0) {
        const firstProduct = groupedProducts[0]; // Pehla product select kiya
        singleProductSlides.push(
          <SwiperSlide
            key={`single-${firstProduct.csid}`}
            onClick={() =>
              navigate(
                `/Product/${firstProduct.cn}/${firstProduct.cid}/${firstProduct.csid}`
              )
            }
          >
            <div className="w-full h-full flex justify-center items-center md:block md:w-full md:h-auto lg:flex lg:justify-center lg:items-center relative">
              <img
                src={firstProduct.MainImage} // Pehli product ki MainImage show karega
                alt={firstProduct.Name}
                className="w-full h-auto object-cover md:max-w-[100%] lg:max-w-[50%]"
              />
              <h3 className="absolute bottom-3 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-semibold">
                {firstProduct.csn || "No Name Available"}
              </h3>
            </div>
          </SwiperSlide>
        );
      }
    });

    slides.push(...multiProductSlides, ...singleProductSlides);

    slides.push(
      <SwiperSlide
        key={`${state.currentCategory}-social-slide`}
        onClick={() => console.log("Social Slide Clicked")}
      >
        <div className="social-slide-page w-full h-full flex justify-center items-center">
          <SocialSlidepage />
        </div>
      </SwiperSlide>
    );

    return slides;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      {loading ? (
        <div className="cart-spinner">
          <span className="text-lg font-semibold">
            <Spinner />
          </span>
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-10 Home_navbar ">
            <div className=" bg-transparent w-full">
              <Navbar />
            </div>
            <div className="CategoryButtons">
              <div className="categoriesButtons">{getCategoryButtons()}</div>
            </div>
          </div>
          <div className="SwiperArea">
            <div className="NavigationButtons">
              <div>
                <IoIosArrowBack
                  onClick={handlePrevCategory}
                  className="arrow-icon cursor-pointer"
                />
              </div>
              <div>
                <IoIosArrowForward
                  onClick={handleNextCategory}
                  className="arrow-icon cursor-pointer"
                />
              </div>
            </div>
            <Swiper
              ref={swiperRef}
              direction={"vertical"}
              slidesPerView={1}
              spaceBetween={0}
              mousewheel={true}
              centeredSlides={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Mousewheel, Autoplay, Pagination]}
              className="mySwiper relative cursor-pointer"
              onSlideChange={() => {}}
              onTransitionEnd={() => {}}
              pagination={false}
              onScroll={() => handleScroll()}
            >
              {getCategorySlides()}
            </Swiper>
          </div>
        </>
      )}
    </div>
  );
}
