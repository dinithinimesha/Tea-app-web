"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation"; 

export default function AddProducts() {
  const [formData, setFormData] = useState({
    product_name: "",
    product_image: "",
    price: "",
    description: "",
    company: "",
    category: "Tea",
    quantity: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("images").upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      setMessage(`Image upload failed: ${error.message}`);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
    setImageUrl(publicUrlData.publicUrl);

    setFormData((prev) => ({
      ...prev,
      product_image: publicUrlData.publicUrl,
    }));
  };

  // Handle input change for all fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validate form fields
  const isFormValid = () => {
    return (
      formData.product_name.trim() &&
      formData.product_image.trim() &&
      formData.price &&
      formData.description.trim() &&
      formData.company.trim() &&
      formData.category &&
      formData.quantity &&
      formData.status !== ""
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("products").insert([
      {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        status: formData.status === "true" || formData.status === true,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Product added successfully!");
      alert("Product added successfully!");
      setFormData({
        product_name: "",
        product_image: "",
        price: "",
        description: "",
        company: "",
        category: "Tea",
        quantity: "",
        status: true,
      });
      setImageUrl("");
    }
    setLoading(false);
    router.push("/admindashboard/Products");
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
           {/* Image Preview */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Image preview"
            className="rounded-lg max-w-sm border shadow"
          />
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
          disabled={loading}
          className="px-6 py-2 text-black bg-[#77FF95] rounded-md hover:bg-[#5fe07a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>

    </form>
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
        required
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
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
        required
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
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
        value={value}
        onChange={onChange}
        className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );
}