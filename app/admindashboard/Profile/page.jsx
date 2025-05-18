"use client";

import React from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/page';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/Header';
import Profile from '@/app/admindashboard/Profile/profile';

const AdminDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Profile" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
