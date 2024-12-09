import React, { useState } from "react";
import JobList from "./JobList";

const App = () => {
  const [jobs, setJobs] = useState([]);

  return (
    <div className="App">
      <JobList jobs={jobs} />
    </div>
  );
};

export default App;
