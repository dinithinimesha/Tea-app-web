'use client';

import React, { useState, useEffect } from "react";
import { SquarePen, Trash2 } from "lucide-react";

import DeleteOrderModal from '@/app/admindashboard/Products/Deleteproduct/deleteproduct';
import DescriptionModal from '@/app/components/Productdetails';
import ShippingAddressModal from '@/app/components/ShippingAddressModel';
import UpdateStatusModal from "./Updatestatus/updatestatus";
import ProfileModal from "@/app/components/ProfileModel";
import { supabase } from "@/lib/supabase";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [modals, setModals] = useState({
    delete: false,
    status: false,
    description: false,
    shipping: false,
    profile: false,
  });
  const [currentStatus, setCurrentStatus] = useState("Pending");

  const ordersPerPage = 9;

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) {
        setOrders(prev => prev.filter(order => order.id !== id));
      } else {
        console.error('Error deleting order:', error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      closeModal('delete');
    }
  };

  const getStatusClasses = (status) => {
    const styles = {
      Accepted: "bg-green-500 text-gray-900",
      Picked: "bg-yellow-500 text-white",
      Cancelled: "bg-red-500 text-white",
      Pending: "bg-blue-500 text-white",
    };
    return `px-2 py-1 rounded-md text-sm font-semibold ${styles[status] || "bg-gray-500 text-white"}`;
  };

  const openModal = (type) => setModals(prev => ({ ...prev, [type]: true }));
  const closeModal = (type) => setModals(prev => ({ ...prev, [type]: false }));

  const handleStatusModal = (id) => {
    const order = orders.find(o => o.id === id);
    setSelectedOrderId(id);
    setCurrentStatus(order?.order_status || "Pending");
    openModal('status');
  };

  const handleStatusSave = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', selectedOrderId);

      if (!error) {
        setOrders(prev =>
          prev.map(order =>
            order.id === selectedOrderId ? { ...order, order_status: newStatus } : order
          )
        );
      } else {
        console.error("Error updating status:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      closeModal('status');
    }
  };

  const fetchOrderDetails = async (id) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_products(*)')
      .eq('id', id)
      .single();

    if (!error) {
      setSelectedOrderDetails(data);
      openModal('description');
    } else {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchProfileDetails = async (id) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (!error) {
      setSelectedProfile(data.profiles);
      openModal('profile');
    } else {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchShippingAddress = async (id) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setSelectedShippingAddress(data);
      openModal('shipping');
    } else {
      console.error("Error fetching shipping address:", error);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="rounded-md shadow-lg">
      <div className="overflow-auto max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 bg-[#2B2623] rounded-xl">
          <thead className="text-gray-900 bg-[#77FF95]">
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Order Product</th>
              <th className="px-4 py-2">Profile</th>
              <th className="px-4 py-2">Order Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Delivery Address</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">
                  <button onClick={() => fetchOrderDetails(order.id)} className="text-orange-400 hover:underline">
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => fetchProfileDetails(order.id)} className="text-orange-400 hover:underline">
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <span className={getStatusClasses(order.order_status)}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button onClick={() => fetchShippingAddress(order.id)} className="text-orange-400 hover:underline">
                    View
                  </button>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleStatusModal(order.id)}>
                    <SquarePen size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      openModal('delete');
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrderDetails?.order_products && (
        <DescriptionModal
          isOpen={modals.description}
          onClose={() => closeModal('description')}
          products={selectedOrderDetails.order_products}
        />
      )}

      {selectedProfile && (
        <ProfileModal
          isOpen={modals.profile}
          onClose={() => closeModal('profile')}
          profiledetails={selectedProfile}
        />
      )}

      {modals.shipping && selectedShippingAddress && (
        <ShippingAddressModal
          isOpen={modals.shipping}
          onClose={() => closeModal('shipping')}
          orders={selectedShippingAddress}
        />
      )}

      {modals.delete && (
        <DeleteOrderModal
          isOpen={modals.delete}
          onClose={() => closeModal('delete')}
          onDelete={() => handleDelete(selectedOrderId)}
        />
      )}

      {modals.status && (
        <UpdateStatusModal
          isOpen={modals.status}
          onClose={() => closeModal('status')}
          onSave={handleStatusSave}
          currentStatus={currentStatus}
        />
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;
