import React from "react";

const DrawInfoCard = ({ current, results, config }) => {
  if (!current) return null;

  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl px-10 py-10 mt-8 w-full min-h-[320px] text-center animate-fade-in transition duration-300 overflow-hidden">
      <p className="mb-6">
        <span
          className={`inline-block px-6 py-2 text-lg font-bold rounded-full shadow-md tracking-wide ${
            current.status === "winner"
              ? "bg-green-600 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {current.status === "winner" ? "Winner" : "Waiting List"}
        </span>
      </p>

      <div className="text-4xl md:text-5xl font-extrabold text-green-700 dark:text-green-400 mb-6">
        <div className="text-4xl text-gray-700 dark:text-gray-300 mb-2">
          <strong>{current.number}</strong>
        </div>
        <div>{current.name}</div>
      </div>

      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
        {current.designation} — {current.department}
      </p>
      <p className="text-xl text-gray-600 dark:text-gray-400 italic">{current.location}</p>
      <p className="text-lg text-gray-500 mt-6">
        {current.status === "waiting"
          ? `Waiting List Position ${results.length} of ${config.winners + config.waiting}`
          : `Winner ${results.length} of ${config.winners + config.waiting}`}
      </p>
    </div>
  );
};

export default DrawInfoCard;
