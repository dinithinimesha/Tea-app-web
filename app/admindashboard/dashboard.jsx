"use client"; // if you're using Next.js App Router
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const DashboardSection = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) console.error("Error fetching orders:", error);
      else setOrders(data);
    };
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.order_status === "Accepted").length;
  const pendingOrders = orders.filter(order => order.order_status === "Pending").length;

  return (
    <div className="p-6 bg-black text-white rounded-xl w-full">
      <div className="grid grid-cols-3 gap-6">
        <Link href="/admindashboard/Products/Addproducts">
          <div className="p-6 flex flex-col items-center justify-center bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition">
            <Plus size={32} className="mb-2" />
            <p>Add Product</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="p-6 flex flex-col items-center justify-center bg-gray-800 rounded-lg">
          <p className="text-3xl font-bold">{totalOrders}</p>
          <p>Total Orders</p>
        </div>
        <div className="p-6 flex flex-col items-center justify-center bg-gray-800 rounded-lg">
          <p className="text-3xl font-bold">{completedOrders}</p>
          <p>Completed Orders</p>
        </div>
        <div className="p-6 flex flex-col items-center justify-center bg-gray-800 rounded-lg">
          <p className="text-3xl font-bold">{pendingOrders}</p>
          <p>Pending Orders</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
