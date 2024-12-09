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
  Star
} from "lucide-react";

const JobBadge = ({ children, className = "" }) => (
  <span className={`px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300 ${className}`}>
    {children}
  </span>
);

const JobCard = ({ job, onJobClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getJobAgeLabel = (publishDate) => {
    const jobDate = new Date(publishDate);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - jobDate) / (1000 * 60 * 60 * 24));

    if (daysDifference < 3) {
      return "New";
    } else if (daysDifference > 15) {
      return "Old";
    }
    return null;
  };

  const jobAgeLabel = getJobAgeLabel(job.publish_date);

  const handleJobClick = () => {
    onJobClick(job.link);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gray-900 border border-purple-800 rounded-xl p-4 sm:p-6 overflow-hidden transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 relative z-10">
          <div className="w-full mb-2 sm:mb-0 sm:pr-4">
            <a 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={handleJobClick}
              className="text-lg sm:text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-2"
            >
              <span>{job.title}</span>
              {job.is_featured && (
                <Award size={18} className="text-yellow-500" title="Featured Job" />
              )}
            </a>
          </div>
          <a 
            href={job.link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleJobClick}
            className="text-gray-500 hover:text-purple-400 transition-colors self-end"
          >
            <ExternalLink size={20} />
          </a>
        </div>
        
        <p className="text-sm sm:text-base text-gray-300 mb-4 line-clamp-3 opacity-90 relative z-10">
          {job.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-400 space-y-2 sm:space-y-0 sm:space-x-4 relative z-10">
          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-purple-500" />
              <span className="text-xs sm:text-sm">{job.location || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays size={16} className="text-purple-600" />
              <span className="text-xs sm:text-sm">{job.publish_date || 'N/A'}</span>
            </div>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 justify-end">
            {jobAgeLabel === "New" && <JobBadge className="bg-purple-900/50 text-purple-300"><Zap size={12} className="inline mr-1"/>New</JobBadge>}
            {jobAgeLabel === "Old" && <JobBadge className="bg-gray-700 text-gray-400">Old</JobBadge>}
            {job.is_clicked && <JobBadge className="bg-red-900/50 text-red-300">Clicked</JobBadge>}
            {job.experience && <JobBadge className="bg-purple-900/50 text-purple-300">{job.experience}</JobBadge>}
          </div>
        </div>
      </div>
    </div>
  );
};

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('recent');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://chemistryjobs-1.onrender.com/jobs");
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (jobLink) => {
    try {
      await axios.post("https://chemistryjobs-1.onrender.com/mark-job-clicked", { link: jobLink });
      fetchJobs();
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
        );
      default: // 'recent'
        return [...jobsToSort].sort((a, b) => 
          new Date(b.publish_date) - new Date(a.publish_date)
        );
    }
  }, [sortOption]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const sorted = sortJobs(filtered);
    setFilteredJobs(sorted);
  }, [searchTerm, jobs, sortOption, sortJobs]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-purple-950 min-h-screen text-white py-6 sm:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-6 animate-pulse">
            SITE EL BABY 
          </h1>
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <div className="relative w-full">
                <input 
                  type="text"
                  placeholder="Search jobs by title, description, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 sm:p-3 pl-10 bg-gray-800 border border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300 hover:border-purple-600 text-sm sm:text-base"
                />
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" 
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto p-2 sm:p-3 bg-gray-800 border border-purple-800 rounded-lg hover:bg-purple-900 transition-colors group"
              >
                <Filter size={20} className="text-purple-400 group-hover:text-purple-300" />
              </button>
            </div>

            {showFilters && (
              <div className="bg-gray-800 border border-purple-800 rounded-lg p-4 mt-2 shadow-lg space-y-2">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="text-purple-300 text-sm">Sort by:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-auto bg-gray-900 text-white p-2 rounded border border-purple-800 text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="featured">Featured Jobs</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-purple-500 animate-pulse" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center bg-gray-800 p-8 rounded-lg border border-purple-800">
            <p className="text-xl text-purple-400">No jobs found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredJobs.map((job, index) => (
              <JobCard 
                key={index} 
                job={job} 
                onJobClick={handleJobClick} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;