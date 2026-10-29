'use client';

import React, { useState, useEffect,Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { adminApi } from '@/services/adminApi'; // 👈 Import your Axios API layer
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Trash2, 
  UserCheck,
  UserX,
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  status: 'active' | 'pending' | 'blocked' | 'inactive';
  createdAt?: string;
}

export default function UserManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read role and search query from URL parameters
  const roleQuery = searchParams.get('role') || 'doctor';
  const searchQuery = searchParams.get('search') || '';
  const isDoctor = roleQuery === 'doctor';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch users from backend API using Axios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { role: roleQuery };
      if (searchQuery) params.search = searchQuery;

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
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [roleQuery, searchQuery]);

  // Update URL query parameters cleanly
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
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

  // Handle Status Toggle (Active <-> Blocked)
  const handleStatusChange = async (userId: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (!confirm(`Are you sure you want to change status for "${name}" to ${newStatus}?`)) return;

    setActionLoadingId(userId);
    try {
      const data = await adminApi.updateUserStatus(userId, { status: newStatus });
      if (data.success) {
        fetchUsers(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      alert(error.response?.data?.message || 'An error occurred while updating status.');
    } finally {
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
  const subtitle = isDoctor 
    ? 'Search and manage registered doctor accounts.' 
    : 'Search and manage registered patient accounts.';
  const activeLabel = isDoctor ? 'Active Doctors' : 'Active Patients';
  const pendingLabel = isDoctor ? 'Pending / Blocked' : 'Inactive / Blocked';
  const searchPlaceholder = isDoctor 
    ? 'Search by doctor name or email...' 
    : 'Search by patient name or email...';

  const activeCount = users.filter(u => u.status === 'active').length;
  const pendingCount = users.filter(u => u.status === 'pending' || u.status === 'blocked' || u.status === 'inactive').length;

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
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-200/70 px-4 py-2 text-sm font-bold tracking-wide uppercase text-slate-700 shadow-2xs">
            {title}
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-900 uppercase">{activeLabel}</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-700">{activeCount}</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-amber-900 uppercase">{pendingLabel}</span>
              </div>
              <span className="text-xl font-extrabold text-amber-600">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchPlaceholder} 
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 shadow-2xs"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
                Total {users.length} {isDoctor ? 'Doctors' : 'Patients'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                
                <div className="grid grid-cols-6 bg-slate-200/70 rounded-xl p-3 text-xs font-bold text-slate-700 text-center mb-3">
                  <span>User ID</span>
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
                    No registered {isDoctor ? 'doctors' : 'patients'} found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {users.map((user, index) => {
                      const regDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
                      const status = user.status || 'active';
                      const shortId = `#${user._id.slice(-6).toUpperCase()}`;
                      const isUpdating = actionLoadingId === user._id;

                      return (
                        <div 
                          key={user._id || index}
                          className="grid grid-cols-6 items-center h-12 w-full rounded-xl bg-slate-100 border border-slate-200 px-3 text-xs font-medium text-slate-700 text-center"
                        >
                          <span className="font-bold text-slate-900">{shortId}</span>
                          <span className="font-semibold text-slate-900 truncate px-1">{user.name}</span>
                          <span className="text-slate-500 truncate px-1">{user.email}</span>
                          <span className="text-slate-600">{regDate}</span>
                          <div>
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                              status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {status}
                            </span>
                          </div>

                          {/* Action Buttons: View Profile, Toggle Status, Delete */}
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => router.push(`/admin/users/${user._id}`)}
                              title="View Profile"
                              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Status Toggle Button */}
                            <button 
                              onClick={() => handleStatusChange(user._id, status, user.name)}
                              disabled={isUpdating}
                              title={status === 'active' ? 'Block User' : 'Activate User'}
                              className={`p-1.5 rounded-lg border transition shadow-2xs ${
                                status === 'active' 
                                  ? 'border-amber-200 bg-white text-amber-600 hover:bg-amber-600 hover:text-white' 
                                  : 'border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : status === 'active' ? (
                                <UserX className="h-3.5 w-3.5" />
                              ) : (
                                <UserCheck className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <button 
                              onClick={() => handleDelete(user._id, user.name)}
                              title="Delete User"
                              className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-2xs"
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

      </div>
      </Suspense>
    </DashboardWrapper>
  );
}