"use client";
import { useState, useEffect, Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";  // Import useRouter

const supabase = createClientComponentClient();

// 🧩 Reusable Input Component
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block p-1 text-[#77FF95]">{label}</label>
    <input
      id={name}
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
    />
  </div>
);

// 🧩 Reusable Textarea Component
const TextareaField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block p-1 text-[#77FF95]">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      rows="2"
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-1 focus:ring-[#77FF95]"
    />
  </div>
);

// 📄 Main Profile Form
const ProfileForm = () => {
  const router = useRouter();  // Initialize router

  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    phonenumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // 🔁 Fetch Session + Profile
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user?.id) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          setFormData({
            username: data?.username || "",
            full_name: data?.full_name || "",
            phonenumber: data?.phonenumber || "",
            address: data?.address || "",
          });
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
          setSession(newSession);
        });

        return () => listener?.subscription?.unsubscribe?.();
      } catch (err) {
        console.error("Profile fetch error:", err);
        setMessage("Failed to load profile data.");
        setMessageType("error");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSessionAndProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!session?.user?.id) throw new Error("No authenticated user found");

      const { error } = await supabase.from("profiles").upsert([
        {
          id: session.user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setMessage("Profile updated successfully!");
      router.push("/admindashboard/Profile"); // <-- Use router here
      setMessageType("success");
    } catch (error) {
      console.error("Update error:", error);
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-[#77FF95]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-6">
        <p className="text-lg text-red-500">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold text-[#77FF95]">Update Profile</h2>

      <InputField label="Username" name="username" value={formData.username} onChange={handleInputChange} />
      <InputField label="Full Name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
      <InputField label="Phone Number" name="phonenumber" value={formData.phonenumber} onChange={handleInputChange} />
      <TextareaField label="Address" name="address" value={formData.address} onChange={handleInputChange} />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-black bg-[#77FF95] rounded-md hover:bg-[#5fe07a] disabled:opacity-50 focus:ring-2 focus:ring-[#77FF95]"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 p-2 rounded-md text-center ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

// 🌐 Page Wrapper with Suspense
const ProfilePage = () => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-[#77FF95]" />
      </div>
    }
  >
    <ProfileForm />
  </Suspense>
);

export default ProfilePage;
