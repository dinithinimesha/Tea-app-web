import React from "react";

const DescriptionModel = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
      <div className="p-6 text-white bg-black rounded-lg w-110">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Product Details</h3>

          {/* Table for displaying products */}
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Unit Price</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
  {products.map((product, index) => (
    <tr key={index} className="border-b">
      <td className="px-4 py-2">{product.product_name}</td>
      <td className="px-4 py-2">{product.product_price}</td>
      <td className="px-4 py-2">{product.product_quantity}</td>
      <td className="px-4 py-2">{(product.product_price * product.product_quantity).toFixed(2)}</td>
    </tr>
  ))}
  <tr>
    <td className="px-4 py-2 text-red-500">Total</td>
    <td className="px-4 py-2 text-red-500" colSpan="3">
      {products.reduce((total, product) => total + (product.product_price * product.product_quantity), 0).toFixed(2)}
    </td>
  </tr>
</tbody>

          </table>

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
