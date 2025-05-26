"use client";
import { useState, useEffect, Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
const supabase = createClientComponentClient();

// 🧩 Read-only Input Component
const InputField = ({ label, value }) => (
  <div>
    <label className="block p-1 text-[#77FF95]">{label}</label>
    <input
      type="text"
      readOnly
      value={value || ""}
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md cursor-not-allowed"
    />
  </div>
);

// 🧩 Read-only Textarea Component
const TextareaField = ({ label, value }) => (
  <div>
    <label className="block p-1 text-[#77FF95]">{label}</label>
    <textarea
      readOnly
      value={value || ""}
      rows="2"
      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md cursor-not-allowed"
    />
  </div>
);

// 📄 Main Profile View (Read-only)
const ProfileForm = () => {
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    phonenumber: "",
    address: "",
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // 🔁 Fetch Session + Profile
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
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
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold text-[#77FF95]">Profile Details</h2>

      <InputField label="Username" value={formData.username} />
      <InputField label="Full Name" value={formData.full_name} />
      <InputField label="Phone Number" value={formData.phonenumber} />
      <TextareaField label="Address" value={formData.address} />

      <div className="flex justify-start mt-4">
        <Link
          href="/admindashboard/Profile/Editprofile"
          className="px-6 py-2 text-black bg-[#77FF95] rounded-md hover:bg-[#5fe07a] focus:ring-2 focus:ring-[#77FF95]"
        >
          Edit Profile
        </Link>
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
    </div>
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
