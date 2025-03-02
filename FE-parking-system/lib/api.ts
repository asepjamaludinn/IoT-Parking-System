import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const getParkingStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil status parkir:", error);
    return { status: "0" };
  }
};

export const getParkingHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data.history || [];
  } catch (error) {
    console.error("Gagal mengambil riwayat parkir:", error);
    return [];
  }
};
