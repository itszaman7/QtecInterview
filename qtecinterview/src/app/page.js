import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/jobs/HeroSection";
import CategoryCard from "../components/jobs/CategoryCard";
import JobCard from "../components/jobs/JobCard";
import LatestJobCard from "../components/jobs/LatestJobCard";
import DashboardBanner from "../components/jobs/DashboardBanner";
import CompaniesStrip from "../components/jobs/CompaniesStrip";

// Category Icons
const DesignIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.884a1.128 1.128 0 00-1.59-1.59l-5.884 3.876a15.995 15.995 0 00-4.648 4.764" />
  </svg>
);

const SalesIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const MarketingIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
  </svg>
);

const FinanceIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const TechnologyIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const EngineeringIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const BusinessIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const HrIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

// Arrow icon for "Show all jobs"
const ArrowRight = () => (
  <svg className="w-4 h-4 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default async function Home() {
  // Fetch actual data from backend API
  let jobs = [];
  try {
    // Next.js Server Component running in Node can reach localhost:5000
    const res = await fetch('http://localhost:5000/api/jobs', { cache: 'no-store' });
    const json = await res.json();
    if (json.success) jobs = json.data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }

  const categoryCounts = jobs.reduce((acc, job) => {
    if (job.category) acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    { title: 'Design', jobCount: categoryCounts['Design'] || 0, icon: DesignIcon },
    { title: 'Sales', jobCount: categoryCounts['Sales'] || 0, icon: SalesIcon },
    { title: 'Marketing', jobCount: categoryCounts['Marketing'] || 0, icon: MarketingIcon },
    { title: 'Finance', jobCount: categoryCounts['Finance'] || 0, icon: FinanceIcon },
    { title: 'Technology', jobCount: categoryCounts['Technology'] || 0, icon: TechnologyIcon },
    { title: 'Engineering', jobCount: categoryCounts['Engineering'] || 0, icon: EngineeringIcon },
    { title: 'Business', jobCount: categoryCounts['Business'] || 0, icon: BusinessIcon },
    { title: 'Human Resource', jobCount: categoryCounts['Human Resource'] || 0, icon: HrIcon },
  ];

  // Map real jobs to Featured and Latest arrays
  const featuredJobs = jobs.filter(j => j.is_featured).slice(0, 8).map(job => ({
    id: job.id,
    companyLogo: job.companyProfile?.logo_url || null,
    companyName: job.companyProfile?.name || 'Unknown',
    title: job.title,
    location: job.location || 'Remote',
    description: job.description,
    tags: job.tags || []
  }));

  const latestJobs = jobs.slice(0, 8).map(job => ({
    id: job.id,
    companyLogo: job.companyProfile?.logo_url || null,
    companyName: job.companyProfile?.name || 'Unknown',
    title: job.title,
    location: job.location || 'Remote',
    tags: [job.type, ...(job.tags || [])].filter(Boolean)
  }));

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Companies we helped grow */}
      <CompaniesStrip />

      {/* Explore by Category */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl lg:text-[48px] font-semibold tracking-tight text-[#25324B]" style={{ fontFamily: "'Clash Display', 'Epilogue', sans-serif", lineHeight: '110%' }}>
              Explore by <span className="text-accent-blue">category</span>
            </h2>
            <a href="#" className="text-accent-blue font-medium text-sm hover:underline hidden sm:inline-flex items-center">
              Show all jobs <ArrowRight />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard
                key={i}
                title={cat.title}
                jobCount={cat.jobCount}
                icon={cat.icon}
                isActive={cat.isActive}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Banner */}
      <DashboardBanner />

      {/* Featured Jobs */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl lg:text-[48px] font-semibold tracking-tight text-[#25324B]" style={{ fontFamily: "'Clash Display', 'Epilogue', sans-serif", lineHeight: '110%' }}>
              Featured <span className="text-accent-blue">jobs</span>
            </h2>
            <a href="#" className="text-accent-blue font-medium text-sm hover:underline hidden sm:inline-flex items-center">
              Show all jobs <ArrowRight />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map((job, i) => (
              <JobCard
                key={job.id || i}
                id={job.id}
                companyLogo={job.companyLogo}
                companyName={job.companyName}
                title={job.title}
                location={job.location}
                description={job.description}
                tags={job.tags}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs Open */}
      <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-0 w-64 h-64 border border-primary/10 transform rotate-45 -translate-x-20 pointer-events-none"></div>
        <div className="absolute bottom-10 left-0 w-48 h-48 border border-primary/10 transform rotate-45 translate-x-10 pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl lg:text-[48px] font-semibold tracking-tight text-[#25324B]" style={{ fontFamily: "'Clash Display', 'Epilogue', sans-serif", lineHeight: '110%' }}>
              Latest <span className="text-accent-blue">jobs open</span>
            </h2>
            <a href="#" className="text-accent-blue font-medium text-sm hover:underline hidden sm:inline-flex items-center">
              Show all jobs <ArrowRight />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestJobs.map((job, i) => (
              <LatestJobCard
                key={job.id || i}
                id={job.id}
                companyLogo={job.companyLogo}
                companyName={job.companyName}
                title={job.title}
                location={job.location}
                tags={job.tags}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
