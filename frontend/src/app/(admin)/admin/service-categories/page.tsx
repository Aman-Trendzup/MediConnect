'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { adminApi } from '@/services/adminApi'; 
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}

export default function ServiceCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Modal States for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Deletion Confirmation Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Form States
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fetch Categories from Backend API using Axios
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;

      const data = await adminApi.getServiceCategories(params);
      
      if (data.success) {
        setCategories(data.services || data.categories || data.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch service categories:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle Add / Edit Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setErrorMsg('Category name is required');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      let data;
      if (modalMode === 'add') {
        data = await adminApi.createServiceCategory({
          name: categoryName,
          description: categoryDescription
        });
      } else {
        data = await adminApi.updateServiceCategory(selectedCategory?._id as string, {
          name: categoryName,
          description: categoryDescription
        });
      }

      if (data.success) {
        setIsModalOpen(false);
        setCategoryName('');
        setCategoryDescription('');
        fetchCategories();
      } else {
        setErrorMsg(data.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error("Error submitting category:", error);
      setErrorMsg(error.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (cat: Category) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  // Confirm Deletion execution via Axios
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    try {
      const data = await adminApi.deleteServiceCategory(categoryToDelete._id);
      if (data.success) {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        alert(data.message || 'Failed to delete category');
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || 'An error occurred while deleting.');
    } finally {
      setDeleting(false);
    }
  };

  // Open modal for Adding
  const openAddModal = () => {
    setModalMode('add');
    setCategoryName('');
    setCategoryDescription('');
    setSelectedCategory(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const openEditModal = (cat: Category) => {
    setModalMode('edit');
    setSelectedCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  return (
    <DashboardWrapper>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          <p className="text-xs font-semibold">Loading applications...</p>
        </div>
      }>
        <div className="space-y-6 text-slate-800">
          
          {/* PAGE TITLE / HEADER */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold tracking-wide uppercase text-primary">
              View and Manage Medical Services Categories
            </div>
          </div>

          {/* MAIN CONTAINER */}
          <div className="rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
            
            {/* SEARCH & ADD CATEGORY BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Category Name..." 
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 shadow-2xs"
                />
              </div>
              
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-secondary transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            {/* CATEGORIES GRID CONTAINER */}
            <div className="rounded-2xl bg-slate-100 p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
                  <p className="text-xs font-semibold">Loading service categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-semibold">
                  No service categories found. Click "Add Category" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const initial = cat.name ? cat.name.charAt(0).toUpperCase() : 'M';
                    return (
                      <div 
                        key={cat._id}
                        className="flex items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 p-4 shadow-2xs transition group hover:border-slate-400"
                      >
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-800 font-bold text-base flex-shrink-0">
                            {initial}
                          </div>
                          <div className="">
                            <h3 className="text-sm font-bold text-slate-900 truncate">{cat.name}</h3>
                            {cat.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{cat.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons for Edit & Delete */}
                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                          <button 
                            onClick={() => openEditModal(cat)}
                            title="Edit Category"
                            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(cat)}
                            title="Delete Category"
                            className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* ADD / EDIT MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-300">
                
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {modalMode === 'add' ? 'Add New Service Category' : 'Edit Service Category'}
                  </h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Category Name
                    </label>
                    <input 
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="e.g. Cardiology, Pediatrics..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-slate-500 shadow-2xs"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Description 
                    </label>
                    <textarea 
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="Brief description of the medical service category..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-slate-500 shadow-2xs resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-900 transition disabled:opacity-50 cursor-pointer"
                    >
                      {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {isDeleteModalOpen && categoryToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-300 text-center">
                
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-2xs">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  Delete Category?
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Are you sure you want to delete <strong className="text-slate-800">"{categoryToDelete.name}"</strong>? This action cannot be undone.
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setCategoryToDelete(null);
                    }}
                    className="flex-1 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    disabled={deleting}
                    onClick={confirmDelete}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Delete
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </Suspense>
    </DashboardWrapper>
  );
}