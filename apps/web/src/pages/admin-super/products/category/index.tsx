"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SuperSidebar from "@/components/SuperSidebar";
import { Button } from "@/components/ui/button";
import { BsBoxSeamFill } from "react-icons/bs";
import CategoryAdminTable from "@/components/category-admin-table";
import CategoryCreate from "@/components/category-create";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess } from "@/redux/slices/successSlice";
import LoadingVignette from "@/components/LoadingVignette";
import { hideError } from "@/redux/slices/errorSlice";
import ConfirmationModal from "@/components/modal-confirm";
import { showConfirmation, hideConfirmation } from "@/redux/slices/confirmSlice";

function ManageCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { loading, error, totalItems } = useSelector(
    (state: RootState) => state.manageCategory
  );
  const { isConfirmationOpen, confirmationMessage, onConfirm } = useSelector(
    (state: RootState) => state.confirm
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
          window.location.reload();
        }}
        successMessage={successMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message={confirmationMessage || "Are you sure you want to proceed?"}
        onConfirm={() => {
          if (onConfirm) {
            onConfirm(); // Execute the confirmation action
          }
          dispatch(hideConfirmation()); // Close the modal after confirmation
        }}
        onClose={() => dispatch(hideConfirmation())} // Close the modal if canceled
      />
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Category Management
        </h1>
        <div className="grid grid-cols-1 gap-5">
          <CategoryCreate/>
          <CategoryAdminTable />
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
