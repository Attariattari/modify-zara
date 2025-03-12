import React, { useEffect, useRef, useState } from "react";
import Footer from "./../Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import "./Css.css";
import { countries } from "./../DummyData/Data";
import NavBar_Show_After_Cart from "../Navbar/NavBar_Show_After_Cart/NavBar_Show_After_Cart";
import { useCart } from "../../Context/CartContext";
import { useAddressContext } from "../../Context/AddressContext";
import Spinner from "../../Spinner";

function Address_Conform() {
  const { cart, Loading } = useCart();
  const { loading, addAddress } = useAddressContext();

  const [focusedFields, setFocusedFields] = useState({
    firstName: false,
    lastName: false,
    address: false,
    addressSecond: false,
    cityTown: false,
    countries: false,
    stateProvince: false,
    prefix: false,
    phoneNumber: false,
    zipCode: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    addressSecond: "",
    countries: "", // Default country
    cityTown: "",
    stateProvince: "",
    prefix: "+92", // Default prefix
    phoneNumber: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    addressSecond: "",
    countries: "",
    cityTown: "",
    stateProvince: "",
    prefix: "",
    phoneNumber: "",
    zipCode: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const handleAutoFill = () => {
      const form = document.getElementById("billingForm");
      if (!form) return;

      const inputs = form.querySelectorAll("input");
      const select = form.querySelector("select[name='countries']");

      let updatedFields = {};
      let allFieldsFilled = true;

      inputs.forEach((input) => {
        if (input.value.trim() !== "") {
          updatedFields[input.name] = true;
        } else {
          allFieldsFilled = false;
        }
      });

      // Check if country is selected and update it as well
      if (select) {
        const selectedCountry = select.value;
        updatedFields["countries"] = true; // Mark country as filled
        setFormData((prev) => ({ ...prev, countries: selectedCountry }));
      }

      // Update focus state with updatedFields
      setFocusedFields((prev) => ({
        ...prev,
        ...updatedFields,
      }));

      // ✅ Only update state if values have changed
      setFormData((prev) => {
        const newValues = Object.fromEntries(
          Array.from(inputs).map((input) => [input.name, input.value])
        );

        // Add country to newValues
        newValues["countries"] = select ? select.value : prev.countries;

        // Check if values actually changed before updating
        if (JSON.stringify(prev) !== JSON.stringify(newValues)) {
          return { ...prev, ...newValues };
        }

        return prev;
      });
    };

    const form = document.getElementById("billingForm");
    if (form) {
      form.addEventListener("input", handleAutoFill);
      form.addEventListener("change", handleAutoFill);
    }

    return () => {
      if (form) {
        form.removeEventListener("input", handleAutoFill);
        form.removeEventListener("change", handleAutoFill);
      }
    };
  }, []);

  const handleInputFocus = (fieldName) => {
    setFocusedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleInputBlur = (fieldName, value) => {
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Required!",
      }));
      setFocusedFields((prev) => ({
        ...prev,
        [fieldName]: false,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const defaultCountry = countries.find((c) => c.code === "PK");
    if (defaultCountry) {
      setFormData((prev) => ({
        ...prev,
        countries: defaultCountry.code, // Default "PK"
        prefix: defaultCountry.prefix, // Default "+92"
      }));
    }
  }, []);

  // ✅ Country select hone pr prefix aur phone validation update karna
  const handleSelect = (event) => {
    const { name, value } = event.target;
    const selectedCountry = countries.find((c) => c.code === value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      prefix: selectedCountry ? selectedCountry.prefix : "",
      phoneNumber: "",
    }));

    setErrors((prev) => ({
      ...prev,
      phoneNumber: "",
    }));
  };

  const handlePhoneNumberChange = (event) => {
    let { value } = event.target;

    // Selected country ka prefix aur phone length lo
    const selectedCountry = countries.find(
      (c) => c.code === formData.countries
    );

    if (selectedCountry) {
      const countryPrefix = selectedCountry.prefix; // e.g., "+92", "+1", "+44"

      // **Agar user ne pehle se country prefix likha hai, to usko hata do (real-time)**
      while (value.startsWith(countryPrefix)) {
        value = value.slice(countryPrefix.length);
      }
    }

    // **Agar user '0' likh raha hai, to remove kar do (real-time)**
    while (value.startsWith("0")) {
      value = value.slice(1);
    }

    // **Real-time update in formData**
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));

    // **Validation check real-time**
    if (
      selectedCountry &&
      value.length > 0 &&
      value.length !== selectedCountry.phoneLength
    ) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: `Phone number must be ${selectedCountry.phoneLength} digits long.`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "",
      }));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = () => {
    const updatedErrors = {};

    // 🛑 Form Validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        updatedErrors[key] = "Required!";
      }
    });

    if (Object.keys(updatedErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...updatedErrors }));
      console.log("Form Errors:", updatedErrors);
      return;
    }

    // ✅ PK ko Pakistan me Convert Karna aur State Update Karna
    const selectedCountry = countries.find(
      (c) => c.code === formData.countries
    );

    setFormData((prev) => ({
      ...prev,
      countries: selectedCountry ? selectedCountry.name : "", // ✅ "Pakistan" set karega
    }));

    // ✅ Check Karo Backend Pe Kya Data Ja Raha Hai
    setTimeout(() => {
      console.log("Final Data Before API Call:", {
        ...formData,
        countries: selectedCountry ? selectedCountry.name : "",
      });

      addAddress({
        ...formData,
        countries: selectedCountry ? selectedCountry.name : "",
      })
        .then(() => {
          console.log("Address Added Successfully!");
          navigate("/method-selection");
        })
        .catch((err) => {
          console.error("Error Adding Address:", err);
        });
    }, 100);
  };

  return (
    <div>
      <div className="sticky top-0 z-50" style={{ marginTop: "-9px" }}>
        <div
          className="absolute w-full "
          style={{
            backgroundColor: "var(--bg-color)",
          }}
        >
          <NavBar_Show_After_Cart />
        </div>
      </div>
      <div>
        <div className="Address_Conform">
          {loading ? (
            <div className="cart-spinner">
              <Spinner />
            </div>
          ) : (
            <div className="BillingArea">
              <div className="Billingtitle">
                <p>EDIT YOUR BILLING ADDRESS</p>
                <p>
                  To place your order, you must first fill in your account
                  details. You can change them in your account at any time.
                </p>
              </div>
              <div className="BillingInputArea" id="billingForm">
                <div className="BillingInputAreaFisrt">
                  <div
                    className={`mb-4 relative ${
                      focusedFields.firstName
                        ? "border-b-1"
                        : "border-b-1 border-red-500"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.firstName ? "-z-10 top-5" : "")
                      }
                    >
                      FIRSTNAME
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="firstName"
                      type="text"
                      placeholder={!focusedFields.firstName ? "FIRSTNAME" : ""}
                      value={formData.firstName}
                      onFocus={() => handleInputFocus("firstName")}
                      onBlur={(ev) =>
                        handleInputBlur("firstName", ev.target.value)
                      }
                      onChange={handleInputChange}
                      style={{
                        borderBottom: focusedFields.firstName
                          ? "1px solid var(--border-color)"
                          : "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                      }}
                      autoComplete="given-name"
                    />
                    {!focusedFields.firstName && errors.firstName && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div
                    className="Privacyslect"
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <label htmlFor="countrySelect">SEND TO</label>
                    <div className="select-container">
                      <select
                        id="countrySelect"
                        name="countries"
                        value={formData.countries} // ✅ Auto-fill fix
                        onChange={handleSelect}
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ✅ Error Message (if exists) */}
                    {errors.countries && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{ marginTop: "1px" }}
                      >
                        {errors.countries}
                      </div>
                    )}
                  </div>

                  <div
                    className={`mb-4 relative ${
                      focusedFields.address ? "" : "border-b-1 border-red-500"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.address ? "-z-10 top-5" : "")
                      }
                    >
                      ADDRESS
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="address"
                      type="text"
                      placeholder={!focusedFields.address ? "ADDRESS" : ""}
                      value={formData.address}
                      onFocus={() => handleInputFocus("address")}
                      onBlur={(ev) =>
                        handleInputBlur("address", ev.target.value)
                      }
                      onChange={handleInputChange}
                      style={{
                        borderBottom: focusedFields.address
                          ? "1px solid var(--border-color)"
                          : "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                      }}
                    />

                    {!focusedFields.address && errors.address && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.address}
                      </div>
                    )}
                  </div>
                  <div
                    className={`mb-4 relative ${
                      focusedFields.cityTown
                        ? "border-b-1 border-red-500"
                        : "border-b-1"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.cityTown ? "-z-10 top-5" : "")
                      }
                    >
                      CITY/TOWN
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="cityTown" // ✅ Yahan sahi name likhna zaroori hai
                      type="text" // ✅ type="text" hona chahiye
                      placeholder={!focusedFields.cityTown ? "CITY/TOWN" : ""}
                      value={formData.cityTown} // ✅ Ab sahi update hoga
                      onFocus={() => handleInputFocus("cityTown")}
                      onChange={handleInputChange}
                      onBlur={(ev) =>
                        handleInputBlur("cityTown", ev.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    />
                    {!focusedFields.cityTown && errors.cityTown && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.cityTown}
                      </div>
                    )}
                  </div>

                  <div
                    className={`mb-4 relative ${
                      focusedFields.stateProvince
                        ? "border-b-1 border-red-500"
                        : "border-b-1"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.stateProvince ? "-z-10 top-5" : "")
                      }
                    >
                      STATE/PROVINCE
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="stateProvince"
                      type="text"
                      value={formData.stateProvince} // ✅ Added missing value
                      placeholder={
                        !focusedFields.stateProvince ? "STATE/PROVINCE" : ""
                      }
                      onFocus={() => handleInputFocus("stateProvince")}
                      onChange={handleInputChange}
                      onBlur={(ev) =>
                        handleInputBlur("stateProvince", ev.target.value)
                      }
                      style={{
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                        borderBottom: focusedFields.stateProvince
                          ? "1px solid var(--border-color)"
                          : "1px solid var(--border-color)",
                      }}
                    />
                    {!focusedFields.stateProvince && errors.stateProvince && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.stateProvince}
                      </div>
                    )}
                  </div>

                  <span className="BillingAndnumberarea">
                    {/* Prefix (Country Code) Field */}
                    <div
                      className={`mb-4 relative ${
                        errors.prefix
                          ? "border-b-1 border-red-500"
                          : "border-b-1"
                      }`}
                    >
                      <label
                        className={
                          "absolute mb-3 text-[11px] transition-all duration-150 " +
                          (!focusedFields.prefix ? "-z-10 top-5" : "")
                        }
                      >
                        PREFIX
                      </label>
                      <input
                        className="pt-5 pb-2 outline-none w-full text-[11px]"
                        name="prefix"
                        type="text"
                        placeholder={!focusedFields.prefix ? "PREFIX" : ""}
                        value={formData.prefix} // ✅ Prefix dynamic ho gaya
                        readOnly // ✅ Manually edit nahi ho sakta
                        style={{
                          backgroundColor: "var(--bg-color)",
                          color: "var(--text-color)",
                          borderBottom: errors.prefix
                            ? "1px solid red"
                            : "1px solid var(--border-color)",
                        }}
                      />
                      {errors.prefix && (
                        <div
                          className="text-red-500 text-[11px]"
                          style={{ marginTop: "1px" }}
                        >
                          {errors.prefix}
                        </div>
                      )}
                    </div>

                    {/* Telephone Field */}
                    <div
                      className={`mb-4 relative ${
                        errors.phoneNumber
                          ? "border-b-1 border-red-500"
                          : "border-b-1"
                      }`}
                    >
                      <label
                        className={
                          "absolute mb-3 text-[11px] transition-all duration-150 " +
                          (!focusedFields.phoneNumber ? "-z-10 top-5" : "")
                        }
                      >
                        TELEPHONE
                      </label>
                      <input
                        className="pt-5 pb-2 outline-none w-full text-[11px]"
                        name="phoneNumber"
                        type="tel"
                        placeholder={
                          !focusedFields.phoneNumber ? "TELEPHONE" : ""
                        }
                        value={formData.phoneNumber}
                        onFocus={() => handleInputFocus("phoneNumber")}
                        onChange={handlePhoneNumberChange}
                        onBlur={(ev) =>
                          handleInputBlur("phoneNumber", ev.target.value)
                        }
                        style={{
                          backgroundColor: "var(--bg-color)",
                          color: "var(--text-color)",
                          borderBottom: errors.phoneNumber
                            ? "1px solid red"
                            : "1px solid var(--border-color)",
                        }}
                        autoComplete="tel"
                      />
                      {errors.phoneNumber && (
                        <div
                          className="text-red-500 text-[11px]"
                          style={{ marginTop: "1px" }}
                        >
                          {errors.phoneNumber}
                        </div>
                      )}
                    </div>
                  </span>
                </div>
                <div className="BillingInputAreaSecond">
                  <div
                    className={`mb-4 relative ${
                      focusedFields.lastName
                        ? "border-b-1"
                        : "border-b-1 border-red-500"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.lastName ? "-z-10 top-5" : "")
                      }
                    >
                      LASTNAME
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="lastName"
                      type="text"
                      placeholder={!focusedFields.lastName ? "LASTNAME" : ""}
                      value={formData.lastName}
                      onFocus={() => handleInputFocus("lastName")}
                      onBlur={(ev) =>
                        handleInputBlur("lastName", ev.target.value)
                      }
                      onChange={handleInputChange}
                      style={{
                        borderBottom: focusedFields.lastName
                          ? "1px solid var(--border-color)"
                          : "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                      }}
                      autoComplete="family-name"
                    />
                    {!focusedFields.lastName && errors.lastName && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                  <div className="Privacyslecttwo opacity-0 disabled:true">
                    <label>SEND TO</label>
                    <select>
                      <option value="someOption">Aland Islands</option>
                    </select>
                  </div>
                  <div
                    className={`mb-4 relative ${
                      focusedFields.addressSecond
                        ? "border-b-1"
                        : "border-b-1 border-red-500"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.addressSecond ? "-z-10 top-5" : "")
                      }
                    >
                      ADDRESS 2
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="addressSecond"
                      type="text"
                      placeholder={
                        !focusedFields.addressSecond ? "ADDRESS 2" : ""
                      }
                      value={formData.addressSecond}
                      onFocus={() => handleInputFocus("addressSecond")}
                      onBlur={(ev) =>
                        handleInputBlur("addressSecond", ev.target.value)
                      }
                      onChange={handleInputChange}
                      style={{
                        borderBottom: focusedFields.addressSecond
                          ? "1px solid var(--border-color)"
                          : "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                      }}
                      autoComplete="address-line2"
                    />
                    {!focusedFields.addressSecond && errors.addressSecond && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.addressSecond}
                      </div>
                    )}
                  </div>
                  <div
                    className={`mb-4 relative ${
                      focusedFields.zipCode
                        ? "border-b-1"
                        : "border-b-1 border-red-500"
                    }`}
                  >
                    <label
                      className={
                        "absolute mb-3 text-[11px] transition-all duration-150 " +
                        (!focusedFields.zipCode ? "-z-10 top-5" : "")
                      }
                    >
                      POSTCODE/ZIP
                    </label>
                    <input
                      className="pt-5 pb-2 outline-none w-full text-[11px]"
                      name="zipCode"
                      type="text"
                      placeholder={!focusedFields.zipCode ? "POSTCODE/ZIP" : ""}
                      value={formData.zipCode}
                      onFocus={() => handleInputFocus("zipCode")}
                      onBlur={(ev) =>
                        handleInputBlur("zipCode", ev.target.value)
                      }
                      onChange={handleInputChange}
                      style={{
                        borderBottom: focusedFields.zipCode
                          ? "1px solid var(--border-color)"
                          : "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                      }}
                      autoComplete="postal-code"
                    />
                    {!focusedFields.zipCode && errors.zipCode && (
                      <div
                        className="text-red-500 text-[11px]"
                        style={{
                          marginTop: "1px",
                        }}
                      >
                        {errors.zipCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <div className="sticky bottom-0 z-50">
        <div className="CartpropccessOrder">
          <div className="CartPropssesstitle opacity-0">
            *By continuing, I declare that I have read and accept the Purchase
            Conditions and understand Zara's Privacy and Cookie Policy.
          </div>
          <div className="CartProccesses">
            <div>
              <p>SHIPPING</p>
              {Loading ? (
                <span>Loading...</span>
              ) : (
                <span>PKR = {cart.totalPrice} Only.</span>
              )}
            </div>
            <div
              className="Cartcontinuebutton"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <button className="Contiun">CONTINUE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address_Conform;
