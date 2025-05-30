"use client";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const SuccessRateChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Success Rate",
        data: [89, 92, 95, 91, 94, 96],
        fill: false,
        borderColor: "#10B981", // emerald
        backgroundColor: "#10B981",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `${value}%`,
        },
        min: 0,
        max: 100,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SuccessRateChart;
