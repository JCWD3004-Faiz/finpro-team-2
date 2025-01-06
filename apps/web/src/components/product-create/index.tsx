"use client";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/slices/manageCategorySlice";
import {
  createProduct,
  setFormData,
  resetFormData,
} from "@/redux/slices/manageProductSlice";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";
import { manageProductSchema } from "@/utils/manageProductSchema";

export default function NewProduct() {
  type CustomError = AxiosError<{ error: string }>;
  const dispatch = useDispatch<AppDispatch>();

  const { allCategory } = useSelector(
    (state: RootState) => state.manageCategory
  );

  const { formData, loading } = useSelector(
    (state: RootState) => state.manageProduct
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSizeInMB = 1; // Maximum file size in MB
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > maxSizeInBytes) {
        dispatch(
          showError(
            `File "${file.name}" exceeds the maximum size of ${maxSizeInMB}MB.`
          )
        );
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      dispatch(showError("No valid files to upload. Please try again."));
      return;
    }

    const newImages = Array.from(files);
    dispatch(
      setFormData({
        field: "images",
        value: [...formData.images, ...newImages].slice(0, 4),
      })
    );
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    dispatch(setFormData({ field, value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert("Please select a valid category.");
      return;
    }
    try {
      const validatedData = manageProductSchema.parse(formData);
      await dispatch(createProduct(validatedData)).unwrap();
      dispatch(showSuccess("Product successfully created"));
      dispatch(resetFormData());
    } catch (error) {
      let errorMessage = "Failed to create category";
      if (error instanceof ZodError) {
        errorMessage = error.errors.map((e) => e.message).join(", ");
      } else if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      dispatch(showError(errorMessage));
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to add a new grocery product to the
              store.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) =>
                      handleChange("category_id", Number(value))
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategory.map((category, index) => (
                        <SelectItem
                          key={category.category_id}
                          value={String(category.category_id)}
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.product_name}
                    onChange={(e) =>
                      handleChange("product_name", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="mt-1 h-32"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price || ""}
                    onChange={(e) =>
                      handleChange("price", Number(e.target.value))
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label>Product Images</Label>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                      >
                        {formData.images[index] ? (
                          <img
                            src={URL.createObjectURL(formData.images[index])}
                            alt={`Product ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">
                              Upload Image {index + 1}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload up to 4 product images. First image will be the main
                    display image. Max image size is 1MB
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
