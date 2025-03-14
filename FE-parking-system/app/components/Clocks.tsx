"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  return (
    <div
      className="flex flex-col items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md"
      aria-label="Clock widget"
    >
      {/* Tanggal */}
      <div className="flex items-center gap-2">
        <FaCalendarAlt className="text-xl text-blue-600 dark:text-blue-400" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {formattedDate}
        </p>
      </div>

      {/* Jam */}
      <div className="flex items-center gap-2 mt-2">
        <FaClock className="text-xl text-blue-600 dark:text-blue-400" />
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
