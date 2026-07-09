// lucky-draw-frontend/src/components/WelcomeScreen.jsx
import React from "react";
import { FaKaaba, FaMosque } from "react-icons/fa";

const WelcomeScreen = ({ onProceed }) => {

  return (
    <div className="flex flex-col items-center py-10 px-48 justify-center min-h-[70vh] text-center bg-gradient-to-br shadow-2xl rounded-xl from-yellow-50 via-white to-yellow-100 dark:from-black dark:via-gray-900 dark:to-black dark:border-white transition-all duration-500">
      <div className="text-7xl md:text-8xl text-yellow-600 dark:text-yellow-400 mb-6">
        🕋
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4 drop-shadow-md">
        Welcome to the
      </h1>

      <h2 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-green-400 mb-4">
        Annual Hajj & Umrah Draw <br/> For the year 2026-27
      </h2>

      <p className="text-xl mt-5 md:text-2xl max-w-3xl text-gray-700 dark:text-gray-300 mb-6 italic">
        "And complete the Hajj and ‘Umrah for Allah..." <br />
        <span className="text-sm">(Surah Al-Baqarah 2:196)</span>
      </p>

      {/* <div className="text-3xl text-blue-800 dark:text-blue-300 font-semibold mb-12">
        For the year 2027
      </div> */}

      <button
        onClick={onProceed}
        className="bg-green-700 cursor-pointer hover:bg-green-800 text-white text-xl font-bold py-4 px-10 rounded-lg shadow-lg transition-transform hover:scale-105"
      >
        Proceed to Draw
      </button>
      {/* <div className="mt-8 text-gray-600 dark:text-gray-400">
            <FaKaaba className="inline-block mr-2 text-yellow-500" />
            <FaMosque className="inline-block text-blue-500" />
            </div> */}
    </div>
  );
};

export default WelcomeScreen;
