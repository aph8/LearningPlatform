"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { GradeProps } from "../helper/apiTypes";
import styles from "../styles/GradeChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
);

const GradeChart: React.FC<GradeProps> = ({ grades }) => {
  const computeDistribution = () => {
    const buckets = Array(11).fill(0);
    grades.forEach((g) => {
      if (typeof g.assignmentGrade === "number") {
        const bucket = Math.floor(g.assignmentGrade);
        if (bucket >= 0 && bucket <= 10) {
          buckets[bucket] += 1;
        }
      }
    });
    return buckets;
  };

  const buckets = computeDistribution();
  const chartLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Number of Students",
        data: buckets,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Grade Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default GradeChart;
