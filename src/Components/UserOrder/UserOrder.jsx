import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { userContext } from "../../Context/UserContext";

function UserOrder() {
  const navigation = useNavigate();
  const { token } = useContext(userContext);

  useEffect(() => {
    if (!token) {
      navigation("/Login");
    }
  }, [token]); // Dependency add ki hai

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return token ? ( // Directly check kar diya
    <div>
      <div
        className="sticky top-0 z-10"
        style={{
          marginTop: "-9px",
        }}
      >
        <div
          className="absolute w-full"
          style={{ backgroundColor: "var(--bg-color)" }}
        >
          <Navbar />
        </div>
      </div>
      <div className="pt-32">UserOrder</div>
    </div>
  ) : null; // Agr token na ho to render hi mat kar
}

export default UserOrder;
