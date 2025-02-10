
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  MapPin, 
  CalendarDays, 
  ExternalLink, 
  Loader2, 
  Search,
  Filter,
  Award,
  Zap,
  Star,
  Code,
  Briefcase,
  Layers,
  AlertCircle,
  X,
  RefreshCcw,
  Building,
  GraduationCap,
  Clock,Play, StopCircle, Eye,
  
} from "lucide-react";

import ApplicationStats from "./ApplicationStats";

const API_BASE_URL = "http://localhost:8000";


// Toast Notification Component
const Toast = ({ message, type = "success", onClose }) => (
  <div className={`
    fixed bottom-4 right-4 z-50
    ${type === "success" ? "bg-green-900/80" : "bg-red-900/80"}
    text-white px-6 py-3 rounded-lg
    flex items-center space-x-3
    border border-${type === "success" ? "green" : "red"}-500/50
    shadow-lg
    animate-slide-up
    backdrop-blur-sm
  `}>
    {type === "success" ? (
      <Zap size={20} className="text-green-400" />
    ) : (
      <AlertCircle size={20} className="text-red-400" />
    )}
    <span className="font-medium">{message}</span>
    <button 
      onClick={onClose}
      className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors"
    >
      <X size={16} />
    </button>
  </div>
);

// Job Filters Component
const JobFilters = ({ 
  showFilters,
  sortOption,
  locationFilter,
  experienceFilter,
  setSortOption,
  setLocationFilter,
  setExperienceFilter,
  onClose 
}) => (
  <div className="
    bg-gray-900/95
    border border-purple-800/50 
    rounded-xl p-6 mt-4
    backdrop-blur-lg
    shadow-xl
    animate-slide-down
  ">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-purple-300 text-sm flex items-center space-x-2">
          <Clock size={14} />
          <span>Sort by</span>
        </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-purple-800/50
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="recent">Most Recent</option>
          <option value="featured">Featured Jobs</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="text-purple-300 text-sm flex items-center space-x-2">
          <MapPin size={14} />
          <span>Location</span>
        </label>
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by location..."
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-purple-800/50
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="text-purple-300 text-sm flex items-center space-x-2">
          <GraduationCap size={14} />
          <span>Experience Level</span>
        </label>
        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-purple-800/50
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Levels</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid-Level</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
        </select>
      </div>
    </div>
  </div>
);



// Background Pattern Component
const GraphicBackground = ({ type = 'circuit' }) => {
  const renderCircuitPattern = () => (
    <svg 
      className="absolute inset-0 w-full h-full opacity-10 text-purple-500" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 600"
    >
      <defs>
        <pattern id="circuitPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path 
            d="M0 40 Q20 30 40 40 T80 40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeOpacity="0.2"
          />
          <path 
            d="M0 40 Q20 50 40 40 T80 40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeOpacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuitPattern)" />
    </svg>
  );

  const renderNodePattern = () => (
    <svg 
      className="absolute inset-0 w-full h-full opacity-20 text-purple-500" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 600"
    >
      {[...Array(50)].map((_, i) => (
        <React.Fragment key={i}>
          <circle 
            cx={Math.random() * 800} 
            cy={Math.random() * 600} 
            r={Math.random() * 3} 
            fill="currentColor" 
            opacity="0.3"
          />
          {Math.random() > 0.7 && (
            <line 
              x1={Math.random() * 800} 
              y1={Math.random() * 600} 
              x2={Math.random() * 800} 
              y2={Math.random() * 600} 
              stroke="currentColor" 
              strokeWidth="0.5" 
              opacity="0.1"
            />
          )}
        </React.Fragment>
      ))}
    </svg>
  );

  return type === 'circuit' ? renderCircuitPattern() : renderNodePattern();
};

