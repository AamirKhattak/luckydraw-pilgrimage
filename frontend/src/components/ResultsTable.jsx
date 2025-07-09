// lucky-draw-frontend/src/components/ResultsTable.jsx
import React from "react";

const ResultsTable = ({ results }) => {
  const winners = results
    .filter((r) => r.status === "winner")
    .sort((a, b) => a.position - b.position);

  const waiting = results
    .filter((r) => r.status === "waiting")
    .sort((a, b) => a.position - b.position);

  const renderTable = (title, list) => (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border text-left bg-white dark:bg-gray-800 shadow rounded">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr className="text-gray-800 dark:text-gray-100">
              <th className="px-4 py-2 w-20">Draw Position</th>
              <th className="px-4 py-2 w-32">Employee No</th>
              <th className="px-4 py-2 w-48">Name</th>
              <th className="px-4 py-2 w-48">Designation</th>
              <th className="px-4 py-2 w-48">Department</th>
              <th className="px-4 py-2 w-48">Location</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr
                key={`${item.number}-${item.position}`}
                className="border-t hover:bg-blue-100 dark:hover:bg-blue-700 transition duration-150 ease-in-out text-gray-900 dark:text-white"
              >
                <td className="px-4 py-2">{item.position}</td>
                <td className="px-4 py-2">{item.number}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.designation}</td>
                <td className="px-4 py-2">{item.department}</td>
                <td className="px-4 py-2">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="mt-10 text-left">
      {renderTable("🎉 Winners", winners)}
      {renderTable("* Waiting List", waiting)}
    </div>
  );
};

export default ResultsTable;
