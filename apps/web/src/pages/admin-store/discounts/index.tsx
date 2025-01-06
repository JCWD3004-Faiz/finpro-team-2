"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SuperSidebar from "@/components/SuperSidebar";
import LoadingVignette from "@/components/LoadingVignette";
import StoreSidebar from "@/components/StoreSidebar";
import DiscountAdminTable from "@/components/discount-admin-table";
import { Button } from "@/components/ui/button";
import { MdDiscount } from "react-icons/md";

function DiscountManagment() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isSidebarOpen, storeName } = useSelector(
    (state: RootState) => state.storeAdmin
  );

  const { loading } = useSelector((state: RootState) => state.getDiscount);

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
      <div
        className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6 relative`}
      >
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          {storeName} Discounts
        </h1>
        <Button
          size="default"
          onClick={() => router.push("/admin-store/discounts/create-discount")}
        >
          <MdDiscount/> 
          Create a Discount
        </Button>
        <div className="mt-5">
          <DiscountAdminTable />
        </div>
      </div>
    </div>
  );
}

export default DiscountManagment;
