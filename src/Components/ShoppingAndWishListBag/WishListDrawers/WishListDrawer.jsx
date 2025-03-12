import React, { useState } from "react";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import "./Css.css";
function WishListDrawer({
  drawerType,
  closeDrawer,
  label = "Name",
  error,
  createWishlist,
  isLoading,
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [sfocused, setSfocused] = useState(false);
  const [Svalue, setSvalue] = useState("");
  const handleCreateWishlist = async () => {
    closeDrawer(); // Pehle close karo
    isLoading;
    try {
      await createWishlist(value); // Request bhejo
      setValue("");
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        drawerType === "create_list" && closeDrawer(); // Agar error ho to wapas open karo
      }, 100);
    }
  };

  return (
    <React.Fragment>
      <Drawer
        open={drawerType && ["create_list", "setting"].includes(drawerType)}
        size={window.innerWidth < 768 ? "100%" : 384}
        onClose={closeDrawer}
        placement="right"
        className="p-4 overflow-y-scroll bg=[var(--bg-color)] Custom-Drawer"
      >
        {drawerType === "create_list" && (
          <div className="contentWrapper">
            <div className="mb-6 flex items-center justify-between">
              <Typography
                variant="h5"
                color="blue-gray"
                className="opacity-0"
              ></Typography>
              <IconButton variant="text" onClick={closeDrawer}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="var(--text-color)"
                  stroke="inherit"
                  className="zds-dialog-icon-button__icon zds-dialog-close-button__icon"
                >
                  <path d="m12 12.707 6.846 6.846.708-.707L12.707 12l6.847-6.846-.707-.708L12 11.293 5.154 4.446l-.707.708L11.293 12l-6.846 6.846.707.707L12 12.707Z"></path>
                </svg>
              </IconButton>
            </div>
            <Typography>
              <div>CREATE LIST</div>
            </Typography>
            {isLoading ? (
              <div className="w-full p-10 flex justify-center items-center">
                Loading ...
              </div>
            ) : (
              <Typography>
                <div className="mt-16 ">
                  <div className="relative w-full">
                    <label
                      className={`absolute text-xs left-2 transition-all duration-200 ${
                        focused || value
                          ? "-top-2 text-[var(--text-color)] text-xs"
                          : "top-1/2 transform -translate-y-1/2 opacity-70"
                      }`}
                    >
                      {label}
                    </label>

                    {/* Input */}
                    <input
                      type="text"
                      name={label.toLowerCase()}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => !value && setFocused(false)}
                      className="w-full bg-transparent text-xs outline-none  border-b-2 border-gray-300 pt-4 transition-all duration-200"
                      style={{
                        color: "var(--text-color)",
                        borderBottomColor: error ? "red" : "var(--text-color)", // Border color same rahega
                      }}
                    />

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-500 text-xs mt-1">{error}</div>
                    )}
                  </div>

                  <button
                    className="CraeteButton"
                    onClick={handleCreateWishlist}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "CREATE"}
                  </button>
                </div>
              </Typography>
            )}
          </div>
        )}
        {drawerType === "setting" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <Typography
                variant="h5"
                color="blue-gray"
                className="opacity-0"
              ></Typography>
              <IconButton variant="text" onClick={closeDrawer}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="var(--text-color)"
                  stroke="inherit"
                  className="zds-dialog-icon-button__icon zds-dialog-close-button__icon"
                >
                  <path d="m12 12.707 6.846 6.846.708-.707L12.707 12l6.847-6.846-.707-.708L12 11.293 5.154 4.446l-.707.708L11.293 12l-6.846 6.846.707.707L12 12.707Z"></path>
                </svg>
              </IconButton>
            </div>
            <Typography>
              <div>LIST SETTINGS</div>
            </Typography>
            <Typography>
              <div className="mt-16 ">
                <div className="relative w-full">
                  <label
                    className={`absolute text-xs left-2 transition-all duration-200 ${
                      sfocused || Svalue
                        ? "-top-2 text-[var(--text-color)] text-xs"
                        : "top-1/2 transform -translate-y-1/2 opacity-70"
                    }`}
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    name={label.toLowerCase()}
                    value={Svalue}
                    onChange={(e) => setSvalue(e.target.value)}
                    onFocus={() => setSfocused(true)}
                    onBlur={() => !Svalue && setSfocused(false)}
                    className="w-full bg-transparent text-xs outline-none  border-b-2 border-gray-300 pt-4 transition-all duration-200"
                    style={{
                      color: "var(--text-color)",
                      borderBottomColor: error ? "red" : "var(--text-color)", // Border color same rahega
                    }}
                  />

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-500 text-xs mt-1">{error}</div>
                  )}
                </div>
                <div className="Privacyslect mt-3">
                  <label className="text-xs">PRIVACY</label>
                  <select>
                    <option value="someOption">PUBLIC</option>
                    <option value="otherOption">PRIVATE</option>
                  </select>
                </div>
                <button className="CraeteButton">SAVE</button>
              </div>
            </Typography>
          </div>
        )}
      </Drawer>
    </React.Fragment>
  );
}

export default WishListDrawer;
