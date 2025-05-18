// app/admindashboard/Orders/Updateorder/updateorder.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

const UpdateOrderClient = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return <div className="text-white">Update Order ID: {orderId}</div>;
};

export default UpdateOrderClient;
