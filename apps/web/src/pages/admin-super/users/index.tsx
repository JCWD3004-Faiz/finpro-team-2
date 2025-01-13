"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuperSidebar from "@/components/SuperSidebar";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination";
import LoadingVignette from "@/components/LoadingVignette";
import SuccessModal from "@/components/modal-success";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ErrorModal from "@/components/modal-error";
import { hideSuccess } from "@/redux/slices/successSlice";
import { hideError } from "@/redux/slices/errorSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllUsers, setCurrentPage } from "@/redux/slices/getUserSlice";
import UsersAdminTable from "@/components/users-admin-table";
import SearchField from "@/components/searchField";
import { FaUser } from "react-icons/fa";
import useDebounce from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const {
    allUser,
    role,
    search,
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,
  } = useSelector((state: RootState) => state.getUsers);
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  const toggleSidebar = () => {
    dispatch({ type: "superAdmin/toggleSidebar" });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const getActiveColor = (active: boolean) => {
    switch (active) {
      case true:
        return "bg-green-500";
      case false:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page: currentPage,
        pageSize: 10,
        search: debouncedQuery,
        role: selectedRole === "ALL" ? "" : selectedRole,
      })
    );
  }, [currentPage, debouncedQuery, dispatch, selectedRole]);

  console.log("all users: ", allUser);

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette />}
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Users
        </h1>
        <div>
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
            <div className="my-5 w-full">
              <SearchField
                className=""
                placeholder="Search Users..."
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <div className="mt-4 bg-white p-4 rounded-md shadow-md">
                <Select
                  onValueChange={(value) => {
                    setSelectedRole(value); // Update selected role when dropdown value changes
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full mt-2 sm:w-1/2 lg:w-1/4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-gray-700 text-sm font-medium ">
                    Total Users
                  </CardTitle>
                  <FaUser className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="min-w-full bg-white text-xs shadow-2xl rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {allUser.map((user, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b hover:bg-gray-100 transition-colors`}
                  >
                    <td className="p-4 text-gray-700 font-medium">
                      {user.username}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {user.email}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {user.role}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {user.referral_code}
                    </td>
                    <td className="p-4 text-gray-700 text-sm text-center">
                      <div
                        className={`${getActiveColor(user.is_verified)} font-bold py-2 rounded-full text-white`}
                      >
                        {user.is_verified ? "Yes" : "No"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {new Date(user.created_at).toLocaleDateString("en-US")}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {new Date(user.updated_at).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Users;
