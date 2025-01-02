"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createCategory } from "@/redux/slices/manageCategorySlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";

function CategoryCreate() {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateCategory = () => {
    if (!categoryName.trim()) {
      dispatch(showError("Category name cannot be empty"));
      return;
    }

    if (categoryName.trim().length > 50) {
      dispatch(showError("Category name cannot exceed 50 characters"));
      return;
    }

    dispatch(createCategory({ category_name: categoryName }))
      .unwrap()
      .then(() => {
        dispatch(showSuccess("Category successfully created"));
        setCategoryName("");
      })
      .catch((error) => {
        console.log("component error: ", error);
        const errorMessage = error.response?.data?.error || "Failed to create category";
        dispatch(showError(errorMessage));
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Create a new Category
      </h2>
      <Card className="p-4 w-full">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          <Input
            className="w-full"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button onClick={handleCreateCategory}>Create Category</Button>
        </div>
      </Card>
    </div>
  );
}

export default CategoryCreate;
