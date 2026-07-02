import React, { useEffect, useState } from "react";
import LuckyDraw from "./components/LuckyDraw";
import ResultsTable from "./components/ResultsTable";
import DownloadPDFReport from "./components/DownloadPDFReport";
import WelcomeScreen from "./components/WelcomeScreen";
import ConfirmModal from "./components/ConfirmModal";
import DrawHistory from "./components/DrawHistory";
import drawConfigs from "./config/drawConfigs";
import { toFirstWordUpper } from "./utils/textUtils";

import ogdclLogo from "../public/ogdcl_logo_hd.svg";

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
      "(prefers-color-scheme: dark)",
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
    setPendingDrawType(type);
    setTimeout(() => setDrawType(type), 100);
  };

  const handleResults = (newResults) => {
    const reversed = [...newResults].reverse();
    setResults(reversed);
  };

  const openDrawConfirmation = (type) => {
    setPendingDrawType(type);
    setScreen("confirmDraw");
  };

  const startConfirmedDraw = () => {
    setShowModal(false);
    handleStartDraw(pendingDrawType);
    setScreen("drawing");
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
      <main className="flex-grow p-2  flex flex-col items-center justify-start">
        <div
          className={`w-full flex items-center mb-12 mt-2 print:mb-4 ${screen === "drawing" ? "justify-between" : "justify-center"} ${screen === "drawing" ? "flex-row" : "flex-col"}`}
        >
          <img
            src={ogdclLogo}
            alt="OGDCL Logo"
            className={`${screen === "drawing" ? " w-20 md:w-40 " : " w-40 md:w-96 "} print:mb-2 mb-4`}
          />

          <h1 className={`flex-1 text-right font-extrabold mb-4 print:text-3xl drop-shadow-lg ${screen === "drawing" ? " text-3xl " : " text-7xl "}`}>
            Hajj & Umrah Lucky Draw
          </h1>
        </div>

        {screen === "welcome" && (
          <>
            <WelcomeScreen onProceed={() => setScreen("selection")} />
          </>
        )}

        {screen === "selection" && (
          <>
            <div className="my-20 mb-12 flex flex-col gap-20 h-20 md:flex-row md:justify-center">
              {Object.keys(drawConfigs).map((type) => {
                const isCompleted = completedDraws.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (!isCompleted) {
                        openDrawConfirmation(type);
                      }
                    }}
                    disabled={isCompleted}
                    className={`inline-flex items-center justify-center rounded-[24px] border px-8 py-4 text-lg font-semibold shadow-[0_16px_40px_rgba(15,23,42,0.14)] transition-all duration-300 print:hidden md:text-xl ${
                      isCompleted
                        ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                        : "border-emerald-600 cursor-pointer  bg-emerald-700 text-white hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-[0_20px_50px_rgba(5,150,105,0.25)] dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    }`}
                  >
                    {isCompleted
                      ? `${toFirstWordUpper(type)} Draw Done`
                      : `Start ${toFirstWordUpper(type)} Draw`}
                  </button>
                );
              })}
            </div>
            <DrawHistory />
          </>
        )}

        {screen === "confirmDraw" && pendingDrawType && (
          <div className="w-full max-w-4xl rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-400">
                Ready to start
              </p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                {toFirstWordUpper(pendingDrawType)} Draw Info
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  Draw Number
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {drawConfigs[pendingDrawType].drawNumber}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  Winners
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {drawConfigs[pendingDrawType].winners}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  Waiting List
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {drawConfigs[pendingDrawType].waiting}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setShowModal(true)}
                className="w-full rounded-3xl cursor-pointer bg-emerald-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-800 sm:w-auto"
              >
                Start Draw
              </button>
              <button
                onClick={() => {
                  setPendingDrawType(null);
                  setScreen("selection");
                }}
                className="w-full rounded-3xl cursor-pointer border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
              >
                Back to selection
              </button>
            </div>
          </div>
        )}

        {screen === "drawing" && drawType && (
          <>
            <div className="w-full max-w-6xl rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/90 mb-10 animate-fade-in">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="flex flex-row gap-2 items-center text-sm uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-400">
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Live draw in progress
                  </p>
                  <h2 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-wide">
                    {toFirstWordUpper(drawType)} Draw
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-100 px-5 py-4 text-center text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                    Draw No.
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {drawConfigs[drawType].drawNumber}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 px-5 py-4 text-center text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                    Winners
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {drawConfigs[pendingDrawType].winners}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 px-5 py-4 text-center text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                    Waiting List
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {drawConfigs[pendingDrawType].waiting}
                  </p>
                </div>
              </div>
              </div>
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
                  Official {toFirstWordUpper(drawType)} Draw Report
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
          onConfirm={startConfirmedDraw}
          onCancel={() => {
            setShowModal(false);
            setPendingDrawType(null);
            setScreen("selection");
          }}
        />
      )}

      <footer className="text-md text-gray-500 flex flex-row justify-center items-end dark:text-gray-400 text-center py-4">
        <p className="mr-10">
          Developed by the In-House IT Applications Team, Systems
          Department{" "}
        </p>
        <div className="relative group">
          <div className="rounded-full flex items-center justify-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <button
              onClick={toggleTheme}
              className="opacity-5 grayscale group-hover:opacity-100 transition-opacity duration-300"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
        <button
          onClick={handleFullScreen}
          className="text-gray-500 dark:text-gray-100 opacity-5 hover:opacity-100 transition ml-4"
        >
          ⛶
        </button>
      </footer>
    </div>
  );
}

export default App;
