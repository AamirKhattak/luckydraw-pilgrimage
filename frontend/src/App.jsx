import React, { useEffect, useState } from "react";
import LuckyDraw from "./components/LuckyDraw";
import ResultsTable from "./components/ResultsTable";
import DownloadPDFReport from "./components/DownloadPDFReport";
import WelcomeScreen from "./components/WelcomeScreen";
import ConfirmModal from "./components/ConfirmModal";
import DrawHistory from "./components/DrawHistory";

import ogdclLogo from "../public/ogdcl_logo_hd.svg";

const drawConfigs = {
  hajj: { winners: 57, waiting: 25, drawYear: 2026, drawNumber: 41 },
  umrah: { winners: 12, waiting: 8, drawYear: 2026, drawNumber: 13 },
};

function App() {
  const [screen, setScreen] = useState("welcome");
  const [drawType, setDrawType] = useState(null);
  const [results, setResults] = useState([]);
  const [completedDraws, setCompletedDraws] = useState([]);
  const [theme, setTheme] = useState("light");
  const [pendingDrawType, setPendingDrawType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleStartDraw = async (type) => {
    setDrawType(null);
    setResults([]);
    setTimeout(() => setDrawType(type), 100);
  };

  const handleResults = (newResults) => {
    const reversed = [...newResults].reverse();
    setResults(reversed);
  };

  const handleFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  useEffect(() => {
    if (results.length > 0) {
      const section = document.getElementById("results-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [results]);

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-gradient-to-br dark:from-black dark:via-gray-800 dark:to-black text-black dark:text-white transition-colors duration-300 print:bg-white print:text-black">
      <main className="flex-grow p-8 flex flex-col items-center justify-start">
                  <img
            src={ogdclLogo}
            alt="OGDCL Logo"
            className="w-96  mb-6 print:mb-2"
          />
        <div className="w-full flex flex-row justify-center items-center mb-12 print:mb-4 space-x-4">

          <h1 className="text-7xl font-extrabold mb-4 print:text-3xl drop-shadow-lg text-center">
            Hajj & Umrah Lucky Draw
          </h1>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <button
                onClick={toggleTheme}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
            </div>
          </div>
        </div>

        {screen === "welcome" && (
          <>
            <WelcomeScreen onProceed={() => setScreen("selection")} />
            <button onClick={handleFullScreen}>⛶</button>
          </>
        )}

        {screen === "selection" && (
          <>
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:justify-center">
              {Object.keys(drawConfigs).map((type) => {
                const isCompleted = completedDraws.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (!isCompleted) {
                        // handleStartDraw(type);
                        // setScreen("drawing");
                        setPendingDrawType(type);
                        setShowModal(true);
                      }
                    }}
                    disabled={isCompleted}
                    className={`inline-flex items-center justify-center rounded-[24px] border px-8 py-4 text-lg font-semibold shadow-[0_16px_40px_rgba(15,23,42,0.14)] transition-all duration-300 print:hidden md:text-xl ${
                      isCompleted
                        ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                        : "border-emerald-600 bg-emerald-700 text-white hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-[0_20px_50px_rgba(5,150,105,0.25)] dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    }`}
                  >
                    
                    {isCompleted
                      ? `${type.toUpperCase()} Draw Done`
                      : `Start ${type.toUpperCase()} Draw`}
                  </button>
                );
              })}
            </div>
            <DrawHistory />
          </>
        )}

        {screen === "drawing" && drawType && (
          <>
            <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in">
              <span className="text-3xl md:text-4xl text-green-600">📣</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white text-center tracking-wide">
                {drawType.toUpperCase()} Draw
                <span className="block text-xl font-medium text-gray-600 dark:text-gray-300 mt-2">
                  Official Draw No. {drawConfigs[drawType].drawNumber} in
                  Progress
                </span>
              </h2>
            </div>

            <LuckyDraw
              drawType={drawType}
              config={drawConfigs[drawType]}
              onComplete={(res) => {
                handleResults(res);
                setCompletedDraws((prev) => [...prev, drawType]);
                setScreen("results");
              }}
            />
          </>
        )}

        {screen === "results" && results.length > 0 && (
          <div className="w-full max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-400">
                  Results ready
                </p>
                <h2 className="mt-2 text-3xl font-white text-slate-200 sm:text-4xl">
                  Official {drawType} Draw Report
                </h2>
              </div>
              <DownloadPDFReport
                results={results}
                drawType={drawType}
                drawNumber={drawConfigs[drawType].drawNumber}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border cursor-pointer border-emerald-600 bg-emerald-700 px-8 py-3.5 text-base font-semibold text-white shadow-[0_16px_40px_rgba(5,150,105,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 md:text-lg"
              />
            </div>
            <ResultsTable results={results} />
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setResults([]);
                  setDrawType(null);
                  setScreen("selection");
                }}
                className="rounded-2xl bg-slate-900 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-700"
              >
                Start Next Draw
              </button>
            </div>
          </div>
        )}
      </main>
      {showModal && (
        <ConfirmModal
          drawType={pendingDrawType}
          onConfirm={() => {
            setShowModal(false);
            handleStartDraw(pendingDrawType);
            setScreen("drawing");
          }}
          onCancel={() => {
            setShowModal(false);
            setPendingDrawType(null);
          }}
        />
      )}

      <footer className="text-md text-gray-500 dark:text-gray-400 text-center py-4">
        Developed by the In-House IT Applications Team, Systems Department
      </footer>
    </div>
  );
}

export default App;
