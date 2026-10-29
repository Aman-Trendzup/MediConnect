'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { adminApi } from '@/services/adminApi'; 
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Trash2, 
  UserCog,
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle,
  XCircle,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  status: 'active' | 'pending' | 'blocked' | 'inactive' | 'suspended';
  createdAt?: string;
}

//  Inner component handling all state, hooks, and UI markup
function UserManagementContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read role, search query, and status filter from URL parameters
  const roleQuery = searchParams.get('role') || 'doctor';
  const searchQuery = searchParams.get('search') || '';
  const statusQuery = searchParams.get('status') || 'all';
  const isDoctor = roleQuery === 'doctor';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Status Modal States
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newStatusInput, setNewStatusInput] = useState<string>('active');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Fetch users from backend API using Axios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { role: roleQuery };
      if (searchQuery) params.search = searchQuery;
      if (statusQuery && statusQuery !== 'all') params.status = statusQuery;

      const data = await adminApi.getUsers(params);
      
      if (data.success) {
        setUsers(data.users || data.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch users:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleQuery, searchQuery, statusQuery]);

  // Update URL query parameters cleanly
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateQueryParam('search', searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Open Status Change Modal
  const openStatusModal = (user: User) => {
    setSelectedUser(user);
    setNewStatusInput(user.status || 'active');
    setIsStatusModalOpen(true);
  };

  // Confirm Status Update
  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUpdatingStatus(true);
    setActionLoadingId(selectedUser._id);

    try {
      const data = await adminApi.updateUserStatus(selectedUser._id, { status: newStatusInput });
      if (data.success) {
        setIsStatusModalOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      alert(error.response?.data?.message || 'An error occurred while updating status.');
    } finally {
      setUpdatingStatus(false);
      setActionLoadingId(null);
    }
  };

  // Handle Delete User
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      const data = await adminApi.deleteUser(id);
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || 'An error occurred while deleting.');
    }
  };

  const title = isDoctor ? 'View and Manage Registered Doctors' : 'View and Manage Registered Patients';
  const searchPlaceholder = isDoctor 
    ? 'Search by doctor name or email...' 
    : 'Search by patient name or email...';

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* PAGE TITLE / HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-200/70 px-4 py-2 text-sm font-bold tracking-wide uppercase text-slate-700 shadow-2xs">
          {title}
        </div>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
        
        {/* SEARCH & STATUS FILTER TABS BAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={searchPlaceholder} 
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 shadow-2xs"
            />
          </div>
          
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All', value: 'all', icon: null },
              { label: 'Active', value: 'active', icon: CheckCircle2 },
              { label: 'Inactive', value: 'inactive', icon: Clock },
              { label: 'Blocked', value: 'blocked', icon: XCircle },
              { label: 'Suspended', value: 'suspended', icon: AlertCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = statusQuery === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => updateQueryParam('status', tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white border border-primary' 
                      : 'bg-white text-primary border border-primary hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* TABLE SECTION */}
        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Table Header */}
              <div className="grid grid-cols-5 bg-slate-200/70 rounded-xl p-3 text-xs font-bold text-slate-700 text-center mb-3">
                <span>{isDoctor ? 'Doctor Name' : 'Patient Name'}</span>
                <span>Email Id</span>
                <span>Registration Date</span>
                <span>Account Status</span>
                <span>Actions</span>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
                  <p className="text-xs font-semibold">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-semibold">
                  No registered {isDoctor ? 'doctors' : 'patients'} found matching this status.
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user, index) => {
                    const regDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
                    const status = user.status || 'active';
                    const isUpdating = actionLoadingId === user._id;

                    return (
                      <div 
                        key={user._id || index}
                        className="grid grid-cols-5 items-center h-12 w-full rounded-xl bg-slate-100 border border-slate-200 px-3 text-xs font-medium text-slate-700 text-center"
                      >
                        <span className="font-semibold text-slate-900 truncate px-1">{user.name}</span>
                        <span className="text-slate-500 truncate px-1">{user.email}</span>
                        <span className="text-slate-600">{regDate}</span>
                        <div>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'inactive' ? 'bg-slate-200 text-slate-700' :
                            status === 'blocked' ? 'bg-rose-100 text-rose-800' :
                            status === 'suspended' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {status}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            title="View Profile"
                            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Status Change Modal Button */}
                          <button 
                            onClick={() => openStatusModal(user)}
                            disabled={isUpdating}
                            title="Change User Status"
                            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "change status"}
                          </button>

                          <button 
                            onClick={() => handleDelete(user._id, user.name)}
                            title="Delete User"
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
        </div>

        {/* FOOTER COUNT & PAGINATION */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-300 pt-4">
          <div className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
            Showing total {users.length} {isDoctor ? 'Doctors' : 'Patients'}
          </div>

          <div className="flex items-center gap-1">
            <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-800 text-white text-xs font-bold">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition">
              3
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* STATUS CHANGE MODAL */}
      {isStatusModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-300">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <UserCog className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                  Change User Status
                </h3>
              </div>
              <button 
                onClick={() => setIsStatusModalOpen(false)} 
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Update account status for user <strong className="text-slate-800">{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <form onSubmit={handleConfirmStatusChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select New Status *
                </label>
                <select 
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-slate-500 shadow-2xs cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsStatusModalOpen(false)} 
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updatingStatus}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-900 transition disabled:opacity-50 cursor-pointer"
                >
                  {updatingStatus && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Status Change
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// Default exported page component that wraps the content in <Suspense>
export default function UserManagementPage() {
  return (
    <DashboardWrapper>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          <p className="text-xs font-semibold">Loading users...</p>
        </div>
      }>
        <UserManagementContent />
      </Suspense>
    </DashboardWrapper>
  );
}