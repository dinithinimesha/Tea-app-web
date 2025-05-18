import React from "react";

const ProfileModel = ({ isOpen, onClose, profiledetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-6 text-white bg-black rounded-lg w-[400px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-zinc-700 pb-2">
            <span className="text-gray-400">Username:</span>
            <span>{profiledetails?.username || "No data"}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-700 pb-2">
            <span className="text-gray-400">Full Name:</span>
            <span>{profiledetails?.full_name || "No data"}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-700 pb-2">
            <span className="text-gray-400">Phone Number:</span>
            <span>{profiledetails?.phonenumber || "No data"}</span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModel;
