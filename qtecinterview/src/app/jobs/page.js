'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobCard from '../../components/jobs/JobCard';

function JobsSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get('category') || '';
  const initialTitle = searchParams.get('title') || '';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [filters, setFilters] = useState({
    title: initialTitle,
    category: initialCategory,
    type: '',
    location: ''
  });

  const CATEGORIES = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resource'];
  const TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.title) query.append('title', filters.title);
      if (filters.category) query.append('category', filters.category);
      if (filters.type) query.append('type', filters.type);
      if (filters.location) query.append('location', filters.location);

      const res = await fetch(`/api/jobs?${query.toString()}`);
      const json = await res.json();
      if (json.success) {
        setJobs(json.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[#F8F8FD] py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#25324B] mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Find your <span className="text-[#26A4FF]">dream job</span>
          </h1>
          <p className="text-[#515B6F] max-w-2xl mx-auto text-lg">
            Browse through thousands of job openings from top companies around the world.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-7xl py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h2 className="text-xl font-bold text-[#25324B] mb-6">Filter By</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#515B6F] mb-2">Search Keyword</label>
              <input 
                type="text" 
                name="title" 
                value={filters.title} 
                onChange={handleFilterChange} 
                placeholder="Job title..." 
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#515B6F] mb-2">Location</label>
              <input 
                type="text" 
                name="location" 
                value={filters.location} 
                onChange={handleFilterChange} 
                placeholder="City, country..." 
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#515B6F] mb-3">Category</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input type="radio" name="category" value="" checked={filters.category === ''} onChange={handleFilterChange} className="accent-primary w-4 h-4" />
                  All Categories
                </label>
                {CATEGORIES.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="radio" name="category" value={c} checked={filters.category === c} onChange={handleFilterChange} className="accent-primary w-4 h-4" />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#515B6F] mb-3">Job Type</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input type="radio" name="type" value="" checked={filters.type === ''} onChange={handleFilterChange} className="accent-primary w-4 h-4" />
                  All Types
                </label>
                {TYPES.map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="radio" name="type" value={t} checked={filters.type === t} onChange={handleFilterChange} className="accent-primary w-4 h-4" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setFilters({ title: '', category: '', type: '', location: '' })}
              className="w-full py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              Clear Filters
            </button>
          </aside>

          {/* Job List */}
          <div className="flex-1">
            <div className="mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#25324B]">Showing {jobs.length} jobs</h2>
            </div>
            
            {loading ? (
              <p className="text-gray-500 py-10">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <div className="py-20 text-center bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({ title: '', category: '', type: '', location: '' })}
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    companyLogo={job.companyProfile?.logo_url}
                    companyName={job.companyProfile?.name || 'Unknown'}
                    title={job.title}
                    location={job.location}
                    description={job.description}
                    tags={[job.type, ...(job.tags || [])].filter(Boolean)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search...</div>}>
        <JobsSearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
