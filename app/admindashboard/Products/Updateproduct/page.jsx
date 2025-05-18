"use client";

import React, { Suspense } from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/page';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/Header';
import UpdateProduct from '@/app/admindashboard/Products/Updateproduct/updateproducts';

const AdminDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Update Product" />
        <div className="p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <UpdateProduct />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
