import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProductDetailsByInventoryId, fetchInventoriesUser } from "@/redux/slices/getProductsSlice";

function TestingProductDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, productDetailUser, productAllUser } = useSelector(
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

  useEffect(() => { // Replace with your store_id
    const page = 1; // You can modify pagination values
    const pageSize = 10;
    const search = ""; // Add a search term if needed
    const category = ""; // Add a category if needed
    const sortField = "product_name";
    const sortOrder = "asc";

    dispatch(
      fetchInventoriesUser({
        page,
        pageSize,
        search,
        category,
        sortField,
        sortOrder,
      })
    )
      .unwrap()
      .then((data) => {
        console.log("Fetched Inventories:", data); // Log the fetched data
      })
      .catch((err) => {
        console.error("Error fetching inventories:", err); // Log any errors
      });
  }, [dispatch]);

  return <div>TestingProductDetail</div>;
}

export default TestingProductDetail;
