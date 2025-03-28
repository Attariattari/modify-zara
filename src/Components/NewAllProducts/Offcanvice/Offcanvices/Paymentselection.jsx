import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";

function Paymentselection({ closeDrawer }) {
  return (
    <>
      {" "}
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5" color="blue-gray"></Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={closeDrawer}
          className="sticky top-0 "
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--text-color)"
            stroke="inherit"
            class="zds-dialog-icon-button__icon zds-dialog-close-button__icon"
          >
            <path d="m12 12.707 6.846 6.846.708-.707L12.707 12l6.847-6.846-.707-.708L12 11.293 5.154 4.446l-.707.708L11.293 12l-6.846 6.846.707.707L12 12.707Z"></path>
          </svg>
        </IconButton>
      </div>
      <Typography className="mb-8 font-normal">
        <div className="CardArea">
          <div onClick={() => handleCardClick("VISA")}>
            <img
              src="https://static.zara.net/static/images/payment/NewIcon/Icons_Payment_Methods/Payments/SVG/icon-payment-visa_new.svg"
              alt=""
            />
            <p>VISA</p>
          </div>
          <div onClick={() => handleCardClick("MASTERCARD")}>
            <img
              src="https://static.zara.net/static/images/payment/NewIcon/Icons_Payment_Methods/Payments/SVG/icon-payment-mastercard.svg"
              alt=""
            />
            <p>MASTERCARD</p>
          </div>
        </div>
      </Typography>
    </>
  );
}

export default Paymentselection;
