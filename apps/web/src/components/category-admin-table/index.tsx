"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchAllCategories,
  setCurrentPage,
  setEditId,
  resetEditState,
  updateCategory,
  deleteCategory,
} from "@/redux/slices/manageCategorySlice";
import SearchField from "../searchField";
import Pagination from "../pagination";
import useDebounce from "@/hooks/useDebounce";
import { MdDelete, MdEditSquare, MdSaveAs } from "react-icons/md";
import { Category } from "@/utils/reduxInterface";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";
import {
  showConfirmation,
  hideConfirmation,
} from "@/redux/slices/confirmSlice";

function CategoryAdminTable() {
  const dispatch = useDispatch<AppDispatch>();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [editCategoryData, setEditCategoryData] = useState({
    category_name: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { category, editId, loading, error, currentPage, totalPages } =
    useSelector((state: RootState) => state.manageCategory);

  const handleEditClick = (cat: Category) => {
    if (editId === cat.category_id) {
      dispatch(resetEditState());
    } else {
      dispatch(setEditId(cat.category_id));
      setEditCategoryData({ category_name: cat.category_name });
    }
  };

  const handleSaveClick = async (categoryId: number) => {
    if (!editCategoryData.category_name.trim()) {
      dispatch(showError("Category name cannot be empty"));
      return;
    }

    if (editCategoryData.category_name.length > 50) {
      dispatch(showError("Category name cannot exceed 50 characters"));
      return;
    }
    try {
      await dispatch(
        updateCategory({ category_id: categoryId, ...editCategoryData })
      );
      dispatch(resetEditState());
      dispatch(showSuccess("Category successfully edited"));
    } catch (error) {
      dispatch(showError("Failed to edit Category"));
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    dispatch(
      showConfirmation({
        message: "Are you sure you want to delete this item?",
        onConfirm: () => {
          dispatch(deleteCategory({ category_id: categoryId }))
            .unwrap()
            .then(() => {
              dispatch(showSuccess("Category successfully deleted"));
            })
            .catch((error) => {
              dispatch(showError("Failed to delete category"));
            })
            .finally(() => {
              dispatch(hideConfirmation());
            });
        },
      })
    );
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setEditCategoryData({ ...editCategoryData, [field]: value });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        dispatch(resetEditState());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllCategories({
        page: currentPage,
        pageSize: 10,
        search: debouncedQuery,
      })
    );
  }, [currentPage, debouncedQuery, dispatch]);

  return (
    <>
      <div className="mt-5">
        <SearchField
          className=""
          placeholder="Search categories..."
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="overflow-x-auto mt-2">
        <table
          ref={tableRef}
          className="min-w-full bg-white shadow-2xl rounded-lg overflow-hidden"
        >
          <thead>
            <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
              <th className="p-4">Category Name</th>
              <th className="p-4">Total Products</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {category.map((cat, index) => (
              <tr
                key={cat.category_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b hover:bg-gray-100 transition-colors`}
              >
                <td className="p-4 text-gray-600">
                  {editId === cat.category_id ? (
                    <input
                      type="text"
                      value={editCategoryData.category_name}
                      onChange={(e) => handleChange(e, "category_name")}
                      className="border-b-2 border-indigo-600 focus:outline-none"
                    />
                  ) : (
                    cat.category_name
                  )}
                </td>
                <td className="p-4 text-gray-600">{cat.totalProducts}</td>
                <td className="p-4 text-gray-600">
                  {new Date(cat.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    title="Edit store"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editId === cat.category_id) {
                        handleSaveClick(cat.category_id); // Save changes
                      } else {
                        handleEditClick(cat); // Enter edit mode
                      }
                    }}
                    className="mx-2 py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
                  >
                    {editId === cat.category_id ? (
                      <MdSaveAs className="text-2xl" />
                    ) : (
                      <MdEditSquare className="text-2xl" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat.category_id);
                    }}
                    className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform"
                    title="Delete store"
                  >
                    <MdDelete className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default CategoryAdminTable;
