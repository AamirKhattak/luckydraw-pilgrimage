// src/components/PastDraws.jsx
import React, { useState, useEffect } from "react";
import { fetchDrawResults } from "../services/api";
import ResultsTable from "./ResultsTable";
import DownloadPDFReport from "./DownloadPDFReport";

const PastDraws = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [drawType, setDrawType] = useState("hajj");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDrawResults({ drawType, year });
      setResults(data.results);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
    setLoading(false);
  };

  return (
    <div className="mt-10 max-w-5xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-6 text-green-700 dark:text-green-400">
        📁 View Past Draw Results
      </h2>

      <div className="flex justify-center items-center gap-4 mb-6">
        <select
          value={drawType}
          onChange={(e) => setDrawType(e.target.value)}
          className="px-4 py-2 rounded border"
        >
          <option value="hajj">Hajj</option>
          <option value="umrah">Umrah</option>
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 rounded border w-28"
          placeholder="Year"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded shadow"
        >
          🔍 Load Results
        </button>
      </div>

      {loading && <p className="text-lg text-gray-600">Loading...</p>}
      {error && <p className="text-red-600 font-semibold">❌ {error}</p>}

      {results && results.length > 0 && (
        <div id="results-section">
          <DownloadPDFReport results={results} drawType={drawType} />
          <ResultsTable results={results} />
        </div>
      )}
    </div>
  );
};

export default PastDraws;