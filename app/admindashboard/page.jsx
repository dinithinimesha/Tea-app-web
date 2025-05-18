"use client";

import React from 'react';
import Sidebar from '../../app/admindashboard/Sidebar/page';
import Topbar from '../../app/admindashboard/Topbar/page';
import Header from './Header/Header';
import Dashboard from '../../app/admindashboard/dashboard';

const AdminDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
