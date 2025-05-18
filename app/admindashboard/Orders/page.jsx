"use client";

import React from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/page';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/Header';
import Orders from '@/app/admindashboard/Orders/Orders';

const AdminDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Orders" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Orders />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
