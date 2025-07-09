// src/components/ConfirmModal.jsx
import React from "react";

const ConfirmModal = ({ drawType, onConfirm, onCancel }) => {
  if (!drawType) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center ">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Confirm Initiation of Draw
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
          You are about to start the <span className="font-semibold text-black dark:text-white">{drawType.toUpperCase()} Draw</span>. <br />
          This action is final and will generate official results.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            ✅ Proceed with Draw
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
