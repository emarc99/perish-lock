"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TelemetryPoint } from "@/lib/types";
import { Thermometer, Droplets, Info } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TelemetryChartProps {
  data: TelemetryPoint[];
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ data }) => {
  const labels = data.map((d) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  });

  const temperatures = data.map((d) => d.temperature_c);
  const humidities = data.map((d) => d.humidity_pct);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Chamber Temperature (°C)",
        data: temperatures,
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.15)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#f43f5e",
        yAxisID: "yTemp",
      },
      {
        label: "Relative Humidity (%)",
        data: humidities,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.05)",
        borderWidth: 1.5,
        borderDash: [5, 5],
        fill: false,
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: "#38bdf8",
        yAxisID: "yHumidity",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#94a3b8",
          font: { size: 12, family: "inherit" },
          boxWidth: 14,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(51, 65, 85, 0.3)" },
        ticks: { color: "#64748b", font: { size: 10 } },
      },
      yTemp: {
        type: "linear",
        position: "left",
        min: 8,
        max: 22,
        grid: { color: "rgba(51, 65, 85, 0.3)" },
        ticks: {
          color: "#f43f5e",
          callback: (val) => `${val}°C`,
          font: { size: 11 },
        },
      },
      yHumidity: {
        type: "linear",
        position: "right",
        min: 60,
        max: 100,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#38bdf8",
          callback: (val) => `${val}%`,
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-rose-400" />
            Dual-Sensor Consensus & Breach Window
          </h2>
          <p className="text-xs text-slate-400">
            AHT20 Primary & SHT31 Secondary Probes • Max Sensor Drift: 0.7°C (Tolerance: ≤ 1.5°C)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full font-medium">
          <Info className="w-3.5 h-3.5" />
          <span>Parametric Threshold: &gt;13.0°C for ≥ 240 min (Breach Active)</span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block">Baseline Target</span>
          <span className="font-semibold text-emerald-400">10.0°C - 12.5°C</span>
        </div>
        <div>
          <span className="text-slate-400 block">Peak Recorded</span>
          <span className="font-semibold text-rose-400">18.2°C (at 17:30)</span>
        </div>
        <div>
          <span className="text-slate-400 block">Sustained Duration</span>
          <span className="font-semibold text-amber-400">330 min (&gt; 240 min trigger)</span>
        </div>
        <div>
          <span className="text-slate-400 block">Relative Humidity</span>
          <span className="font-semibold text-cyan-400">76.2% (Depression confirmed)</span>
        </div>
      </div>
    </div>
  );
};
