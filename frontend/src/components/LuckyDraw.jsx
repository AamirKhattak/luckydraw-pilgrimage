import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { runDraw, fetchDrawLogs } from "../services/api"; // ✅ import backend API
import CounterDisplay from "./CounterDisplay";
import DrawInfoCard from "./DrawInfoCard";
import RandomLogPanel from "./RandomLogPanel";

const LuckyDraw = ({ drawType, config, onComplete }) => {
  const [currentNumber, setCurrentNumber] = useState("------");
  const [results, setResults] = useState([]);
  const [drawLogs, setDrawLogs] = useState([]);
  const [visibleLogCount, setVisibleLogCount] = useState(0);
  const [activeLogId, setActiveLogId] = useState(null);
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
        testMode ? 30 : delay
      );
    });
  };

  const playLogsUntil = async (logs, targetIndex) => {
    if (targetIndex < 0) return;
    let visible = visibleLogCount;
    while (visible <= targetIndex && visible < logs.length) {
      const log = logs[visible];
      setCurrentNumber(log.generated_number);
      setActiveLogId(log.id);
      setVisibleLogCount(visible + 1);
      visible += 1;
      await new Promise((res) => setTimeout(res, testMode ? 25 : 80));
    }
    if (targetIndex >= logs.length && logs.length > 0) {
      const finalLog = logs[logs.length - 1];
      setCurrentNumber(finalLog.generated_number);
      setActiveLogId(finalLog.id);
    }
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

      const logs = await fetchDrawLogs(response.draw_id);
      setDrawLogs(logs);
      setVisibleLogCount(logs.length > 0 ? 1 : 0);
      setActiveLogId(null);

      console.log(response);
      // 🔁 Transform backend response to frontend-friendly format
      const data = response.results.map((entry) => ({
        employee_id: entry.employee.id,
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
        const matchingLogIndex = logs.findIndex(
          (log) =>
            log.generated_number === item.random_number_used &&
            log.matched_employee_id === item.employee_id
        );
        const matchingLog = matchingLogIndex >= 0 ? logs[matchingLogIndex] : null;

        await playLogsUntil(logs, matchingLogIndex);
        setActiveLogId(matchingLog?.id ?? null);

        setCurrentNumber(item.number);
        fullResult.push(item);
        setResults([...fullResult]);
        await new Promise((res) => setTimeout(res, testMode ? 200 : 1500));
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
    setDrawLogs([]);
    setVisibleLogCount(0);
    setActiveLogId(null);

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
    <div className="mt-10 flex h-full w-full max-w-full flex-col items-center justify-center overflow-hidden">
      {showCountdown && (
        <div className="text-6xl font-extrabold text-red-500 mb-6 animate-bounce">
          Starting in {countdown}...
        </div>
      )}

      {!showCountdown && !showCongrats && (
        <div className="flex w-full max-w-[1600px] flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 min-w-0">
            <CounterDisplay number={currentNumber} />
            <DrawInfoCard current={current} results={results} config={config} />
          </div>

          <div className="flex w-full flex-col gap-4 lg:w-[420px] lg:min-w-[420px]">
            <RandomLogPanel
              drawLogs={drawLogs}
              visibleLogCount={visibleLogCount}
              activeLogId={activeLogId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
