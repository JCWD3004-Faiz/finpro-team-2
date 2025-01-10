"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SuperSidebar from "@/components/SuperSidebar";
import { Button } from "@/components/ui/button";
import ProductAdminTable from "@/components/products-admin-table";
import LoadingVignette from "@/components/LoadingVignette";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdCategory } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import ConfirmationModal from "@/components/modal-confirm";
import { hideConfirmation } from "@/redux/slices/confirmSlice";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess } from "@/redux/slices/successSlice";
import { hideError } from "@/redux/slices/errorSlice";

function ManageProducts() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { loading, error, totalItems } = useSelector(
    (state: RootState) => state.manageProduct
  );
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
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
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Products Management
        </h1>
        <div className="ml-1 mb-2 flex flex-col gap-5 lg:flex-row lg:justify-between">
          <div className="flex flex-col justify-center gap-5">
            <Button
              size="default"
              onClick={() => router.push("/admin-super/products/create")}
            >
              <FaShoppingBag />
              Upload a Product
            </Button>
            <Button
              size="default"
              onClick={() => router.push("/admin-super/products/category")}
            >
              <MdCategory />
              Manage Categories
            </Button>
          </div>
          <div className="w-full mt-2 sm:w-1/2 lg:w-1/4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-gray-700 text-sm font-medium ">
                  Total Products
                </CardTitle>
                <FaShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <ProductAdminTable />
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;
