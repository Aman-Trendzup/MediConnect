'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardWrapper } from '@/components/adminDashboardWrapper';
import { adminApi } from '@/services/adminApi';
import { 
  ArrowLeft, Loader2, CheckCircle2, XCircle, AlertCircle, Clock, 
  FileText, ExternalLink, MapPin, Phone, Mail, Building, 
  Calendar, Award, Stethoscope, DollarSign, AlertTriangle, X 
} from 'lucide-react';

interface ApplicationDetail {
  _id: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_correction';
  submittedAt: string;
  experienceYears?: number;
  consultationFee?: number;
  qualifications?: string[];
  verificationDocuments?: string[];
  rejectionReason?: string;
  correctionReason?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    status: string;
    phone?: string;
  };
  specialization?: {
    _id: string;
    name: string;
    description: string;
  };
  clinicAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function ApplicationDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Modal State for Reviews
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<'approved' | 'rejected' | 'needs_correction'>('approved');
  const [commentInput, setCommentInput] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchApplicationDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await adminApi.getApplicationById(id);
      if (data.success) {
        setApplication(data.data || data.application);
      }
    } catch (error: any) {
      console.error("Failed to fetch application details:", error);
      setFeedbackMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load application details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const openReviewModal = (status: 'approved' | 'rejected' | 'needs_correction') => {
    setTargetStatus(status);
    setCommentInput('');
    setIsModalOpen(true);
  };

  const handleConfirmReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    if ((targetStatus === 'rejected' || targetStatus === 'needs_correction') && !commentInput.trim()) {
      setFeedbackMessage({ 
        type: 'error', 
        text: targetStatus === 'rejected' ? 'Please provide a rejection reason.' : 'Please specify what information needs correction.' 
      });
      return;
    }

    setActionLoading(true);
    setFeedbackMessage(null);

    try {
      const payload: any = { status: targetStatus };

      if (targetStatus === 'rejected') {
        payload.rejectionReason = commentInput.trim();
      } else if (targetStatus === 'needs_correction') {
        payload.correctionReason = commentInput.trim();
      }

      const data = await adminApi.reviewDoctorApplication(application._id, payload);

      if (data.success) {
        setIsModalOpen(false);
        setFeedbackMessage({ type: 'success', text: `Application successfully ${targetStatus.replace('_', ' ')}.` });
        fetchApplicationDetails();
      } else {
        setFeedbackMessage({ type: 'error', text: data.message || 'Failed to update application status.' });
      }
    } catch (error: any) {
      setFeedbackMessage({ type: 'error', text: error.response?.data?.message || 'An unexpected error occurred during review.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        <p className="text-xs font-semibold">Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3 border border-dashed border-slate-300 rounded-2xl bg-white p-6">
        <p className="text-sm font-bold text-slate-800">Application not found</p>
        <p className="text-xs text-slate-400">The requested doctor application does not exist or has been removed.</p>
        <button 
          onClick={() => router.push('/admin/applications')}
          className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const doctorName = application.user?.name || 'Doctor Name';
  const doctorEmail = application.user?.email || 'No email provided';
  const doctorPhone = application.user?.phone || 'Not provided';
  const initial = doctorName.charAt(0).toUpperCase();
  const isApproved = application.status === 'approved';

  return (
    <div className="space-y-6 text-slate-800 max-w-5xl mx-auto pb-12">
      
      {/* BACK BUTTON & HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button 
          onClick={() => router.push('/admin/applications')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Applications
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Current Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
            application.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
            application.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
            application.status === 'needs_correction' ? 'bg-amber-100 text-amber-800' :
            'bg-slate-200 text-slate-700'
          }`}>
            {application.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedbackMessage && (
        <div className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-medium shadow-sm transition ${
          feedbackMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
        }`}>
          <span>{feedbackMessage.type === 'success' ? '✅' : '⚠️'}</span>
          <p>{feedbackMessage.text}</p>
        </div>
      )}

      {/* MAIN CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PROFILE OVERVIEW CARD */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-200">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-800 font-extrabold text-2xl flex-shrink-0 shadow-2xs">
                {initial}
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900">{doctorName}</h1>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {doctorEmail}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> {doctorPhone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Specialization</span>
                <p className="font-bold text-slate-900 text-sm">{application.specialization?.name || 'Not Specified'}</p>
                {application.specialization?.description && (
                  <p className="text-slate-500 text-[11px] mt-1">{application.specialization.description}</p>
                )}
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Experience & Fees</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                  <Award className="h-4 w-4 text-slate-500" /> {application.experienceYears ?? 0} Years Experience
                </p>
                <p className="font-bold text-emerald-700 text-sm flex items-center gap-1 mt-1">
                  ₹ {application.consultationFee ?? 0} Consultation Fee
                </p>
              </div>
            </div>

            {/* QUALIFICATIONS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {application.qualifications && application.qualifications.length > 0 ? (
                  application.qualifications.map((qual, idx) => (
                    <span key={idx} className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      {qual}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No qualifications listed.</p>
                )}
              </div>
            </div>

            {/* CLINIC ADDRESS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Clinic Address</h3>
              {application.clinicAddress ? (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-1.5 text-slate-700">
                  <p className="flex items-center gap-2 font-medium">
                    <Building className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span>{application.clinicAddress.street}</span>
                  </p>
                  <p className="flex items-center gap-2 pl-6 font-medium">
                    <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span>{application.clinicAddress.city}, {application.clinicAddress.state} — {application.clinicAddress.pincode}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No clinic address provided.</p>
              )}
            </div>
          </div>

          {/* VERIFICATION DOCUMENTS CARD */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" /> Verification Documents ({application.verificationDocuments?.length || 0})
            </h3>
            
            {application.verificationDocuments && application.verificationDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {application.verificationDocuments.map((docPath, index) => {
                  const fileUrl = docPath.startsWith('http') ? docPath : `/${docPath.replace(/\\/g, '/')}`;
                  const fileName = docPath.split('\\').pop()?.split('/').pop() || `Document ${index + 1}`;

                  return (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-slate-300">
                      <div className="flex items-center gap-3 truncate">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs flex-shrink-0">
                          PDF
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 truncate" title={fileName}>{fileName}</p>
                          <p className="text-[10px] text-slate-400">Verified Attachment</p>
                        </div>
                      </div>
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs flex-shrink-0 cursor-pointer"
                      >
                        <span>View</span> <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400">
                No verification documents uploaded for this application.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COL: REVIEW ACTIONS & TIMELINE */}
        <div className="space-y-6">
          
          {/* REVIEW ACTIONS CARD */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Review & Decision</h3>
            
            {isApproved ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Application Approved
                </p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  This doctor application has been successfully approved. Status modifications are locked.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review the submitted credentials and documents carefully before making a decision below.
                </p>

                <button 
                  onClick={() => openReviewModal('approved')}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve Application
                </button>

                <button 
                  onClick={() => openReviewModal('needs_correction')}
                  disabled={actionLoading || application.status === 'needs_correction'}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition cursor-pointer disabled:opacity-50"
                >
                  <AlertCircle className="h-4 w-4" /> Request Correction
                </button>

                <button 
                  onClick={() => openReviewModal('rejected')}
                  disabled={actionLoading || application.status === 'rejected'}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" /> Reject Application
                </button>
              </div>
            )}
          </div>

          {/* TIMELINE / METADATA CARD */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-4 text-xs">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Application Metadata</h3>
            
            <div className="space-y-3 text-slate-600">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-400">Submitted At</span>
                <span className="font-semibold text-slate-700">
                  {application.submittedAt ? new Date(application.submittedAt).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-400">Account Status</span>
                <span className="font-semibold uppercase text-slate-700">{application.user?.status || 'Unknown'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL FOR REVIEW ACTION COMMENTS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
                {targetStatus === 'approved' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                {targetStatus === 'needs_correction' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                {targetStatus === 'rejected' && <XCircle className="h-4 w-4 text-rose-600" />}
                
                {targetStatus === 'approved' && 'Confirm Approval'}
                {targetStatus === 'needs_correction' && 'Request Correction'}
                {targetStatus === 'rejected' && 'Reject Application'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReview} className="space-y-4">
              {targetStatus === 'approved' ? (
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to approve <strong>{doctorName}</strong>? Once approved, the doctor's account will be activated and review actions will be locked.
                </p>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    {targetStatus === 'rejected' ? 'Rejection Reason *' : 'Correction Instructions *'}
                  </label>
                  <textarea 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={targetStatus === 'rejected' ? 'Explain why this application is being rejected...' : 'Specify what needs correction...'}
                    rows={4}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-slate-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading} 
                  className={`rounded-xl px-5 py-2 text-xs font-bold text-white cursor-pointer flex items-center gap-1.5 ${
                    targetStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    targetStatus === 'needs_correction' ? 'bg-amber-600 hover:bg-amber-700' :
                    'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} 
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ApplicationDetailPage() {
  return (
    <DashboardWrapper>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          <p className="text-xs font-semibold">Loading application details...</p>
        </div>
      }>
        <ApplicationDetailContent />
      </Suspense>
    </DashboardWrapper>
  );
}