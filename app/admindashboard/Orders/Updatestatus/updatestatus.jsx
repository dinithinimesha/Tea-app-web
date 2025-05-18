import React, { useState, useEffect } from "react";

const UpdateStatusModal = ({ isOpen, onClose, onSave, currentStatus }) => {
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    setStatus(currentStatus || "Pending");
  }, [currentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
      <div className="p-6 text-white  bg-black  rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
          <div className="flex flex-col items-start space-y-3">
            {["Pending", "Accepted", "Picked", "Cancelled"].map((s) => (
              <label key={s} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                {s}
              </label>
            ))}
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => onSave(status)}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-orange-400 focus:outline-none"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
