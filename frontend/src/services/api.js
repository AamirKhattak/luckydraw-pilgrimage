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
