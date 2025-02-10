const ApplicationStats = ({ stats }) => {
    if (!stats) return null;
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/90 border border-purple-800/50 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-purple-400 text-sm mb-2">Total Applications</h3>
          <p className="text-2xl font-bold">{stats.overall.total_applications}</p>
        </div>
        
        <div className="bg-gray-900/90 border border-green-800/50 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-green-400 text-sm mb-2">Successful</h3>
          <p className="text-2xl font-bold">{stats.overall.successful_applications}</p>
        </div>
        
        <div className="bg-gray-900/90 border border-red-800/50 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-red-400 text-sm mb-2">Failed</h3>
          <p className="text-2xl font-bold">{stats.overall.failed_applications}</p>
        </div>
        
        <div className="bg-gray-900/90 border border-blue-800/50 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-blue-400 text-sm mb-2">Total Attempts</h3>
          <p className="text-2xl font-bold">{stats.overall.total_attempts}</p>
        </div>
  
        {/* Site-specific stats */}
        <div className="col-span-full mt-4">
          <h3 className="text-purple-400 text-sm mb-4">Applications by Site</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(stats.by_site).map(([site, siteStats]) => (
              <div key={site} className="bg-gray-900/90 border border-purple-800/50 rounded-xl p-4">
                <h4 className="text-white text-sm mb-2 capitalize">{site}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Success:</span>
                  <span className="text-green-400">{siteStats.successes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Attempts:</span>
                  <span className="text-blue-400">{siteStats.attempts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default ApplicationStats;