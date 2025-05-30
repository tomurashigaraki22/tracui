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

interface SuccessRateChartProps {
  months: string[];
  deliveries: number[];
}

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({
  months,
  deliveries,
}) => {
  const data = {
    labels: months,
    datasets: [
      {
        label: "Deliveries",
        data: deliveries,
        fill: false,
        borderColor: "#00FFD1", // Changed to match your brand color
        backgroundColor: "#00FFD1",
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
          callback: (value: any) => value,
        },
        min: 0,
        max: Math.max(...deliveries) + 50, // Dynamic max based on data
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SuccessRateChart;
