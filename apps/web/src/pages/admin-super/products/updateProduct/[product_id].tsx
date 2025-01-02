"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SuperSidebar from "@/components/SuperSidebar";
import LoadingVignette from "@/components/LoadingVignette";
import UpdateProductComponent from "@/components/product-update";
import SuccessModal from "@/components/modal-success";
import { hideSuccess } from "@/redux/slices/successSlice";
import ErrorModal from "@/components/modal-error";
import { hideError } from "@/redux/slices/errorSlice";

function UpdateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const product_id = Number(params?.product_id);

  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  const { loading, error } = useSelector(
    (state: RootState) => state.manageProduct
  );
  const toggleSidebar = () => {
    dispatch({ type: "superAdmin/toggleSidebar" });
  };
  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette />}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
          window.location.href = '/admin-super/products'
        }}
        successMessage={successMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Update Product 
        </h1>
        <UpdateProductComponent
        product_id={product_id}
        />
      </div>
    </div>
  );
}

export default UpdateProduct;
