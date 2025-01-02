import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchProductDetails,
  updateProductField,
  updateProductImage,
} from "@/redux/slices/manageProductSlice";
import { ProductField } from "./product-field";
import { ProductImage } from "./product-image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ProductDetail } from "@/utils/reduxInterface";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";
import { AxiosError } from "axios";
import { ZodError } from "zod";
import { updateProductSchema } from "@/utils/updateProductSchema";

interface UpdateProductProps {
  product_id: number;
}

type UpdateProductFields = "category_id" | "product_name" | "description" | "price"

function UpdateProductComponent({ product_id }: UpdateProductProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { productDetail, loading, error } = useSelector(
    (state: RootState) => state.manageProduct
  );
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleFieldUpdate = (field: UpdateProductFields, value: string) => {
    try {
      // Validate the specific field and value using the schema
      const validatedData = updateProductSchema.parse({
        [field]: value,
      });

      // Dispatch the updateProductField action with validated data
      dispatch(
        updateProductField({
          productId: productDetail?.product_id || 0,
          field,
          value: validatedData[field] as string,
        })
      )
        .unwrap()
        .then(() => dispatch(showSuccess("Product successfully updated")))
        .catch((error) => {
          let errorMessage = "Failed to update product";
          if (error instanceof AxiosError && error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          dispatch(showError(errorMessage));
        });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const errorMessage = error.errors.map((e) => e.message).join(", ");
        dispatch(showError(errorMessage));
      } else {
        // Handle unexpected errors
        dispatch(showError("An unexpected error occurred."));
      }
    }
  };

  const handleImageChange = (file: File, index: number) => {
    const newImageFiles = [...imageFiles];
    newImageFiles[index] = file;
    setImageFiles(newImageFiles);
  };

  const handleImageUpdate = async (index: number, file: File) => {
    if (!file || !productDetail) return;
    const imageId = productDetail.product_images[index]?.image_id;
    dispatch(
      updateProductImage({ imageId: imageId, imageFile: file, index })
    )
      .unwrap()
      .then(() => dispatch(showSuccess("Image updated successfully.")))
      .catch((error) => {
        dispatch(showError(error));
      });
  };
  

  useEffect(() => {
    dispatch(fetchProductDetails(product_id));
  }, [dispatch, product_id]);

  useEffect(() => {
    if (productDetail) {
      setProduct(productDetail);
    }
  }, [productDetail]);

  return (
    <div className="container mx-auto pb-8">

      <div className="space-y-6">
        <Card className="p-6">
          <div className="">
          <Label className="font-semibold" htmlFor="name">Product Name</Label>
            <ProductField
              isLoading={loading}
              onUpdate={() =>
                handleFieldUpdate("product_name", product?.product_name || "")
              }
            >
              <Input
                value={product?.product_name}
                onChange={(e) =>
                  setProduct((prev) =>
                    prev ? { ...prev, product_name: e.target.value } : null
                  )
                }
                className="flex-1"
                placeholder="Product Name"
              />
            </ProductField>
            <Label className="font-semibold" htmlFor="description">Description</Label>
            <ProductField
              isLoading={loading}
              onUpdate={() =>
                handleFieldUpdate("description", product?.description || "")
              }
            >
              <Textarea
                value={product?.description}
                onChange={(e) =>
                  setProduct((prev) =>
                    prev
                      ? {
                          ...prev,
                          description: e.target.value,
                        }
                      : null
                  )
                }
                className="flex-1"
                placeholder="Product Description"
              />
            </ProductField>
            <Label className="font-semibold" htmlFor="price">Price Rp</Label>
            <ProductField
              isLoading={loading}
              onUpdate={() =>
                handleFieldUpdate("price", String(product?.price))
              }
            >
              <Input
                type="number"
                value={product?.price}
                onChange={(e) =>
                  setProduct((prev) =>
                    prev
                      ? {
                          ...prev,
                          price: parseFloat(e.target.value),
                        }
                      : null
                  )
                }
                className="flex-1"
                placeholder="Price"
                step="0.01"
              />
            </ProductField>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productDetail?.product_images?.length ? (
              productDetail.product_images.map((image, index) => (
                <ProductImage
                  key={index}
                  src={image.product_image}
                  index={index}
                  isLoading={loading}
                  onImageChange={handleImageChange}
                  onUpdateClick={() => handleImageUpdate(index, imageFiles[index])}
                />
              ))
            ) : (
              <p>No product images available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default UpdateProductComponent;
