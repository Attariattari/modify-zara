import React, { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./css.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Swal from "sweetalert2";
import { userContext } from "../../../Context/UserContext";
import Spinner from "../../../Spinner";

// Validation Schema
const MainCategorySchema = z.object({
  MainCategoryName: z
    .string()
    .nonempty({ message: "Main Category Name is required" }),
});

const SubCategorySchema = z.object({
  MainCategory_id: z
    .string()
    .nonempty({ message: "MainCategory ID is required" }),
  SubMainCategory: z.string().nonempty({ message: "Sub Category is required" }),
});

const ChildCategorySchema = z.object({
  SubMainCategory_id: z
    .string()
    .nonempty({ message: "SubMainCategory ID is required" }),
  ChildSubCategory: z
    .string()
    .nonempty({ message: "Child Category is required" }),
});

const Add = ({ closePopup, type, fetchData }) => {
  const { token } = useContext(userContext);
  const [state, setState] = useState({
    Loading: false,
    data: [],
    selectedMainCategoryId: "",
    selectedSubCategoryId: "",
  });

  // Initialize the correct schema based on the type
  const getSchema = () => {
    if (type === "subcategory") {
      return SubCategorySchema;
    } else if (type === "childcategory") {
      return ChildCategorySchema;
    }
    return MainCategorySchema;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getSchema()), // Use schema based on type
    defaultValues: {
      MainCategoryName: "",
    },
  });

  // Update schema dynamically when the type changes
  useEffect(() => {
    const schema = getSchema(); // Get the current schema based on the type
    // console.log("Current Schema Shape:", schema._def.shape()); // Log the shape of the schema
    reset({}, { keepValues: false, resolver: zodResolver(schema) }); // Update the form resolver
  }, [type]);

  // Data Fetching Function
  const data_fetch = async () => {
    try {
      setState((prevState) => ({ ...prevState, Loading: true }));

      let response;
      if (type === "subcategory") {
        response = await axios.get(
          "http://localhost:1122/MainCategory/getAll",
          {
            withCredentials: true,
            headers: { authenticate: `Bearer ${token}` },
          }
        );
      } else if (type === "childcategory") {
        response = await axios.get(
          `http://localhost:1122/SubMainCategory/getAll`,
          {
            withCredentials: true,
            headers: { authenticate: `Bearer ${token}` },
          }
        );
      }

      const responseData =
        type === "subcategory" ? response?.data : response?.data?.data;

      setState((prevState) => ({
        ...prevState,
        Loading: false,
        data: Array.isArray(responseData) ? responseData : [],
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setState((prevState) => ({ ...prevState, Loading: false }));
    }
  };

  useEffect(() => {
    data_fetch();
  }, []);

  // Submit Handler
  const onSubmit = async (data) => {
    setState((prevState) => ({ ...prevState, Loading: true }));

    try {
      let response;
      switch (type) {
        case "category":
          response = await axios.post(
            "http://localhost:1122/MainCategory/Create",
            data,
            {
              withCredentials: true,
              headers: { Authenticate: `Bearer ${token}` },
            }
          );
          break;

        case "subcategory":
          response = await axios.post(
            "http://localhost:1122/SubMainCategory/Create",
            {
              MainCategory_id: data.MainCategory_id,
              SubMainCategory: data.SubMainCategory,
            },
            {
              withCredentials: true,
              headers: { Authenticate: `Bearer ${token}` },
            }
          );
          break;

        case "childcategory":
          response = await axios.post(
            "http://localhost:1122/ChildSubCategory/Create",
            {
              SubMainCategory_id: data.SubMainCategory_id,
              ChildSubCategory: data.ChildSubCategory,
            },
            {
              withCredentials: true,
              headers: { Authenticate: `Bearer ${token}` },
            }
          );
          break;

        default:
          throw new Error("Invalid type");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message || "Operation completed successfully!",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Something went wrong!";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    } finally {
      setState((prevState) => ({ ...prevState, Loading: false }));
      closePopup(false);
    }
  };

  const getPopupContent = () => {
    const title =
      type === "category"
        ? "Add Main Category"
        : type === "subcategory"
        ? "Add Sub Category"
        : "Add Child Category";

    return (
      <div className="category-area">
        <div className="category-topbar">{title}</div>
        <form className="category-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="category-body">
            {(type === "subcategory" || type === "childcategory") && (
              <div>
                <label>
                  {type === "subcategory"
                    ? "Select Main Category"
                    : "Select Sub Category"}
                </label>
                <Controller
                  name={
                    type === "subcategory"
                      ? "MainCategory_id"
                      : "SubMainCategory_id"
                  }
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      value={field.value || ""} // Default value set to empty string
                      onChange={(e) => field.onChange(e.target.value)} // Handle changes manually
                    >
                      <option value="" disabled>
                        {type === "subcategory"
                          ? "Select Main Category"
                          : "Select Sub Category"}
                      </option>

                      {state.data?.length > 0 ? (
                        state.data.map((item) => {
                          const displayName =
                            type === "subcategory"
                              ? item.MainCategoryName
                              : item.SubMainCategory || "Unnamed Subcategory";

                          return (
                            <option key={item._id} value={item._id}>
                              {displayName}
                            </option>
                          );
                        })
                      ) : (
                        <option disabled>No Data Available</option>
                      )}
                    </select>
                  )}
                />
                {/* Select field error */}
                {errors.MainCategory_id && (
                  <p className="error">{errors.MainCategory_id.message}</p>
                )}
                {errors.SubMainCategory_id && (
                  <p className="error">{errors.SubMainCategory_id.message}</p>
                )}
              </div>
            )}

            <div>
              <label>
                {type === "category"
                  ? "Category Name"
                  : type === "subcategory"
                  ? "Sub Category Name"
                  : "Child Category Name"}
              </label>
              <Controller
                name={
                  type === "category"
                    ? "MainCategoryName"
                    : type === "subcategory"
                    ? "SubMainCategory"
                    : "ChildSubCategory"
                }
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="Enter Name" />
                )}
              />
              {/* Input field error */}
              {errors.MainCategoryName && (
                <p className="error">{errors.MainCategoryName.message}</p>
              )}
              {errors.SubMainCategory && (
                <p className="error">{errors.SubMainCategory.message}</p>
              )}
              {errors.ChildSubCategory && (
                <p className="error">{errors.ChildSubCategory.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={state.Loading}
              className="Add-button"
            >
              <span>{state.Loading ? "Adding..." : "Add"}</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="add">
      <Popup
        open={!!type} // Show popup if type is truthy
        onClose={closePopup}
        modal
        lockScroll
        overlayClassName="popup-overlay"
        contentStyle={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          width: "400px",
          minWidth: "auto",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          height: "450px",
          borderRadius: "0px",
          overflowY: "auto",
          padding: "0px",
        }}
      >
        {state.Loading ? (
          <div className="loading-spinner">
            <Spinner />
          </div>
        ) : (
          getPopupContent()
        )}
      </Popup>
    </div>
  );
};

export default Add;
