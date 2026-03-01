'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import JobCard from '../../../components/jobs/JobCard';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Badge from '../../../components/ui/Badge';
import { userAuthAPI, applicationsAPI, jobsAPI } from '../../../lib/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application form state
  const [appLoading, setAppLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.all([
          jobsAPI.get(id),
          userAuthAPI.getMe().catch(() => ({ success: false }))
        ]);

        if (jobRes.success) {
          setJob(jobRes.data);
          setSuggestedJobs(jobRes.suggested || []);
        }
        if (userRes.success) {
          setUser(userRes.data);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchData();
  }, [id]);

  const handleApply = async () => {
    const result = await Swal.fire({
      title: 'Apply for this job?',
      text: "Your profile information and CV will be shared with the employer.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4640DE',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, apply now!'
    });

    if (!result.isConfirmed) return;

    setAppLoading(true);
    try {
      const json = await applicationsAPI.create(parseInt(id));
      if (json.success) {
        setJob(prev => ({ ...prev, is_applied: true }));
        Swal.fire({
          title: 'Success!',
          text: 'Application submitted successfully! The company will review your profile.',
          icon: 'success',
          confirmButtonColor: '#4640DE',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: json.error || 'Failed to submit',
          icon: 'error',
          confirmButtonColor: '#4640DE',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.data?.error || 'Network error occurred.',
        icon: 'error',
        confirmButtonColor: '#4640DE',
      });
    } finally {
      setAppLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!job) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Job not found</h1>
      <Link href="/jobs" className="text-primary font-semibold hover:underline">Return to job search</Link>
    </div>
  );

  const company = job.companyProfile || {};

  return (
    <div className="min-h-screen bg-[#F8F8FD] font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Job Detail */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-3xl font-bold text-gray-300">{(company.name || 'C').charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#25324B] mb-2 leading-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>{job.title}</h1>
                  <p className="text-[#7C8493] flex items-center gap-2 font-medium">
                    <span className="text-[#25324B] font-semibold">{company.name || 'Unknown Company'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-8">
                <Badge variant="primary" className="bg-emerald-50 text-emerald-600 border-none px-4 rounded-full uppercase text-[11px] font-bold tracking-wider">{job.type}</Badge>
                <div className="h-6 w-px bg-gray-100 mx-1 self-center"></div>
                <Badge variant="design" className="bg-blue-50 text-blue-600 border-none px-4 rounded-full uppercase text-[11px] font-bold tracking-wider">{job.category}</Badge>
                {job.tags && job.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-semibold">#{t}</span>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-[#25324B] mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>Description</h2>
                <div className="text-[#515B6F] leading-relaxed whitespace-pre-wrap text-base">
                  {job.description}
                </div>
              </div>

              {company.description && (
                <div className="border-t border-gray-50 pt-8 mt-8">
                  <h2 className="text-2xl font-bold text-[#25324B] mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>About the Company</h2>
                  <div className="text-[#515B6F] leading-relaxed text-base">
                    {company.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-[#25324B] mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>Apply for this job</h3>
              
              <div className="space-y-6">
                {!user ? (
                  <div className="text-center p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                    <p className="text-sm text-[#515B6F] mb-6 leading-relaxed">Join thousands of job seekers and apply with just one click.</p>
                    <Link href="/login" className="block w-full py-4 bg-[#4640DE] text-white text-center rounded-xl font-bold shadow-lg shadow-blue-700/20 hover:scale-[1.02] transition-all">
                      Log In to Apply
                    </Link>
                    <p className="mt-4 text-xs text-[#7C8493]">Don't have an account? <Link href="/register" className="text-[#4640DE] font-semibold">Sign up</Link></p>
                  </div>
                ) : !user.is_profile_complete ? (
                  <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <p className="text-sm text-orange-800 mb-6 leading-relaxed">Your profile is missing a CV or Avatar. Complete it to unlock 1-click apply.</p>
                    <Link href="/dashboard" className="block w-full py-4 bg-orange-500 text-white text-center rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all">
                      Complete Profile
                    </Link>
                  </div>
                ) : job.is_applied ? (
                   <div className="text-center space-y-4">
                     <div className="py-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex flex-col items-center gap-2">
                        <span className="text-2xl">✓</span>
                        <span className="font-bold tracking-tight">APPLICATION SUBMITTED</span>
                     </div>
                     <Link href="/dashboard" className="block w-full py-4 bg-white text-[#25324B] border border-gray-200 text-center rounded-xl font-bold hover:bg-gray-50 transition-all">
                       View Application Status
                     </Link>
                   </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <span className="text-blue-500 text-lg">💡</span>
                      <p className="text-[13px] text-blue-700 leading-snug">We'll use your verified profile and CV to submit this application instantly.</p>
                    </div>
                    <button 
                      onClick={handleApply} 
                      disabled={appLoading} 
                      className="w-full py-4 bg-[#4640DE] text-white rounded-xl font-bold shadow-lg shadow-blue-700/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {appLoading ? 'Submitting...' : 'Apply Now (1-Click)'}
                    </button>
                    <p className="text-center text-[11px] text-[#7C8493] mt-4">By applying, you agree to our Terms of Service.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Jobs */}
        {suggestedJobs.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-[#25324B]" style={{ fontFamily: "'Clash Display', sans-serif" }}>Similar <span className="text-[#4640DE]">Jobs</span></h2>
              <Link href="/jobs" className="text-[#4640DE] font-bold text-sm flex items-center gap-2 hover:underline">
                Browse all jobs ➔
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedJobs.map(sj => (
                <JobCard
                  key={sj.id}
                  id={sj.id}
                  companyLogo={sj.companyProfile?.logo_url}
                  companyName={sj.companyProfile?.name || 'Unknown'}
                  title={sj.title}
                  location={sj.location}
                  type={sj.type}
                  tags={sj.tags}
                  isApplied={false}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
