"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SuperSidebar from "@/components/SuperSidebar";
import LoadingVignette from "@/components/LoadingVignette";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TbReportSearch } from "react-icons/tb";
import {
  fetchSalesData,
  fetchCategoriesProductStoreData,
  fetchSalesByCategory,
  fetchSalesByProductData,
  setCategoryId,
  setStoreId,
  setProductId,
} from "@/redux/slices/superSalesSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartOptions,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function AllReports() {
  const [year, setYear] = useState<number>(2025);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const {
    sales,
    salesByCategory,
    salesByProductData,
    categories,
    products,
    stores,
    loading,
    store_id,
    category_id,
    product_id,
  } = useSelector((state: RootState) => state.superSales);

  const toggleSidebar = () => {
    dispatch({ type: "superAdmin/toggleSidebar" });
  };

  const handleStoreChange = (newStoreId: number | null) => {
    dispatch(setStoreId(newStoreId));
  };

  const chartData = {
    labels: sales.map((sale) => sale.month),
    datasets: [
      {
        label: "Total Sales",
        data: sales.map((sale) => sale.total_sales),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const categorySalesChartData = {
    labels: salesByCategory.labels,
    datasets: salesByCategory.datasets.map((dataset) => ({
      ...dataset,
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
    })),
  };

  const productChartData = {
    labels: salesByProductData.map((data) => data.month),
    datasets: [
      {
        label: "Product Sales",
        data: salesByProductData.map((data) => data.total_sales),
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        type: "category",
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
        },
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const params: {
      year: number;
      store_id?: number;
      product_id?: number;
    } = {
      year,
    };

    if (store_id) {
      params.store_id = store_id;
    }

    if (product_id) {
      params.product_id = product_id;
    }
    dispatch(fetchSalesByProductData(params));
  }, [dispatch, year, store_id, product_id]);

  useEffect(() => {
    const params: { year: number; store_id?: number; category_id?: number } = {
      year,
    };

    if (store_id) {
      params.store_id = store_id;
    }

    if (category_id) {
      params.category_id = category_id;
    }
    dispatch(fetchSalesData(params));
    dispatch(fetchSalesByCategory(params));
    dispatch(fetchCategoriesProductStoreData());
  }, [dispatch, store_id, year, category_id]);

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette />}
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Sales Report
        </h1>
        <Button
          size="default"
          onClick={() => router.push("/admin-super/reports/stocksReport")}
        >
          <TbReportSearch />
          Stocks Report
        </Button>

        <div className="flex gap-5 mt-6 mb-4">
          <div className="bg-white w-full rounded-sm">
            <Select
              onValueChange={(value) =>
                handleStoreChange(
                  value && value !== "-1" ? parseInt(value) : null
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Store" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 transition-transform transform-gpu duration-200 ease-in-out">
                <SelectItem value="-1">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem
                    key={store.store_id}
                    value={String(store.store_id)}
                  >
                    {store.store_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white w-full rounded-sm">
            <Select
              onValueChange={(value) => setYear(parseInt(value))} // Local state for year
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Year" />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025, 2026].map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Total Sales Chart */}
          <div className="w-full mx-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Monthly Sales Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-auto">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* sales by category */}
          <div className="w-full mx-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Sales By Category</CardTitle>
                <Select
                  onValueChange={(value) =>
                    dispatch(setCategoryId(value ? parseInt(value) : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={String(category.category_id)}
                      >
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="w-full h-auto">
                  <Line data={categorySalesChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* sales by product */}
          <div className="w-full mx-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Monthly Product Sales Report</CardTitle>
                <Select
                  onValueChange={(value) =>
                    dispatch(setProductId(value ? parseInt(value) : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">First Product</SelectItem>
                    {products.map((product) => (
                      <SelectItem
                        key={product.product_id}
                        value={String(product.product_id)}
                      >
                        {product.product_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="w-full h-auto">
                  <Line data={productChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllReports;