// Badge Component
const NeonBadge = ({ children, variant = "purple", className = "" }) => {
  const variantStyles = {
    purple: "bg-purple-900/30 text-purple-200 border border-purple-600/50 hover:bg-purple-900/50",
    green: "bg-green-900/30 text-green-200 border border-green-600/50 hover:bg-green-900/50",
    blue: "bg-blue-900/30 text-blue-200 border border-blue-600/50 hover:bg-blue-900/50",
    orange: "bg-orange-900/30 text-orange-200 border border-orange-600/50 hover:bg-orange-900/50"
  };

  return (
    <span className={`
      px-2 py-1 text-xs rounded-full 
      transition-all duration-300 
      ${variantStyles[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

// Job Card Component
const JobCard = ({ job, onJobClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getJobAgeLabel = (publishDate) => {
    const jobDate = new Date(publishDate);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - jobDate) / (1000 * 60 * 60 * 24));

    if (daysDifference < 3) return "New";
    if (daysDifference > 15) return "Old";
    return null;
  };

  const jobAgeLabel = getJobAgeLabel(job.publish_date);

  const handleJobClick = () => {
    onJobClick(job.link);
    window.open(job.link, '_blank');
  };

  const getExperienceBadgeColor = (experience) => {
    if (!experience) return "purple";
    const exp = experience.toLowerCase();
    if (exp.includes("junior") || exp.includes("0-2")) return "green";
    if (exp.includes("mid") || exp.includes("2-5")) return "blue";
    if (exp.includes("senior") || exp.includes("5+")) return "orange";
    return "purple";
  };

  const getApplicationStatusBadge = () => {
    if (job.application_success === true) {
      return <NeonBadge variant="green">
        <Zap size={12} className="inline mr-1" />
        Applied Successfully
      </NeonBadge>;
    } else if (job.application_success === false) {
      return <NeonBadge variant="orange">
        <AlertCircle size={12} className="inline mr-1" />
        Application Failed
      </NeonBadge>;
    } else if (job.application_attempts > 0) {
      return <NeonBadge variant="blue">
        <RefreshCcw size={12} className="inline mr-1" />
        Attempts: {job.application_attempts}
      </NeonBadge>;
    }
    return null;
  };

  return (
    <div 
      className="group relative transform transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-gray-900 to-gray-800
        border border-transparent transition-all duration-300
        ${isHovered ? 'shadow-2xl border-purple-600/50 hover:shadow-purple-500/30' : 'shadow-lg'}
      `}>
        <GraphicBackground type={isHovered ? 'nodes' : 'circuit'} />

        <div className={`
          absolute inset-0 bg-purple-500/10 opacity-0 
          group-hover:opacity-100 transition-opacity duration-500 
          pointer-events-none blur-3xl
        `} />

        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              <button
                onClick={handleJobClick}
                className="text-xl font-bold text-purple-300 hover:text-purple-200 
                         transition-colors flex items-center space-x-2"
              >
                <span>{job.title}</span>
                {job.is_featured && (
                  <Star size={20} className="text-yellow-400 animate-pulse" />
                )}
              </button>

              <div className="flex items-center space-x-2 mt-2 text-gray-400">
                <Building size={16} />
                <span className="text-sm">{job.company || 'Company not specified'}</span>
              </div>
            </div>

            <button
              onClick={handleJobClick}
              className="text-purple-500 hover:text-purple-300 transition-colors hover:scale-110"
            >
              <ExternalLink size={22} />
            </button>
          </div>

          <p className="text-gray-300 mb-4 line-clamp-3 opacity-90">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin size={18} className="text-purple-500" />
              <span className="text-sm">{job.location || 'Location not specified'}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-400">
              <CalendarDays size={18} className="text-purple-600" />
              <span className="text-sm">{job.publish_date}</span>
            </div>

            {jobAgeLabel === "New" && (
              <NeonBadge variant="green">
                <Zap size={12} className="inline mr-1" />New
              </NeonBadge>
            )}
            
            {job.is_clicked && (
              <NeonBadge variant="purple">
                <Eye size={12} className="inline mr-1" />
                Viewed
              </NeonBadge>
            )}
            
            {job.experience && (
              <NeonBadge variant={getExperienceBadgeColor(job.experience)}>
                <Briefcase size={12} className="inline mr-1" />
                {job.experience}
              </NeonBadge>
            )}

            {getApplicationStatusBadge()}

            {job.last_application_date && (
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock size={18} className="text-purple-600" />
                <span className="text-sm">
                  Last attempt: {new Date(job.last_application_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main JobList Component
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [automationStatus, setAutomationStatus] = useState("stopped");
  const [appliedCount, setAppliedCount] = useState(0);
  const [stats, setStats] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };


  const startAutomation = async () => {
    try {
      await axios.post(`${API_BASE_URL}/start-automation`);
      showNotification("Job application automation started");
      checkAutomationStatus();
    } catch (error) {
      showNotification("Failed to start automation", "error");
    }
  };

  const stopAutomation = async () => {
    try {
      await axios.post(`${API_BASE_URL}/stop-automation`);
      showNotification("Job application automation stopped");
      setAutomationStatus("stopped");
    } catch (error) {
      showNotification("Failed to stop automation", "error");
    }
  };

  const checkAutomationStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/automation-status`);
      setAutomationStatus(response.data.status);
      setStats(response.data.stats);
      setAppliedCount(response.data.applied_count);
    } catch (error) {
      console.error("Failed to check automation status:", error);
    }
  };

  useEffect(() => {
    const statusInterval = setInterval(checkAutomationStatus, 30000);
    return () => clearInterval(statusInterval);
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      showNotification("Failed to fetch jobs. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    try {
      setRefreshing(true);
      await axios.get(`${API_BASE_URL}/update-jobs`);
      await fetchJobs();
      showNotification("Jobs updated successfully!");
    } catch (error) {
      showNotification("Failed to update jobs. Please try again.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleJobClick = async (jobLink) => {
    try {
      await axios.post(`${API_BASE_URL}/mark-job-clicked`, { link: jobLink });
      await fetchJobs();
    } catch (error) {
      console.error("Error marking job as clicked:", error);
    }
  };

  const sortJobs = useCallback((jobsToSort) => {
    switch(sortOption) {
      case 'featured':
        return [...jobsToSort].sort((a, b) => b.is_featured - a.is_featured);
      case 'oldest':
        return [...jobsToSort].sort((a, b) => 
          new Date(a.publish_date) - new Date(b.publish_date)
        );default: // 'recent'
        return [...jobsToSort].sort((a, b) => 
          new Date(b.publish_date) - new Date(a.publish_date)
        );
    }
  }, [sortOption]);

  const filterJobs = useCallback(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !locationFilter || 
        job.location?.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesExperience = !experienceFilter || 
        job.experience?.toLowerCase().includes(experienceFilter.toLowerCase());

      return matchesSearch && matchesLocation && matchesExperience;
    });

    // Apply sorting
    filtered = sortJobs(filtered);
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, experienceFilter, sortJobs]);

  // Effect for filtering
  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchJobs();
    // Set up periodic refresh every 30 minutes
    const interval = setInterval(fetchJobs, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-500/10 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
  
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 animate-pulse">
            Software Developer Jobs
          </h1>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <div className="relative w-full">
                <input 
                  type="text"
                  placeholder="Search jobs by title, description, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-900/90 border border-purple-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300 hover:border-purple-600 backdrop-blur-sm"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              </div>
  
              <button 
                onClick={refreshJobs}
                disabled={refreshing}
                className={`flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl transition-all duration-300 ${refreshing ? 'opacity-75 cursor-not-allowed' : ''} min-w-[120px] justify-center backdrop-blur-sm`}
              >
                <RefreshCcw size={20} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
  
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-12 h-12 flex items-center justify-center bg-gray-900/90 border border-purple-800/50 rounded-xl hover:bg-purple-900/50 transition-colors group backdrop-blur-sm"
              >
                <Filter size={20} className="text-purple-400 group-hover:text-purple-300" />
              </button>
            </div>
  
            {showFilters && (
              <JobFilters
                showFilters={showFilters}
                sortOption={sortOption}
                locationFilter={locationFilter}
                experienceFilter={experienceFilter}
                setSortOption={setSortOption}
                setLocationFilter={setLocationFilter}
                setExperienceFilter={setExperienceFilter}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>
  
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={automationStatus === "running" ? stopAutomation : startAutomation}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl
                transition-all duration-300 backdrop-blur-sm
                ${automationStatus === "running" 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-green-600 hover:bg-green-700"
                }
              `}
            >
              {automationStatus === "running" ? (
                <>
                  <StopCircle size={20} />
                  <span>Stop Auto-Apply</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Start Auto-Apply</span>
                </>
              )}
            </button>
            
            {automationStatus === "running" && (
              <div className="text-purple-400">
                <span className="font-semibold">{appliedCount}</span> jobs applied
              </div>
            )}
          </div>
        </div>

        {automationStatus === "running" && stats && (
          <div className="mt-8 mb-12">
            <h2 className="text-2xl font-semibold text-purple-400 mb-6">Application Statistics</h2>
            <ApplicationStats stats={stats} />
          </div>
        )}
  
        <div className="mb-6 text-center">
          <p className="text-gray-400">
            Found {filteredJobs.length} jobs matching your criteria
          </p>
        </div>
  
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 size={48} className="animate-spin text-purple-500" />
            <p className="text-purple-400 animate-pulse">Fetching latest jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center bg-gray-900/90 border border-purple-800/50 p-8 rounded-xl backdrop-blur-sm">
            <AlertCircle size={48} className="mx-auto mb-4 text-purple-400" />
            <p className="text-xl text-purple-400 mb-2">No jobs found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard 
                key={job.link || index} 
                job={job} 
                onJobClick={handleJobClick} 
              />
            ))}
          </div>
        )}
      </div>
  
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

export default JobList;