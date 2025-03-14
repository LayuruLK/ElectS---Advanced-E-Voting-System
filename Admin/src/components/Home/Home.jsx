import React, { useState, useEffect } from 'react'; // For state and effect hooks
import './Home.css'; // Import the CSS file
import axios from 'axios'; // For making API requests
import Employee from '../../assets/employee.gif';
import Debate from '../../assets/debate.gif';
import CandidateVerifications from '../../assets/identityverification.png';
import CompliantReview from '../../assets/badreview.gif';
import ProjectReview from '../../assets/project.gif';
import { Link } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  // State hooks to store data
  const [userCount, setUserCount] = useState(0);
  const [reportFakes, setReportFakes] = useState(0);
  const [pendingCandidateVerificationCount, setPendingCandidateVerificationCount] = useState(0);
  const [pendingUserVerificationCount, setPendingUserVerificationCount] = useState(0);
  const [pendingComplaintCount, setPendingComplaintCount] = useState(0);
  const [pendingProjectCount, setPendingProjectCount] = useState(0);

  // Fetch data on page load
  useEffect(() => {
    // Fetch user count
    axios.get(`${BASE_URL}/api/v1/users/get/count`)
      .then(res => setUserCount(res.data))
      .catch(err => console.error(err));

    // Fetch candidate count
    axios.get(`${BASE_URL}/api/v1/reportFakes/get/pendingverifications/count`)
      .then(res => setReportFakes(res.data.count))
      .catch(err => console.error(err));

    // Fetch pending user sverifications count
    axios.get(`${BASE_URL}/api/v1/users/get/pendingverifications/count`)
      .then(res => setPendingUserVerificationCount(res.data.count))
      .catch(err => console.error(err));


    // Fetch pending candidates verifications count
    axios.get(`${BASE_URL}/api/v1/candidates/get/pendingcandidates/count`)
      .then(res => setPendingCandidateVerificationCount(res.data.count))
      .catch(err => console.error(err));

    // Fetch pending complaints count
    axios.get(`${BASE_URL}/api/v1/complaints/get/pendingverifications/count`)
      .then(res => setPendingComplaintCount(res.data.count))
      .catch(err => console.error(err));

    // Fetch pending projects count
    axios.get(`${BASE_URL}/api/v1/projects/get/pendingverifications/count`)
      .then(res => setPendingProjectCount(res.data.count))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <div className="dashboard">
        {/* <h3 className='ad-dash'>Admin Dashboard</h3> */}
        <div className="stats-container">
          {/* User Count */}

          <div className="stat-card">
            <Link to='/users'>
              <img src={Employee} alt="Users" className="stat-icon" />
              <h4>Total Users</h4>
              <p className="stat-count">{userCount}</p>
            </Link>
          </div>


          {/* Candidate Count */}
          <div className="stat-card">
            <Link to='/report-review'>
              <img src={Debate} alt="Candidates" className="stat-icon" />
              <h4>Pending Apeals</h4>
              <p className="stat-count">{reportFakes}</p>
            </Link>
          </div>

          {/* Pending Candidates Verifications */}
          <div className="stat-card">
            <Link to='/candidate-review'>
              <img src={CandidateVerifications} alt="Candidate Verifications" className="stat-icon" />
              <h4>Pending Candidate Verifications</h4>
              <p className="stat-count">{pendingCandidateVerificationCount}</p>
            </Link>
          </div>

          {/* Pending Complaints */}
          <div className="stat-card">
            <Link to='/complaint-review'>
              <img src={CompliantReview} alt="Complaints" className="stat-icon" />
              <h4>Pending Complaints</h4>
              <p className="stat-count">{pendingComplaintCount}</p>
            </Link>
          </div>

          {/* Pending Project Reviews */}
          <div className="stat-card">
            <Link to='/project-review'>
              <img src={ProjectReview} alt="Project Reviews" className="stat-icon" />
              <h4>Pending Project Reviews</h4>
              <p className="stat-count">{pendingProjectCount}</p>
            </Link>
          </div>

          {/* Pending User Verifications (Candidates) */}
          <div className="stat-card">
            <Link to='/nic-review'>
              <img src={CandidateVerifications} alt="Candidate Verifications" className="stat-icon" />
              <h4>Pending User Verifications</h4>
              <p className="stat-count">{pendingUserVerificationCount}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
