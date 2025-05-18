"use client";

import React from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/page';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/Header';
import Addproduct from '@/app/admindashboard/Products/Addproducts/addproducts';


const AddProducts = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Add Product" /> {/* Pass route-specific title */}
        <div className="p-4">
         <Addproduct />
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
