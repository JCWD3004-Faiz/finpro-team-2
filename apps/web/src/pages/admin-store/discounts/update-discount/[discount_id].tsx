"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import StoreSidebar from "@/components/StoreSidebar";
import UpdateDiscountComponent from "@/components/discount-update";
import LoadingVignette from "@/components/LoadingVignette";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess } from "@/redux/slices/successSlice";
import { hideError } from "@/redux/slices/errorSlice";

function UpdateDiscount() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const discount_id = Number(params?.discount_id);
  const { isSidebarOpen } = useSelector((state: RootState) => state.storeAdmin);
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  const { loading, error } = useSelector(
    (state: RootState) => state.updateDiscount // Adjust if the slice is named differently
  );
  const toggleSidebar = () => {
    dispatch({ type: "storeAdmin/toggleSidebar" });
  };

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <StoreSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette />}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
          window.location.href = "/admin-store/dashboard";
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
          Discount Details
        </h1>
        <UpdateDiscountComponent discount_id={discount_id} />
      </div>
    </div>
  );
}

export default UpdateDiscount;
