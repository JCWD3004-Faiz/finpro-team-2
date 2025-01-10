import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProductDetailsByInventoryId } from "@/redux/slices/getProductsSlice";

function TestingProductDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, productDetailUser } = useSelector(
    (state: RootState) => state.getProducts
  );

  useEffect(() => {
    const inventoryId = 200; // Replace with the inventory ID you want to fetch
    dispatch(fetchProductDetailsByInventoryId(inventoryId))
      .unwrap()
      .then((data) => {
        console.log("Fetched Product Details:", data);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
      });
  }, [dispatch]);

  console.log("Product details", productDetailUser);

  return <div>TestingProductDetail</div>;
}

export default TestingProductDetail;
