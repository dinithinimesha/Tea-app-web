"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

function UpdateProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    product_name: "",
    product_image: "",
    price: "",
    description: "",
    company: "",
    category: "Tea", // Default category set to "Tea"
    quantity: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      getDataById(id);
    }
  }, [id]);

  async function getDataById(productId) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load product data.");
      return;
    }

    if (data) {
      setFormData(data);
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, product_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("products").upsert([
      { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Product saved successfully!");
      alert("Product saved successfully!");
      setFormData({
        product_name: "",
        product_image: "",
        price: "",
        description: "",
        company: "",
        category: "Tea", // Reset category to default
        quantity: "",
        status: true,
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="Product Name" name="product_name" value={formData.product_name} onChange={handleInputChange} />
        <div>
          <label className="block p-1 text-[#77FF95]">Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
            required
          />
          {formData.product_image && (
            <img src={formData.product_image} alt="Image preview" className="rounded-lg max-w-sm border shadow" />
          )}
        </div>
        <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
        <div className="sm:col-span-2">
          <TextareaField label="Description" name="description" value={formData.description} onChange={handleInputChange} />
        </div>
        <InputField label="Factory" name="company" value={formData.company} onChange={handleInputChange} />
        <CategoryField value={formData.category} onChange={handleInputChange} />
        <InputField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} />
        <StatusField value={formData.status} onChange={handleInputChange} />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-black bg-[#77FF95] rounded-md hover:bg-[#5fe07a] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Saving..." : "Update Product"}
        </button>
      </div>

      {message && <p className="mt-2 text-center text-red-500">{message}</p>}
    </form>
  );
}

export default function UpdateProduct() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateProductContent />
    </Suspense>
  );
}

// Reusable Components
function InputField({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block p-1 text-[#77FF95]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
        required
      />
    </div>
  );
}

function TextareaField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block p-1 text-[#77FF95]">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
        required
      />
    </div>
  );
}

function CategoryField({ value, onChange }) {
  return (
    <div>
      <label className="block p-1 text-[#77FF95]">Category</label>
      <select
        name="category"
        value={value}
        onChange={onChange}
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
      >
        <option value="Tea">Tea</option>
        <option value="Coffee">Coffee</option>
      </select>
    </div>
  );
}

function StatusField({ value, onChange }) {
  return (
    <div>
      <label className="block p-1 text-[#77FF95]">Status</label>
      <select
        name="status"
        value={String(value)}
        onChange={onChange}
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );
}
