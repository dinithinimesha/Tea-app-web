import React from "react";

const DescriptionModel = ({ isOpen, onClose, name, description, selectedProductId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
      <div className="p-6 text-white bg-black rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Description</h3>
          <p className="mb-4">Product ID: {selectedProductId}</p>
          <p className="mb-4">Name: {name}</p>
          <br />
          <p className="mb-4">{description}</p>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModel;
