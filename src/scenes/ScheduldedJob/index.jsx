import React, { useState, useEffect } from 'react';

const ScheduledJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobList().then(data => {
      setJobs(data || []);
      setLoading(false);
    });
  }, []);

  const fetchMyJobList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch('/user/myJobList', {
        method: 'GET',
        headers: {
          'Authorisation': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch job list:', errorData.message);
        return [];
      }
    } catch (error) {
      console.error('Error in fetching job list:', error.message);
      return [];
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Your Scheduled Jobs</h2>
          {jobs.length === 0 ? (
            <p>No scheduled jobs found.</p>
          ) : (
            <ul>
              {jobs.map((job, index) => (
                <li key={index}>
                  {/* Display job details here */}
                  Job ID: {job._id}, Site ID: {job.site_id}
                  {/* Add more details as needed */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledJob;
