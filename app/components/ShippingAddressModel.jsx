import React from "react";

const DescriptionModel = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
      <div className="p-6 text-white bg-black rounded-lg w-110">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>

          <h3 className="mb-4 text-lg font-semibold">{orders.shipping_address}</h3>


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
