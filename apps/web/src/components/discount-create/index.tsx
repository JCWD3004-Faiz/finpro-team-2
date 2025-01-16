"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DatePicker from "react-datepicker";
import { formatISO, format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createDiscount,
  setDiscountType,
  setInventoryId,
  setValue,
  setMinPurchase,
  setMaxDiscount,
  setBogoProductId,
  setDescription,
  setStartDate,
  setEndDate,
  setImage,
  resetForm,
  resetMinMax,
  resetBogo,
} from "@/redux/slices/createDiscountSlice";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";
import {
  fetchInventoryNamesAdmin,
  fetchInventoryWithoutDiscountsAdmin,
} from "@/redux/slices/getDiscountSlice";
import { Button } from "../ui/button";
import { AxiosError } from "axios";

interface DiscountCreateProps {
  store_id: number;
}

function DiscountCreateComponent({ store_id }: DiscountCreateProps) {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    type,
    inventory_id,
    value,
    min_purchase,
    max_discount,
    bogo_product_id,
    description,
    start_date,
    end_date,
    image,
    error,
  } = useSelector((state: RootState) => state.createDiscount);
  const { inventoryNames, inventoryWithoutDiscounts, loading } = useSelector(
    (state: RootState) => state.getDiscount
  );
  const formatDateRange = (startDate: Date, endDate: Date) =>
    `${format(startDate, "yyyy-MM-dd")} - ${format(endDate, "yyyy-MM-dd")}`;

  const handleDateChange = (date: Date | null, type: "start" | "end") => {
    if (date) {
      // Formats the date into ISO format
      if (type === "start") {
        dispatch(setStartDate(new Date(date).toISOString())); // Dispatch Redux action for start date
      } else {
        dispatch(setEndDate(new Date(date).toISOString())); // Dispatch Redux action for end date
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(setImage(file));
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string); // Set the image preview
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      dispatch(setImage(null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const maxSizeInMB = 1; // Maximum file size in MB
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (image && image.size > maxSizeInBytes) {
      dispatch(
        showError(`Image exceeds the maximum size of ${maxSizeInMB}MB.`)
      );
      return;
    }
    dispatch(
      createDiscount({
        type,
        inventory_id,
        value,
        min_purchase,
        max_discount,
        bogo_product_id,
        description,
        start_date,
        end_date,
        image,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(showSuccess("Discount successfully created"));
        dispatch(resetForm());
      })
      .catch((error) => {
        console.error("Error:", error); // Logs the rejectWithValue output
        dispatch(showError(error));
      });
  };

  useEffect(() => {
    if (store_id) {
      dispatch(fetchInventoryNamesAdmin(store_id));
      dispatch(fetchInventoryWithoutDiscountsAdmin(store_id));
    }
  }, [dispatch, store_id]);

  return (
    <div className="min-h-screen sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="space-y-6">
          <div>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to add a new discount to the store.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="grid grid-cols-1 p-6 space-y-6">
              <div className="space-y-4">
                {/* Dropdown type */}
                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    onValueChange={(value) => {
                      dispatch(resetBogo());
                      dispatch(setDiscountType(value));
                    }}
                    defaultValue=""
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Discount Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOGO">Buy One Get One</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="NOMINAL">Nominal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* input inventory id, give suggestion */}
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Select
                    onValueChange={(value) => {
                      dispatch(resetMinMax());
                      if (value === "whole-store") {
                        dispatch(setInventoryId(null)); // Set inventory_id to null for "Whole Store"
                        dispatch(setBogoProductId(null));
                      } else {
                        const selectedInventory =
                          inventoryWithoutDiscounts.find(
                            (item) => item.inventory_id.toString() === value
                          );
                        if (selectedInventory) {
                          dispatch(setInventoryId(parseInt(value))); // Set inventory_id
                          if (type === "BOGO") {
                            dispatch(
                              setBogoProductId(selectedInventory.product_id)
                            );
                          }
                        }
                      }
                    }}
                  >
                    <SelectTrigger id="product-name" className="mt-1">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whole-store" key="whole-store">
                        Whole Store
                      </SelectItem>
                      {inventoryWithoutDiscounts.map((item) => (
                        <SelectItem
                          key={item.inventory_id}
                          value={item.inventory_id.toString()}
                        >
                          {item.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value input number */}
                <div>
                  <Label htmlFor="discount-value">Value</Label>
                  <Input
                    type="number"
                    id="discount-value"
                    placeholder="Enter value"
                    value={value || ""}
                    disabled={type === "BOGO"}
                    onChange={(e) => {
                      const inputValue = parseFloat(e.target.value);
                      if (inputValue >= 0 || isNaN(inputValue)) {
                        dispatch(setValue(inputValue));
                      } else {
                        dispatch(setValue(0));
                      }
                    }}
                    className="mt-1"
                  />
                </div>

                {/* min purchase and max discount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="min-purchase">Minimum Purchase</Label>
                    <h3 className="text-xs text-gray-500">
                      Only for whole store
                    </h3>
                    <Input
                      type="number"
                      id="min-purchase"
                      placeholder="Enter minimum purchase"
                      value={min_purchase || ""}
                      disabled={type === "BOGO" || !!inventory_id}
                      onChange={(e) => {
                        const inputValue = parseFloat(e.target.value);
                        if (inputValue >= 0 || isNaN(inputValue)) {
                          dispatch(setMinPurchase(inputValue));
                        } else {
                          dispatch(setMinPurchase(0));
                        }
                      }}
                      className="mt-1"
                    />
                  </div>

                  {/* Max Discount input number */}
                  <div>
                    <Label htmlFor="max-discount">Maximum Discount</Label>
                    <h3 className="text-xs text-gray-500">
                      Only for whole store
                    </h3>
                    <Input
                      type="number"
                      id="max-discount"
                      placeholder="Enter maximum discount"
                      value={max_discount || ""}
                      disabled={type === "BOGO" || !!inventory_id}
                      onChange={(e) => {
                        const inputValue = parseFloat(e.target.value);
                        if (inputValue >= 0 || isNaN(inputValue)) {
                          dispatch(setMaxDiscount(inputValue));
                        } else {
                          // Reset to a positive value or an empty field
                          dispatch(setMaxDiscount(0)); // Optional: set to default positive value
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* bogo product id */}
                {/* <div>
                  <Label htmlFor="product-name">Buy one get one Product</Label>
                  <Select
                    onValueChange={(value) =>
                      dispatch(setBogoProductId(parseInt(value)))
                    }
                    disabled={
                      type === "PERCENTAGE" ||
                      type === "NOMINAL" ||
                      type === "BOGO"
                    }
                  >
                    <SelectTrigger id="product-name" className="mt-1">
                      <SelectValue
                        placeholder="Select a product"
                        defaultValue={
                          bogo_product_id
                            ? inventoryNames.find(
                                (item) => item.product_id === bogo_product_id
                              )?.product_name
                            : "Select a product"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryNames.map((item) => (
                        <SelectItem
                          key={item.product_id}
                          value={item.product_id.toString()}
                        >
                          {item.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Description */}
                <div>
                  <Label htmlFor="discount-description">Description</Label>
                  <Textarea
                    id="discount-description"
                    placeholder="Enter discount description"
                    value={description || ""}
                    onChange={(e) => dispatch(setDescription(e.target.value))}
                    className="mt-1"
                  />
                </div>

                {/* Start date End date */}
                <div className="sm:w-1/2 lg:w-1/3">
                  <Label>Discount Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full text-left">
                        {formatDateRange(range.startDate, range.endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <DateRange
                        ranges={[range]}
                        onChange={(ranges) => {
                          const startDate =
                            ranges.selection.startDate || new Date();
                          const endDate =
                            ranges.selection.endDate || new Date();

                          setRange({
                            startDate,
                            endDate,
                            key: "selection",
                          });

                          handleDateChange(startDate, "start");
                          handleDateChange(endDate, "end");
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* image file */}
                <div>
                  <Label>Upload Discount Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block sm:w-1/2 lg:w-1/3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </div>

                {preview && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <img
                      src={preview}
                      alt="Uploaded Preview"
                      className="w-48 h-48 object-contain border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding Discount..." : "Add Discount"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DiscountCreateComponent;
