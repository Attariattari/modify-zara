import { createContext, useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 import
import { userContext } from "./UserContext";

const AddressContext = createContext();

const AddressProvider = ({ children }) => {
  const [state, setState] = useState({
    addresses: [],
    loading: false,
    error: null,
  });

  const { token } = useContext(userContext);

  // 📌 Address add karne ki API
  const addAddress = async (addressData) => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const { data } = await axios.post(
        "http://localhost:1122/Address/add",
        addressData,
        {
          headers: { Authenticate: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setState((prevState) => ({
        ...prevState,
        addresses: [...prevState.addresses, data],
        loading: false,
        error: null,
      }));

      // ✅ Success Swal Alert with API response
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data?.message || "Address added successfully!",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("❌ Error adding address:", errorMessage);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));

      // ❌ Error Swal Alert with API response
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Okay",
      });
    }
  };

  // 📌 Sare addresses fetch karne ki API
  const fetchAddresses = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const { data } = await axios.get("http://localhost:1122/Address/", {
        headers: { Authenticate: `Bearer ${token}` },
        withCredentials: true,
      });

      setState((prevState) => ({
        ...prevState,
        addresses: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error fetching addresses:", errorMessage);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));

      // ❌ Error Swal Alert
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Addresses",
        text: errorMessage,
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <AddressContext.Provider value={{ ...state, addAddress, fetchAddresses }}>
      {children}
    </AddressContext.Provider>
  );
};

// Custom hook taake easily context use kar sakein
const useAddressContext = () => {
  return useContext(AddressContext);
};

export { AddressProvider, useAddressContext };
