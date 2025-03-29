import React, { useState, useEffect, useRef } from "react";
import "./New.css";
import Navbar from "../Navbar/Navbar";
import SamallDipalyProducts from "../NewAllProducts/ProductsPages/SamallDipalyProducts";
import DetailsDisplayProduct from "../NewAllProducts/ProductsPages/DetailsDisplayProduct";
import "react-range-slider-input/dist/style.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useParams } from "react-router-dom";
import { useProductContext } from "../../Context/ProductContext";

function New() {
  const { cid, csid } = useParams(); // URL se category aur subcategory ID get karna
  const { Newdata, loading, error, fetchNewProducts } = useProductContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sortType, setSortType] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minMaxPrice, setMinMaxPrice] = useState([0, 100]); // Min & Max store krne ke liye
  const filterRef = useRef(null);
  const filteredCount = filteredData.length;

  const [selectedComponent, setSelectedComponent] = useState(
    localStorage.getItem("selectedComponent") || "DetailsDisplay"
  );
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    localStorage.setItem("selectedComponent", component);
  };

  useEffect(() => {
    if (cid) {
      fetchNewProducts(cid, csid);
    }
  }, [cid, csid]);

  useEffect(() => {
    fetchNewProducts();
  }, [Newdata]);

  useEffect(() => {
    const storedComponent = localStorage.getItem("selectedComponent");
    if (storedComponent) {
      setSelectedComponent(storedComponent);
    }
  }, []);

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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!Newdata) return;

    let sortedData = [...Newdata];

    sortedData.sort((a, b) => {
      // Pehle har product ka minimum price nikalo
      const minPriceA = Math.min(
        ...a.variations.map((v) => Number(v.price.real))
      );
      const minPriceB = Math.min(
        ...b.variations.map((v) => Number(v.price.real))
      );

      if (sortType === "ASCENDING PRICE") {
        return minPriceA - minPriceB;
      } else if (sortType === "DESCENDING PRICE") {
        return minPriceB - minPriceA;
      } else if (sortType === "NEW") {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      return 0;
    });

    setFilteredData(sortedData);
  }, [sortType, Newdata]);

  useEffect(() => {
    if (!Newdata) return;

    const extractedColors = Newdata.flatMap((product) =>
      product.variations.map((variation) => variation.color.name.toLowerCase())
    );

    const uniqueColors = [...new Set(extractedColors)];
    setColors(uniqueColors);
  }, [Newdata]);

  useEffect(() => {
    if (!Newdata) return;

    let filtered = [...Newdata];

    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.variations.some(
          (variation) =>
            variation.color.name.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    setFilteredData(filtered);
  }, [selectedColor, Newdata]);

  useEffect(() => {
    if (!Newdata) return;

    const extractedSizes = Newdata.flatMap((product) =>
      product.variations.flatMap((variation) => variation.size)
    );

    const uniqueSizes = [...new Set(extractedSizes)];
    setSizes(uniqueSizes);
  }, [Newdata]);
  useEffect(() => {
    if (!Newdata) return;

    let filtered = [...Newdata];

    if (selectedSize) {
      filtered = filtered.filter((product) =>
        product.variations.some((variation) =>
          variation.size.includes(selectedSize)
        )
      );
    }

    setFilteredData(filtered);
  }, [selectedSize, Newdata]);

  useEffect(() => {
    if (!activeFilter) return; // Only run when a filter is active

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeFilter]);

  const toggleFilterBox = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    if (colors.length > 6) {
      setIsWrapped(true);
    } else {
      setIsWrapped(false);
    }
  }, [colors]);

  useEffect(() => {
    if (!Newdata || Newdata.length === 0) return;

    const allPrices = Newdata.flatMap((product) =>
      product.variations.map((variation) => Number(variation.price.real))
    );

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    setMinMaxPrice([minPrice, maxPrice]); // Min & Max Price store krna
    setPriceRange([minPrice, maxPrice]); // Default Range bhi set krna
  }, [Newdata]);

  useEffect(() => {
    if (!Newdata) return;

    const filtered = Newdata.filter((product) =>
      product.variations.some((variation) => {
        const realPrice = Number(variation.price.real);
        return realPrice >= priceRange[0] && realPrice <= priceRange[1];
      })
    );

    setFilteredData(filtered);
  }, [priceRange, Newdata]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const clearFilters = () => {
    setPriceRange(minMaxPrice); // Price ko reset krna
    setSelectedColor(""); // Color reset
    setSelectedSize(""); // Size reset
    setSorting(""); // Sorting reset
    setFilteredData(originalData); // 🛠️ Ye zaroori hai, sorting ko bhi reset karega
  };

  return (
    <div>
      <div
        className={`sticky top-0 z-10`}
        style={{
          backgroundColor: isScrolled ? "var(--bg-color)" : "transparent",
        }}
      >
        <div className="absolute w-full">
          <Navbar />
        </div>
        <div className="Productfilterveiw">
          <div className="Productfilterveiw__filter">
            {["SORT BY", "COLORS", "SIZE", "PRICE"].map((filter) => (
              <div
                key={filter}
                className={`Productfilterveiw__filter-item ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents immediate closing when clicked
                  toggleFilterBox(filter);
                }}
              >
                {filter}
              </div>
            ))}
          </div>

          {/* Conditional box rendering */}
          {activeFilter && (
            <div
              className="filter-box"
              ref={filterRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filter-box__content">
                {activeFilter === "SORT BY" && (
                  <div className="sort-options">
                    <div
                      className={`sort-option ${
                        sortType === "ASCENDING PRICE" ? "selected" : ""
                      }`}
                      onClick={() => setSortType("ASCENDING PRICE")}
                    >
                      ASCENDING PRICE
                    </div>
                    <div
                      className={`sort-option ${
                        sortType === "DESCENDING PRICE" ? "selected" : ""
                      }`}
                      onClick={() => setSortType("DESCENDING PRICE")}
                    >
                      DESCENDING PRICE
                    </div>
                    <div
                      className={`sort-option ${
                        sortType === "NEW" ? "selected" : ""
                      }`}
                      onClick={() => setSortType("NEW")}
                    >
                      NEW
                    </div>
                  </div>
                )}

                {activeFilter === "COLORS" && (
                  <div
                    className={`color-options ${isWrapped ? "flex-wrap" : ""}`}
                  >
                    {colors.map((color, index) => (
                      <div
                        className={`color-option ${
                          selectedColor === color ? "selected" : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div
                          className="color-box"
                          style={{ background: color }}
                        ></div>
                        <span className="color-name">{color}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeFilter === "SIZE" && (
                  <div className="size-options">
                    {sizes.map((size, index) => (
                      <div
                        key={index}
                        className={`size-option ${
                          selectedSize === size ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                )}

                {activeFilter === "PRICE" && (
                  <div
                    style={{
                      maxWidth: "95%",
                      margin: "0 auto",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <p>
                        Selected Price Range: ${priceRange[0]} - $
                        {priceRange[1]}
                      </p>
                    </div>
                    <Slider
                      range
                      min={minMaxPrice[0]} // Ye data ke hisaab se adjust hoga
                      max={minMaxPrice[1]}
                      value={priceRange}
                      onChange={handlePriceChange} // User ka selected range update hoga
                    />
                  </div>
                )}

                <div className="filter-box__footer">
                  <div onClick={clearFilters} style={{ cursor: "pointer" }}>
                    CLEAR
                  </div>
                  <div>VIEW RESULTS({filteredCount})</div>
                </div>
              </div>
            </div>
          )}
          <div className="view-option-selector">
            <div
              className={`view-option-selector__icon ${
                selectedComponent === "DetailsDisplay" ? "activeIcon" : ""
              }`}
              onClick={() => handleComponentChange("DetailsDisplay")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--text-color)"
                stroke="inherit"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.6 4.6H10v14.8H4.6V4.6zm-1-1H11v16.8H3.6V3.6zm10.4 1h5.4v14.8H14V4.6zm-1-1h7.4v16.8H13V3.6z"
                ></path>
              </svg>
            </div>
            <div
              className={`view-option-selector__icon ${
                selectedComponent === "SamallDipaly" ? "activeIcon" : ""
              }`}
              onClick={() => handleComponentChange("SamallDipaly")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--text-color)"
                stroke="inherit"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.6 4.6H10V10H4.6V4.6zm-1-1H11V11H3.6V3.6zm1 10.4H10v5.4H4.6V14zm-1-1H11v7.4H3.6V13zm15.8-8.4H14V10h5.4V4.6zm-5.4-1h-1V11h7.4V3.6H14zM14 14h5.4v5.4H14V14zm-1-1h7.4v7.4H13V13z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="New">
        {selectedComponent === "DetailsDisplay" && (
          <DetailsDisplayProduct data={filteredData} loading={loading} />
        )}
        {selectedComponent === "SamallDipaly" && (
          <SamallDipalyProducts data={filteredData} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default New;
