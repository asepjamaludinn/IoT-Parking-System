"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ParkingCard from "./components/ParkingCard";
import Navbar from "./components/Navbar";
import {
  FaCar,
  FaParking,
  FaTimesCircle,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function Home() {
  const totalParking = 1;
  const [parkingStatus, setParkingStatus] = useState("0");
  const [parkingHistory, setParkingHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchParkingData = async () => {
    try {
      const [statusRes, historyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/status`),
        fetch(`${API_BASE_URL}/history`),
      ]);
      const statusData = await statusRes.json();
      const historyData = await historyRes.json();

      setParkingStatus(statusData.status);
      setParkingHistory(
        Array.isArray(historyData.history) ? historyData.history : []
      );
    } catch (error) {
      console.error("Gagal mengambil data parkir:", error);
      setParkingHistory([]);
    }
  };

  useEffect(() => {
    fetchParkingData();
    const interval = setInterval(fetchParkingData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (parkingStatus === "1") {
      toast.success("Parkiran terisi!");
    } else {
      toast.success("Parkiran kosong!");
    }
  }, [parkingStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <Navbar />
      <div className="pt-24 p-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
            Sistem Parkir Cerdas
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-400 mt-2">
            Pantau kapasitas parkir secara real-time dengan data akurat.
          </p>
        </div>

        {/* Kartu Informasi */}
        <div className="mb-8 flex justify-center">
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 flex flex-col items-center gap-2 backdrop-blur-md bg-opacity-70">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-xl text-blue-600 dark:text-blue-400" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date())}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-2xl text-blue-600 dark:text-blue-400 animate-pulse" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-widest font-mono">
                {currentTime}
              </p>
            </div>
          </div>
        </div>

        {/* Kartu Status Parkir */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ParkingCard
            title="Total Parkir"
            value={totalParking}
            color="from-blue-500 to-blue-700"
            icon={<FaCar className="text-white text-4xl" />}
          />
          <ParkingCard
            title="Tersedia"
            value={totalParking - (parkingStatus === "1" ? 1 : 0)}
            color="from-green-500 to-green-700"
            icon={<FaParking className="text-white text-4xl" />}
          />
          <ParkingCard
            title="Terisi"
            value={parkingStatus === "1" ? 1 : 0}
            color="from-red-500 to-red-700"
            icon={<FaTimesCircle className="text-white text-4xl" />}
          />
        </div>

        {/* Tabel Riwayat Parkir */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-x-auto backdrop-blur-md bg-opacity-70">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaClipboardList className="text-blue-600 dark:text-blue-400" />{" "}
            Riwayat Parkir
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <th className="p-4 rounded-tl-xl">No</th>
                <th className="p-4">Plat Nomor</th>
                <th className="p-4">Waktu</th>
                <th className="p-4 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {parkingHistory.length > 0 ? (
                parkingHistory.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{entry.vehicle_id || "N/A"}</td>
                    <td className="p-4">{entry.time}</td>
                    <td
                      className={`p-4 font-bold ${
                        entry.status === "1"
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {entry.status === "1" ? "Masuk" : "Keluar"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4 text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada riwayat parkir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
