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
  const [selectedComponent, setSelectedComponent] = useState(
    localStorage.getItem("selectedComponent") || "DetailsDisplay"
  );
  const { cid, csid } = useParams(); // URL se category aur subcategory ID get karna
  const { Newdata, loading, error, fetchNewProducts } = useProductContext();
  const [isScrolled, setIsScrolled] = useState(false);
  console.log(loading);

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

  const [activeFilter, setActiveFilter] = useState(null);
  const filterRef = useRef(null);

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

  const colors = [
    "red",
    "blue",
    "green",
    "black",
    "brown",
    "white",
    "yellow",
    "gray",
  ];

  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    if (colors.length > 6) {
      setIsWrapped(true);
    } else {
      setIsWrapped(false);
    }
  }, [colors]);

  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleChange = (newRange) => {
    setPriceRange(newRange);
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
                    <div>ASCENDING PRICE</div>
                    <div>DESCENDING PRICE</div>
                    <div>NEW</div>
                  </div>
                )}
                {activeFilter === "COLORS" && (
                  <div
                    className={`color-options ${isWrapped ? "flex-wrap" : ""}`}
                  >
                    {colors.map((color, index) => (
                      <div className="color-option" key={index}>
                        <div
                          className="color-box"
                          style={{ background: color }}
                        ></div>
                        <span className="color-name">
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {activeFilter === "SIZE" && (
                  <div className="size-options">
                    <div>XS</div>
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
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
                      min={0}
                      max={100}
                      defaultValue={[0, 100]}
                      value={priceRange}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="filter-box__footer">
                  <div>CLEAR</div>
                  <div>VIEW RESULTS(00)</div>
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
          <DetailsDisplayProduct data={Newdata} loading={loading} />
        )}
        {selectedComponent === "SamallDipaly" && (
          <SamallDipalyProducts data={Newdata} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default New;
