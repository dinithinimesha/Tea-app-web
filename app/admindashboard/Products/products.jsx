'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, SquarePen, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DeleteProduct from '@/app/admindashboard/Products/Deleteproduct/deleteproduct';
import DescriptionModel from '@/app/components/DescriptionModel';

// Constants
const PRODUCTS_PER_PAGE = 9;
const TABLE_HEADERS = ['Id', 'Name', 'Price', 'Company', 'Description', 'Category', 'Quantity', 'Status', 'Action'];

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 disabled:opacity-50"
    >
      Previous
    </button>
    <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
    <button
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-2 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

// Product Row Component
const ProductRow = ({ product, onDeleteClick, onDescriptionClick }) => (
  <tr className="border-b border-gray-700">
    <td className="px-4 py-2">{product.id}</td>
    <td className="px-4 py-2">{product.product_name}</td>
    <td className="px-4 py-2">{product.price}</td>
    <td className="px-4 py-2">{product.company}</td>
    <td className="px-4 py-2">
      <button
        onClick={() => onDescriptionClick(product)}
        className="text-orange-400 hover:underline"
      >
        View
      </button>
    </td>
    <td className="px-4 py-2">{product.category}</td>
    <td className="px-4 py-2">{product.quantity}</td>
    <td className="px-4 py-2">
      <span className={product.status ? 'text-green-500' : 'text-red-500'}>
        {product.status ? 'Available' : 'Not Available'}
      </span>
    </td>
    <td className="px-4 py-2 flex gap-2">
      <Link href={`/admindashboard/Products/Updateproduct?id=${product.id}`} className="ml-2">
        <SquarePen size={18} />
      </Link>
      <button
        onClick={() => onDeleteClick(product.id)}
        className="text-red-500 hover:text-red-400"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
);

// Main Component
const ProductsTable = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err.message);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product handler
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err.message);
      setError('Failed to delete product');
    } finally {
      setIsDeleteOpen(false);
    }
  };

  // Event handlers
  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setIsDeleteOpen(true);
  };

  const handleDescriptionClick = (product) => {
    setSelectedProductDetails(product);
    setIsDescriptionOpen(true);
  };

  // Pagination logic
  const indexOfLast = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirst = indexOfLast - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));

  if (isLoading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="rounded-md shadow-lg">
      {/* Add Products Button */}
      <div className="mb-4 flex justify-end">
        <Link
          href="/admindashboard/Products/Addproducts"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#3B3737] text-[#77FF95] border border-[#77FF95] rounded-xl hover:bg-black transition"
        >
          <span>Add Products</span>
          <PlusCircle size={20} />
        </Link>
      </div>

      {/* Products Table */}
      <div className="overflow-auto max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 bg-[#2B2623] rounded-xl">
          <thead className="text-gray-900 bg-[#77FF95]">
            <tr>
              {TABLE_HEADERS.map(header => (
                <th key={header} className="px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onDeleteClick={handleDeleteClick}
                  onDescriptionClick={handleDescriptionClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={TABLE_HEADERS.length} className="px-4 py-8 text-center">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      {selectedProductDetails && (
        <DescriptionModel
          isOpen={isDescriptionOpen}
          onClose={() => setIsDescriptionOpen(false)}
          name={selectedProductDetails.product_name}
          description={selectedProductDetails.description}
          selectedProductId={selectedProductDetails.id}
        />
      )}

      {isDeleteOpen && (
        <DeleteProduct
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={() => handleDelete(selectedProductId)}
        />
      )}
    </div>
  );
};

export default ProductsTable;