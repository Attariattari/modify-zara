import { Typography } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useAddressContext } from "../../../../Context/AddressContext";

const AddressDrawer = ({ CloseSizeView }) => {
  const { addresses, loading, error, fetchAddresses } = useAddressContext();
  useEffect(() => {
    fetchAddresses();
  }, []);

  const defaultAddress = addresses.find((address) => address.isDefault);
  return (
    <div className="container">
      <div className="mb-6 mt-3 flex items-center justify-between">
        <Typography variant="h5" color="blue-gray"></Typography>
        <div
          variant="text"
          color="blue-gray"
          onClick={CloseSizeView}
          className="sticky top-0 pr-4"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="inherit"
            stroke="inherit"
            class="zds-dialog-icon-button__icon zds-dialog-close-button__icon cursor-pointer"
          >
            <path d="m12 12.707 6.846 6.846.708-.707L12.707 12l6.847-6.846-.707-.708L12 11.293 5.154 4.446l-.707.708L11.293 12l-6.846 6.846.707.707L12 12.707Z"></path>
          </svg>
        </div>
      </div>
      <p className="Adreestitle" style={{ fontSize: "13px" }}>
        SELECTED DELIVERY LOCATION
      </p>
      <div className="addressfeild">
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
            <p>Edit</p>
          </>
        ) : (
          <p>No default address found</p>
        )}
      </div>
      <button className="addresbutton">ADD NEW HOME ADDRESS</button>
    </div>
  );
};

export default AddressDrawer;
