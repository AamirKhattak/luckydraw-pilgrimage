import React from "react";

const RandomLogPanel = ({ drawLogs, visibleLogCount, activeLogId }) => {
  const visibleLogs = drawLogs.slice(0, visibleLogCount || 1).slice(-20);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Random Number Log
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live picks and matched employee hits
          </p>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">Total {drawLogs.length}</span>
      </div>

      <div className="flex h-[calc(100vh-280px)] flex-col overflow-hidden rounded-3xl bg-slate-50 p-3 dark:bg-slate-950">
        {drawLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
            Waiting for random logs...
          </div>
        ) : (
          <div className="grid gap-2 overflow-y-auto pr-1">
            {visibleLogs.map((log) => (
              <div
                key={log.id}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${
                  log.id === activeLogId
                    ? "border-emerald-500 bg-emerald-50 text-slate-900 dark:bg-emerald-900/70 dark:text-white"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{log.generated_number}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      log.matched_employee
                        ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {log.matched_employee ? "Matched" : "No match"}
                  </span>
                  {log.matched_employee && log.Employee && (
                    <span className="text-slate-500 dark:text-slate-400">
                      → {log.Employee.employee_number}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomLogPanel;
