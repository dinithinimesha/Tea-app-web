// app/admindashboard/Orders/Updateorder/page.jsx

'use client';

import React, { Suspense } from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/page';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/Header';
import UpdateProductClient from '@/app/admindashboard/Orders/Updateorder/updateorder';

const UpdateProduct = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Update Product" />
        <div className="p-4">
          {/* Wrap UpdateProductClient in Suspense */}
          <Suspense fallback={<div>Loading...</div>}>
            <UpdateProductClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
