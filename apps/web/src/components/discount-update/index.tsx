import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchDiscountDetails,
  toggleIsActive,
  saveUpdatedValue,
  saveUpdatedStartDate,
  setDiscountValue,
  setDiscountStartDate,
  setDiscountEndDate,
  saveUpdatedImage,
  setDiscountImage,
  clearDiscountImage,
} from "@/redux/slices/updateDiscountSlice";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

interface UpdateDiscountProps {
  discount_id: number;
}

function UpdateDiscountComponent({ discount_id }: UpdateDiscountProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { discountDetail, loading, error, selectedImage } = useSelector(
    (state: RootState) => state.updateDiscount // Adjust if the slice is named differently
  );

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStartDate = new Date(e.target.value); // Convert the string to a Date object
    if (!isNaN(updatedStartDate.getTime())) {
      dispatch(setDiscountStartDate(String(updatedStartDate))); // Dispatch the Date object
    } else {
      console.error("Invalid date selected");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedEndDate = new Date(e.target.value); // Convert the string to a Date object
    if (!isNaN(updatedEndDate.getTime())) {
      dispatch(setDiscountEndDate(String(updatedEndDate))); // Dispatch the Date object
    } else {
      console.error("Invalid date selected");
    }
  };

  const handleValueSave = () => {
    if (discount_id) {
      dispatch(
        saveUpdatedValue({
          discount_id,
          value: discountDetail.value,
          type: discountDetail.type,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(showSuccess("Discount value successfully updated."));
        })
        .catch((error) => {
          dispatch(showError(error));
        });
    }
  };

  const handleStartSave = () => {
    handleDateSave("start_date");
  };

  const handleEndSave = () => {
    handleDateSave("end_date");
  };

  const handleDateSave = (dateField: "start_date" | "end_date") => {
    if (!discount_id) {
      dispatch(showError("Invalid discount ID."));
      return;
    }

    const adjustedDate = new Date(discountDetail[dateField]);
    if (isNaN(adjustedDate.getTime())) {
      dispatch(showError(`Invalid ${dateField.replace("_", " ")} value.`));
      return;
    }

    if (dateField === "start_date" && discountDetail.end_date) {
      const endDate = new Date(discountDetail.end_date);
      if (adjustedDate >= endDate) {
        dispatch(showError("Start date must be smaller than end date."));
        return;
      }
    }

    if (dateField === "end_date" && discountDetail.start_date) {
      const startDate = new Date(discountDetail.start_date);
      if (adjustedDate <= startDate) {
        dispatch(showError("End date must be larger than start date."));
        return;
      }
    }

    const formattedDate = new Date(
      Date.UTC(
        adjustedDate.getFullYear(),
        adjustedDate.getMonth(),
        adjustedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    dispatch(
      saveUpdatedStartDate({
        discount_id,
        date: String(formattedDate),
        field: dateField,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          showSuccess(
            `Discount ${dateField.replace("_", " ")} successfully updated.`
          )
        );
      })
      .catch((error) => {
        dispatch(showError(error));
      });
  };

  const handleImageSave = () => {
    if (!discount_id || !selectedImage) {
      dispatch(showError("Please select an image to upload."));
      return;
    }

    const maxSizeInMB = 1;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedImage.type)) {
      dispatch(
        showError(
          `Invalid file type. Please upload a valid image (JPEG, PNG, or WEBP).`
        )
      );
      return;
    }

    if (selectedImage.size > maxSizeInBytes) {
      dispatch(showError(`File size exceeds ${maxSizeInMB}MB limit.`));
      return;
    }

    dispatch(
      saveUpdatedImage({
        discount_id,
        image: selectedImage,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(showSuccess("Image uploaded successfully."));
        dispatch(clearDiscountImage());
      })
      .catch((error) => {
        dispatch(showError(error));
      });
  };

  const handleToggleActiveStatus = () => {
    if (discountDetail.discount_id) {
      dispatch(
        toggleIsActive({
          discount_id: discountDetail.discount_id,
          currentStatus: discountDetail.is_active,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(showSuccess("Active status toggled successfully."));
        })
        .catch((error) => {
          dispatch(showError(error));
        });
    } else {
      dispatch(showError("Invalid discount ID."));
    }
  };

  useEffect(() => {
    if (discount_id) {
      dispatch(fetchDiscountDetails(discount_id));
    }
  }, [dispatch, discount_id]);
  return (
    <div className="container mx-auto pb-8">
      <div className="space-y-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Update Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Product Name:</strong>{" "}
                  {discountDetail.inventory_name || "N/A"}
                </p>
              </div>
              <Separator />
              <div>
                <p>
                  <strong>Type:</strong> {discountDetail.type || "N/A"}
                </p>
              </div>

              {discountDetail.type !== "BOGO" && (
                <>
                  <Separator />
                  <div className="flex flex-col justify-between items-start sm:flex-row gap-2">
                    <div>
                      <label
                        htmlFor="value-input"
                        className="text-md font-medium mr-2"
                      >
                        <strong>Value:</strong>
                      </label>
                      <input
                        id="value-input"
                        type="number"
                        value={discountDetail.value || ""}
                        onChange={(e) => {
                          const updatedValue = parseFloat(e.target.value);
                          dispatch(setDiscountValue(updatedValue || null));
                        }}
                        className="w-20 p-2 border border-gray-300 rounded-md"
                        placeholder="Enter value"
                      />
                    </div>
                    <Button
                      variant="default"
                      className="ml-2"
                      onClick={() => {
                        handleValueSave();
                      }}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </>
              )}
              {discountDetail.type !== "BOGO" && (
                <>
                  <Separator />
                  <div>
                    <p>
                      <strong>Minimum Purchase:</strong>{" "}
                      {discountDetail.min_purchase !== null
                        ? discountDetail.min_purchase
                        : "N/A"}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p>
                      <strong>Maximum Discount:</strong>{" "}
                      {discountDetail.max_discount !== null
                        ? discountDetail.max_discount
                        : "N/A"}
                    </p>
                  </div>
                </>
              )}
              {discountDetail.type === "BOGO" && (
                <>
                  <Separator />
                  <div>
                    <p>
                      <strong>Buy one get one:</strong>{" "}
                      {discountDetail.bogo_product_name || "N/A"}
                    </p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p>
                  <strong>Description:</strong>{" "}
                  {discountDetail.description || "N/A"}
                </p>
              </div>
              <Separator />
              <div className="flex justify-between items-center gap-4">
                
                <p className="flex items-center gap-2">
                  <strong>Active Status:</strong>{" "}
                  {discountDetail.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </p>
                <Button
                  variant={discountDetail.is_active ? "destructive" : "default"}
                  onClick={handleToggleActiveStatus}
                >
                  {discountDetail.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>

              <Separator />
              <div className="flex flex-col justify-between items-start sm:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="start-date-input"
                    className="text-md font-medium"
                  >
                    <strong>Start Date:</strong>
                  </label>
                  <input
                    id="start-date-input"
                    type="date"
                    value={
                      discountDetail.start_date
                        ? new Date(discountDetail.start_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleStartDateChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button
                  variant="default"
                  className="ml-2"
                  onClick={() => {
                    handleStartSave();
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
              <Separator />
              <div className="flex flex-col justify-between items-start sm:flex-row gap-2">
                {/* End Date Field */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="end-date-input"
                    className="text-md font-medium"
                  >
                    <strong>End Date:</strong>
                  </label>
                  <input
                    id="end-date-input"
                    type="date"
                    value={
                      discountDetail.end_date
                        ? new Date(discountDetail.end_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleEndDateChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button
                  variant="default"
                  className="ml-2"
                  onClick={() => {
                    handleEndSave();
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
              <Separator />
              <div>
                <p>
                  <strong>Image:</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
                  {/* Image Preview */}
                  <div>
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected Discount"
                        className="w-48 h-48 object-contain border rounded-md mt-2"
                      />
                    ) : discountDetail.image ? (
                      <img
                        src={discountDetail.image}
                        alt="Discount"
                        className="w-48 h-48 object-contain border rounded-md mt-2"
                      />
                    ) : (
                      "No image available"
                    )}
                  </div>

                  {/* File Upload and Button */}
                  <div className="flex flex-col gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          dispatch(setDiscountImage(file));
                        }
                      }}
                      className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    />
                    <Button variant="default" onClick={() => handleImageSave()}>
                      {loading ? "Saving..." : "Upload Image"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UpdateDiscountComponent;
