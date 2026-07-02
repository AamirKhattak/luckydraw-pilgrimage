import React, { useEffect, useState } from "react";
import { fetchAllDraws } from "../services/api";
import DownloadPDFReport from "./DownloadPDFReport";

const getReportRows = (results = []) => {
  return results
    .map((item) => {
      const employee = item.employee || item.Employee || {};
      return {
        position: item.position,
        number: employee.employee_number || employee.employeeNumber || item.number || "",
        name: employee.name || employee.full_name || item.name || "",
        designation: employee.designation || item.designation || "",
        department: employee.department || item.department || "",
        location: employee.location || item.location || "",
        status: item.status,
      };
    })
    .sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0));
};

const downloadCsv = (draw) => {
  const rows = getReportRows(draw.results || []);
  const headers = ["Position", "Employee No", "Name", "Designation", "Department", "Location", "Status"];
  const csvRows = [headers.join(",")];

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const valueMap = {
        position: row.position,
        "employee no": row.number,
        name: row.name,
        designation: row.designation,
        department: row.department,
        location: row.location,
        status: row.status,
      };
      const value = valueMap[header.toLowerCase()] ?? "";
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${draw.type || "draw"}_draw_${draw.year || ""}_report.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const DrawHistory = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDraws = async () => {
      try {
        const data = await fetchAllDraws();
        if (isMounted) {
          setDraws(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDraws();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="mt-8 text-gray-600 dark:text-gray-300">Loading previous draws...</p>;
  }

  if (error) {
    return <p className="mt-8 text-red-600 font-semibold">❌ {error}</p>;
  }

  if (!draws.length) {
    return <p className="mt-8 text-gray-600 dark:text-gray-300">No previous draws found yet.</p>;
  }

  return (
    <section className="w-full max-w-6xl mt-10 rounded-[32px] border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-slate-950/80 p-6 shadow-2xl shadow-gray-400/10 backdrop-blur-xl">
      <div className="flex flex-col gap-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reports</h2>

        </div>
      </div>

      <div className="space-y-4">
        {draws.map((draw) => {
          const drawLabel = `${String(draw.type || "").charAt(0).toUpperCase()}${String(draw.type || "").slice(1)} Draw`;
          const drawYear = draw.year || new Date(draw.createdAt).getFullYear();
          const drawDate = new Date(draw.createdAt).toLocaleString();

          return (
            <article
              key={draw.id}
              className="rounded-[28px] border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                      {drawLabel}
                    </h3>
                    <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium dark:bg-blue-900/80 dark:text-blue-200">
                      Year {drawYear}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-gray-600 dark:text-gray-300">
                    <p className="truncate">{draw.results?.length || 0} selected employees</p>
                    <p className="truncate">Created: {drawDate}</p>
                    <p className="truncate">Winners: {draw.winners}</p>
                    <p className="truncate">Waiting: {draw.waiting}</p>
                  </div>
                </div>

                <div className="flex flex-col w-full sm:w-auto items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <DownloadPDFReport
                    results={getReportRows(draw.results || [])}
                    drawType={draw.type}
                    drawNumber={draw.id}
                    buttonLabel="📄 PDF"
                    className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded shadow-sm text-sm"
                  />
                  <button
                    onClick={() => downloadCsv(draw)}
                    className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded shadow-sm text-sm"
                  >
                    📊 CSV
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default DrawHistory;
