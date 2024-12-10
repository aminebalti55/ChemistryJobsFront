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
  Briefcase
} from "lucide-react";

const NeonBadge = ({ children, variant = "purple", className = "" }) => {
  const variantStyles = {
    purple: "bg-purple-900/30 text-purple-200 border border-purple-600/50 hover:bg-purple-900/50",
    green: "bg-green-900/30 text-green-200 border border-green-600/50 hover:bg-green-900/50",
    blue: "bg-blue-900/30 text-blue-200 border border-blue-600/50 hover:bg-blue-900/50"
  };

  return (
    <span 
      className={`
        px-2 py-1 text-xs rounded-full 
        transition-all duration-300 
        ${variantStyles[variant]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};

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
  };

  return (
    <div 
      className="group relative transform transition-all duration-300 hover:scale-[1.03]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-gray-900 to-gray-800 
          border border-transparent 
          transition-all duration-300
          ${isHovered 
            ? 'shadow-2xl border-purple-600/50 hover:shadow-purple-500/30' 
            : 'shadow-lg'
          }
        `}
      >
        {/* Neon Glow Effect */}
        <div 
          className={`
            absolute inset-0 
            bg-purple-500/10 
            opacity-0 
            group-hover:opacity-100 
            transition-opacity 
            duration-500 
            pointer-events-none
            blur-3xl
          `}
        />

        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              <a 
                href={job.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={handleJobClick}
                className="
                  text-xl font-bold 
                  text-purple-300 
                  hover:text-purple-200 
                  transition-colors 
                  flex items-center 
                  space-x-2
                "
              >
                <span>{job.title}</span>
                {job.is_featured && (
                  <Star 
                    size={20} 
                    className="text-yellow-400 animate-pulse" 
                    title="Featured Job" 
                  />
                )}
              </a>
            </div>
            <a 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleJobClick}
              className="
                text-purple-500 
                hover:text-purple-300 
                transition-colors 
                hover:scale-110
              "
            >
              <ExternalLink size={22} />
            </a>
          </div>

          <p className="text-gray-300 mb-4 line-clamp-3 opacity-90">
            {job.description}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-purple-500" />
                <span className="text-sm">{job.location || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDays size={18} className="text-purple-600" />
                <span className="text-sm">{job.publish_date || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {jobAgeLabel === "New" && (
                <NeonBadge variant="green">
                  <Zap size={12} className="inline mr-1" />New
                </NeonBadge>
              )}
              {jobAgeLabel === "Old" && (
                <NeonBadge variant="blue">Old</NeonBadge>
              )}
              {job.is_clicked && (
                <NeonBadge variant="purple">Clicked</NeonBadge>
              )}
              {job.experience && (
                <NeonBadge>
                  <Briefcase size={12} className="inline mr-1" />
                  {job.experience}
                </NeonBadge>
              )}
            </div>
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
    <div 
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-gray-950 
        via-black 
        to-purple-950 
        text-white 
        py-12
        relative
        overflow-hidden
      "
    >
      {/* Background Neon Glow */}
      <div 
        className="
          absolute 
          inset-0 
          bg-purple-500/10 
          blur-3xl 
          opacity-50 
          pointer-events-none
        "
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="mb-12 text-center">
          <h1 
            className="
              text-5xl 
              font-bold 
              text-transparent 
              bg-clip-text 
              bg-gradient-to-r 
              from-purple-400 
              to-pink-600 
              mb-6 
              animate-pulse
            "
          >
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
                  className="
                    w-full 
                    p-3 
                    pl-10 
                    bg-gray-900 
                    border 
                    border-purple-800/50 
                    rounded-xl 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-purple-500 
                    text-white 
                    transition-all 
                    duration-300 
                    hover:border-purple-600
                  "
                />
                <Search 
                  size={20} 
                  className="
                    absolute 
                    left-3 
                    top-1/2 
                    transform 
                    -translate-y-1/2 
                    text-purple-400
                  " 
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="
                  w-full 
                  sm:w-auto 
                  p-3 
                  bg-gray-900 
                  border 
                  border-purple-800/50 
                  rounded-xl 
                  hover:bg-purple-900/50 
                  transition-colors 
                  group
                "
              >
                <Filter 
                  size={20} 
                  className="text-purple-400 group-hover:text-purple-300" 
                />
              </button>
            </div>

            {showFilters && (
              <div 
                className="
                  bg-gray-900 
                  border 
                  border-purple-800/50 
                  rounded-xl 
                  p-4 
                  mt-2 
                  shadow-lg
                "
              >
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="text-purple-300 text-sm">Sort by:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="
                      w-full 
                      sm:w-auto 
                      bg-gray-800 
                      text-white 
                      p-2 
                      rounded-lg 
                      border 
                      border-purple-800/50
                    "
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
            <Loader2 
              size={48} 
              className="
                animate-spin 
                text-purple-500 
                animate-pulse
              " 
            />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div 
            className="
              text-center 
              bg-gray-900 
              border 
              border-purple-800/50 
              p-8 
              rounded-xl
            "
          >
            <p className="text-xl text-purple-400">No jobs found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 gap-6">
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