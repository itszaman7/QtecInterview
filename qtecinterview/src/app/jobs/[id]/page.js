'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Badge from '../../../components/ui/Badge';
import { userAuthAPI, applicationsAPI } from '../../../lib/api';
import Link from 'next/link';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application form state
  const [appStatus, setAppStatus] = useState(null);
  const [appLoading, setAppLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs/${id}`).then(res => res.json()),
      userAuthAPI.getMe().catch(() => ({ success: false })) // fail silently if not logged in
    ]).then(([jobJson, userRes]) => {
      if (jobJson.success) setJob(jobJson.data);
      if (userRes.success) setUser(userRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setAppLoading(true);
    setAppStatus(null);
    try {
      const json = await applicationsAPI.create(parseInt(id));
      if (json.success) {
        setAppStatus({ type: 'success', message: 'Application submitted successfully! The company will review your profile and CV.' });
      } else {
        setAppStatus({ type: 'error', message: json.error || 'Failed to submit' });
      }
    } catch (error) {
      setAppStatus({ type: 'error', message: error.data?.error || 'Network error occurred.' });
    } finally {
      setAppLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-red-500">Job not found.</div>;

  const company = job.companyProfile || {};

  return (
    <div className="min-h-screen bg-[#F8F8FD] font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 max-w-6xl py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Job Detail */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{(company.name || 'C').charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#25324B] mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>{job.title}</h1>
                  <p className="text-gray-500 flex items-center gap-2">
                    {company.name || 'Unknown Company'}
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="full-time">{job.type}</Badge>
                <Badge variant="design">{job.category}</Badge>
                {job.tags && job.tags.map(t => <Badge key={t} variant="outline">#{t}</Badge>)}
              </div>

              <h2 className="text-xl font-bold text-[#25324B] mb-4">Description</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
                {job.description}
              </div>

              {company.description && (
                <>
                  <h2 className="text-xl font-bold text-[#25324B] mb-4">About the Company</h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {company.description}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar / Apply Application */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-[#25324B] mb-6">Apply for this job</h3>
              
              {appStatus && (
                <div className={`p-4 rounded-lg mb-6 ${appStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} text-sm`}>
                  {appStatus.message}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {!user ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">You need an applicant account to apply for this job.</p>
                    <Link href="/login" className="block w-full py-3.5 bg-primary text-white text-center rounded-lg font-bold hover:bg-blue-700 transition-colors">
                      Log In to Apply
                    </Link>
                  </div>
                ) : !user.is_profile_complete ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Your profile is incomplete. Please upload your CV and Profile Picture to apply.</p>
                    <Link href="/dashboard" className="block w-full py-3.5 bg-orange-500 text-white text-center rounded-lg font-bold hover:bg-orange-600 transition-colors">
                      Complete Profile to Apply
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4 text-center">Your saved CV and Profile will be sent to the employer.</p>
                    <button onClick={handleApply} disabled={appLoading || appStatus?.type === 'success'} className="w-full py-3.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                      {appLoading ? 'Submitting...' : appStatus?.type === 'success' ? 'Applied ✓' : 'Apply Now (1-Click)'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
