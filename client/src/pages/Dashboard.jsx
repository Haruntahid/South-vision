import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import useAxiosPublic from "../hooks/useAxiosPublic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

function Dashboard() {
  const axiosPublic = useAxiosPublic();
  const [invoiceData, setInvoiceData] = useState([]);
  const [genderRatio, setGenderRatio] = useState({ male: 0, female: 0 });
  const [filter, setFilter] = useState("week"); // default to last 7 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, genderRes] = await Promise.all([
          axiosPublic.get("/api/v1/invoice-report"),
          axiosPublic.get("/api/v1/patient-gender-ratio"),
        ]);
        setInvoiceData(invoiceRes.data);
        setGenderRatio(genderRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Date-based filtering
  const today = new Date();
  const filteredData = invoiceData.filter((item) => {
    const itemDate = new Date(item.date);
    if (filter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return itemDate >= weekAgo && itemDate <= today;
    }
    if (filter === "month") {
      return (
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    }
    return true;
  });

  // Mapped Data
  const dates = filteredData.map((d) => d.date);
  const invoiceCount = filteredData.map((d) => d.invoiceCount || 0);
  const collectedAmount = filteredData.map(
    (d) => Number(d.collectedAmount) || 0
  );
  const totalAmount = filteredData.map((d) => Number(d.totalAmount) || 0);
  const discountAmount = totalAmount.map((amt, i) => amt - collectedAmount[i]);

  // Formatted totals
  const totalPatients = invoiceCount.reduce((sum, val) => sum + val, 0);
  const totalCollected = collectedAmount.reduce((sum, val) => sum + val, 0);
  const totalExpected = totalAmount.reduce((sum, val) => sum + val, 0);
  const totalDiscount = discountAmount.reduce((sum, val) => sum + val, 0);

  const formatCurrency = (value) =>
    `৳${value.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Bar Chart Colors
  const barColors = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
    "#eab308",
    "#6366f1",
    "#f472b6",
    "#22c55e",
    "#f43f5e",
    "#0ea5e9",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📊 Dashboard Overview
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Patients</h3>
          <p className="text-xl font-bold text-green-600">{totalPatients}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500 text-sm">Collected Income</h3>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(totalCollected)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500 text-sm">Expected Amount</h3>
          <p className="text-xl font-bold text-indigo-600">
            {formatCurrency(totalExpected)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Discount</h3>
          <p className="text-xl font-bold text-red-600">
            {formatCurrency(totalDiscount)}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end items-center gap-4 mb-4">
        <div className="text-sm text-gray-600">
          Showing data for:{" "}
          {filter === "week"
            ? "Last 7 Days"
            : filter === "month"
            ? "This Month"
            : "All Time"}
        </div>
        <select
          className="border px-3 py-1 rounded bg-white shadow-sm text-gray-700"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">Last 7 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
            Patient Gender Ratio
          </h2>
          <Pie
            data={{
              labels: ["Male", "Female"],
              datasets: [
                {
                  data: [genderRatio.male, genderRatio.female],
                  backgroundColor: ["#3b82f6", "#f472b6"],
                  borderWidth: 2,
                },
              ],
            }}
          />
        </div>

        {/* Bar Chart */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md md:col-span-2 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
            Total Patients per Day
          </h2>
          <Bar
            data={{
              labels: dates,
              datasets: [
                {
                  label: "Patients",
                  data: invoiceCount,
                  backgroundColor: invoiceCount.map(
                    (_, i) => barColors[i % barColors.length]
                  ),
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>

        {/* Line Chart */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md md:col-span-3 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
            Income, Expected Amount & Discount
          </h2>
          <Line
            data={{
              labels: dates,
              datasets: [
                {
                  label: "Collected Income",
                  data: collectedAmount,
                  borderColor: "#10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  tension: 0.4,
                  fill: true,
                  pointRadius: 4,
                },
                {
                  label: "Expected Amount",
                  data: totalAmount,
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                  tension: 0.4,
                  fill: true,
                  pointRadius: 4,
                },
                {
                  label: "Discount",
                  data: discountAmount,
                  borderColor: "#f43f5e",
                  backgroundColor: "rgba(244, 63, 94, 0.2)",
                  tension: 0.4,
                  fill: true,
                  pointRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: "#4b5563",
                  },
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.dataset.label}: ${formatCurrency(
                        context.parsed.y
                      )}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => formatCurrency(value),
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
