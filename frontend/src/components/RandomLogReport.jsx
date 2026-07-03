import React, { useEffect, useState } from "react";
import { fetchAllDraws, fetchDrawLogs } from "../services/api";

const randomStatusLabel = (status) => {
  if (status) return "Matched";
  return "Miss";
};

const RandomLogReport = () => {
  const [draws, setDraws] = useState([]);
  const [selectedDrawId, setSelectedDrawId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawLoadError, setDrawLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDraws = async () => {
      try {
        const data = await fetchAllDraws();
        if (mounted) {
          setDraws(data);
          if (data.length > 0) {
            setSelectedDrawId(data[0].id);
          }
        }
      } catch (err) {
        if (mounted) {
          setDrawLoadError(err.message);
        }
      }
    };

    loadDraws();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDrawId) {
      setLogs([]);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError("");

    const loadLogs = async () => {
      try {
        const data = await fetchDrawLogs(selectedDrawId);
        if (mounted) {
          setLogs(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      mounted = false;
    };
  }, [selectedDrawId]);

  const selectedDraw = draws.find((draw) => draw.id === selectedDrawId);
  const totalGenerated = logs.length;
  const totalMatched = logs.filter((log) => log.matchedEmployee).length;

  if (drawLoadError) {
    return <p className="mt-8 text-red-600 font-semibold">❌ {drawLoadError}</p>;
  }

  if (!draws.length) {
    return <p className="mt-8 text-gray-600 dark:text-gray-300">No completed draws available yet.</p>;
  }

  return (
    <section className="w-full max-w-6xl mt-10 rounded-[32px] border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-slate-950/80 p-6 shadow-2xl shadow-gray-400/10 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Random Log Report</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Review every generated number and whether it matched an employee. Select any completed draw below.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pick a draw</label>
          <select
            value={selectedDrawId || ""}
            onChange={(e) => setSelectedDrawId(Number(e.target.value))}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {draws.map((draw) => (
              <option key={draw.id} value={draw.id}>
                {`${String(draw.type || "").charAt(0).toUpperCase()}${String(draw.type || "").slice(1)} Draw No. ${draw.drawNo || draw.id} • ${draw.yearFrom || draw.year || ""}-${draw.yearTo || draw.year || ""}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedDraw ? (
        <div className="mb-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p><span className="font-semibold">Selected draw:</span> {`${String(selectedDraw.type || "").charAt(0).toUpperCase()}${String(selectedDraw.type || "").slice(1)} Draw No. ${selectedDraw.drawNo || selectedDraw.id}`}</p>
          <p className="mt-1"><span className="font-semibold">Period:</span> {selectedDraw.yearFrom || selectedDraw.year} - {selectedDraw.yearTo || selectedDraw.year}</p>
          <p className="mt-1"><span className="font-semibold">Winners:</span> {selectedDraw.winners} · <span className="font-semibold">Waiting:</span> {selectedDraw.waiting}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Total generated</p>
              <p className="mt-2 text-2xl font-semibold">{totalGenerated}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Total matched</p>
              <p className="mt-2 text-2xl font-semibold">{totalMatched}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Match rate</p>
              <p className="mt-2 text-2xl font-semibold">{totalGenerated ? `${Math.round((totalMatched / totalGenerated) * 100)}%` : "0%"}</p>
            </div>
          </div>
          
        </div>
      ) : null}

      {loading ? (
        <p className="mt-8 text-gray-600 dark:text-gray-300">Loading random logs...</p>
      ) : error ? (
        <p className="mt-8 text-red-600 font-semibold">❌ {error}</p>
      ) : !logs.length ? (
        <p className="mt-8 text-gray-600 dark:text-gray-300">No random logs available for this draw.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-slate-100 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Generated Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Matched</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Employee No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Employee Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {logs.map((log, index) => (
                <tr key={log.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{log.generatedNumber}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${log.matchedEmployee ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                      {randomStatusLabel(log.matchedEmployee)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{log.employeeNumber || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{log.employeeName || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RandomLogReport;
