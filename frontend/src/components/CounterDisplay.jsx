import React from "react";

const CounterDisplay = ({ number }) => (
  <div className="bg-white text-black font-semibold text-[9vw] md:text-9xl tracking-wide px-10 py-6 rounded-3xl border border-gray-300 shadow-2xl shadow-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-700">
    {number}
  </div>
);

export default CounterDisplay;
