// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Adjust for production
const SECRET_KEY = "supersecurepassword"; // Must match your backend

export async function runDraw(drawPayload) {
  try {
    const res = await axios.post(`${API_BASE}/draw`, drawPayload, {
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": SECRET_KEY,
      },
    });
    return res.data; // Array of draw results
  } catch (err) {
    const error = err.response?.data?.error || "Draw failed";
    throw new Error(error);
  }
}

export async function fetchDrawLogs(drawId) {
  try {
    const res = await axios.get(`${API_BASE}/draw/${drawId}/logs`, {
      headers: {
        "x-admin-secret": SECRET_KEY,
      },
    });
    return res.data;
  } catch (err) {
    const error = err.response?.data?.error || "Failed to load draw logs";
    throw new Error(error);
  }
}

export async function fetchAllDraws() {
  try {
    const res = await axios.get(`${API_BASE}/draws`);
    return res.data;
  } catch (err) {
    const error = err.response?.data?.error || "Failed to load draws";
    throw new Error(error);
  }
}
