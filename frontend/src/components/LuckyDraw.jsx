import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { runDraw } from "../services/api"; // ✅ import backend API

const LuckyDraw = ({ drawType, config, onComplete }) => {
  const [currentNumber, setCurrentNumber] = useState("------");
  const [results, setResults] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  const testMode = false;

  const blastConfettiSides = () => {
    confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
  };

  const animateNumber = (final, delay) => {
    return new Promise((resolve) => {
      let counter = 0;
      const interval = setInterval(
        () => {
          const rand = Math.floor(100000 + Math.random() * 900000).toString();
          setCurrentNumber(rand);
          counter++;
          if (counter >= 20) {
            clearInterval(interval);
            setCurrentNumber(final);
            if (!testMode) blastConfettiSides();
            resolve();
          }
        },
        testMode ? 30 : delay,
      );
    });
  };

  const startDraw = async () => {
    try {
      // ✅ Send full payload to match backend expectations
      const response = await runDraw({
        drawType,
        winners: config.winners,
        waiting: config.waiting,
        year: config.drawYear,
      });

      console.log(response);
      // 🔁 Transform backend response to frontend-friendly format
      const data = response.results.map((entry) => ({
        number: entry.employee.employee_number,
        name: entry.employee.name,
        designation: entry.employee.designation,
        department: entry.employee.department,
        location: entry.employee.location,
        status: entry.status,
        position: entry.position,
        drawn_at: entry.drawn_at,
        random_number_used: entry.random_number_used,
      }));

      const fullResult = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        await animateNumber(item.number, 80);
        fullResult.push(item);
        setResults([...fullResult]);
        await new Promise((res) => setTimeout(res, testMode ? 200 : 3000));
      }

      setIsDrawing(false);
      setShowCongrats(true);
      onComplete(fullResult);
    } catch (error) {
      console.error("Draw failed:", error.message);
      alert("Draw failed: " + error.message);
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    setCountdown(3);
    setShowCountdown(true);
    setShowCongrats(false);
    setIsDrawing(false);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setIsDrawing(true);
          //startDraw();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [drawType]);

  useEffect(() => {
    if (!isDrawing) return;

    // Start the draw
    startDraw();

    // Prevent navigation
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleKeyDown = (e) => {
      const isRefreshKey =
        e.key === "F5" ||
        (e.ctrlKey && e.key.toLowerCase() === "r") ||
        (e.metaKey && e.key.toLowerCase() === "r"); // Cmd+R on Mac

      if (isRefreshKey) {
        e.preventDefault();
        alert("Page refresh is disabled during the draw.");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawing]);

  const current = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="mt-10 flex flex-col items-center">
      {showCountdown && (
        <div className="text-6xl font-extrabold text-red-500 mb-6 animate-bounce">
          Starting in {countdown}...
        </div>
      )}

      {!showCountdown && !showCongrats && (
        <>
          <div className="relative mb-10 w-full max-w-4xl">
            <div className="absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 rounded-[2rem] bg-gradient-to-r from-emerald-500/10 via-slate-100/80 to-emerald-500/10 blur-3xl" />
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-200 bg-white/95 px-8 py-8 text-center shadow-[0_35px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
              <span className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-sm">
                Selected Employee Number
              </span>
              <div className="font-mono text-[14vw] leading-none md:text-[8rem] font-black tracking-[0.02em] text-slate-900 dark:text-white">
                {currentNumber}
              </div>
            </div>
          </div>

          {isDrawing && current && (
            <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl px-10 py-10 mt-2 w-[95vw] max-w-4xl min-h-[320px] text-center animate-fade-in transition duration-300 overflow-hidden">
              <div className="flex flex-row justify-between items-start">
                <p className="">
                  <span
                    className={`inline-block px-6 py-2 text-lg font-bold rounded-full shadow-md tracking-wide
                  ${
                    current.status === "winner"
                      ? "bg-green-600 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                  >
                    {current.status === "winner" ? "Winner" : "Waiting List"}
                  </span>
                </p>
                <p className="text-lg text-gray-500">
                  {current.status === "waiting"
                    ? `Waiting List Position ${results.length} of ${
                        config.winners + config.waiting
                      }`
                    : `Winner ${results.length} of ${
                        config.winners + config.waiting
                      }`}
                </p>
              </div>

              <h3 className="text-4xl md:text-5xl font-extrabold text-green-700 dark:text-green-400 mb-6">
                <p className="text-4xl text-gray-700 dark:text-gray-300 mb-2">
                  <strong>{current.number}</strong>
                </p>
                {current.name}
              </h3>

              <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
                {current.designation} — {current.department}
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-400 italic">
                {current.location}
              </p>
            </div>
          )}
        </>
      )}

      {showCongrats && (
        <div className="mt-16 text-center animate-fade-in">
          <h2 className="text-6xl font-extrabold text-green-400 mb-6">
            🎊 Congratulations! 🎊
          </h2>
          <p className="text-3xl text-black dark:text-white">
            All winners have been drawn.
          </p>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
