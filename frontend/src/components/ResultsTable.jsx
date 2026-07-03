import React from "react";

const ResultsTable = ({ results }) => {
  const winners = results
    .filter((r) => r.status === "winner")
    .sort((a, b) => a.position - b.position);

  const waiting = results
    .filter((r) => r.status === "waiting")
    .sort((a, b) => a.position - b.position);

  const renderTable = (title, list, accentClass, badgeClass) => (
    <section className="mb-8 overflow-hidden rounded-[24px] border border-slate-200 bg-white/90 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div
        className={`flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700 ${accentClass}`}
      >
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          {/* <p className="text-base opacity-80">{list.length} entries</p> */}
        </div>
{/* 
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${badgeClass}`}
        >
          {title.includes("Winners") ? "Selected" : "Reserve"}
        </span> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-left">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
            <tr>
              <th className="w-24 px-4 py-3 text-base font-semibold">
                Position
              </th>
              <th className="w-28 px-4 py-3 text-base font-semibold">
                Employee No
              </th>
              <th className="w-48 px-4 py-3 text-base font-semibold">Name</th>
              <th className="w-48 px-4 py-3 text-base font-semibold">
                Designation
              </th>
              <th className="w-48 px-4 py-3 text-base font-semibold">
                Department
              </th>
              <th className="w-48 px-4 py-3 text-base font-semibold">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr
                key={`${item.number}-${item.position}`}
                className={`border-t border-slate-100 transition duration-150 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70 ${index % 2 === 0 ? "bg-white/70 dark:bg-slate-900/50" : "bg-slate-50/70 dark:bg-slate-900/70"}`}
              >
                <td className="px-4 py-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {item.position}
                  </span>
                </td>
                <td className="px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200">
                  {item.number}
                </td>
                <td className="px-4 py-3 text-base font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-base text-slate-700 dark:text-slate-300">
                  {item.designation}
                </td>
                <td className="px-4 py-3 text-base text-slate-700 dark:text-slate-300">
                  {item.department}
                </td>
                <td className="px-4 py-3 text-base text-slate-700 dark:text-slate-300">
                  {item.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="mt-6 space-y-4 text-left">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
            Winners
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {winners.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300">
            Waiting
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {waiting.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-700 dark:text-slate-300">
            Total
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {results.length}
          </p>
        </div>
      </div>

      {renderTable(
        "Winners",
        winners,
        "text-emerald-700 dark:text-emerald-300",
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      )}
      {renderTable(
        "Waiting List",
        waiting,
        "text-amber-700 dark:text-amber-300",
        "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      )}
    </div>
  );
};

export default ResultsTable;
