import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportReview.css';
import Review from '../Review/Review';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ReportReview = () => {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/reportFakes/unreviewed`);
      setReports(response.data);
    } catch (err) {
      setMessage('Failed to fetch reports. Please try again later.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (reportId) => {
    try {
      await axios.put(`${BASE_URL}/api/v1/reportFakes/resolve/${reportId}`);
      setMessage('Complaint removed and report marked as reviewed.');
      fetchReports();
    } catch (err) {
      setMessage('Failed to resolve the report.');
    }
  };

  const handleReject = async (reportId) => {
    try {
      await axios.put(`${BASE_URL}/api/v1/reportFakes/reject/${reportId}`);
      setMessage('Report marked as rejected.');
      fetchReports();
    } catch (err) {
      setMessage('Failed to reject the report.');
    }
  };

  return (
    <>
      <Review />

      <div className="report-review">
        <h3 className="report-review__title">Review Fake Complaint Reports</h3>
        {message && <p className="report-review__message">{message}</p>}
        {reports.length === 0 ? (
          <p className="report-review__no-reports">No unreviewed reports found.</p>
        ) : (
          <ul className="report-review__list">
            {reports.map((report) => (
              <li key={report._id} className="report-review__item">
                <h4 className="report-review__complaint-title">
                  Complaint: {report.complaintId?.title || 'No Title'}
                </h4>
                <p className="report-review__explanation">Explanation: {report.explanation}</p>
                <div className="report-review__proofs">
                  {report.proofs.map((proof, index) => (
                    <a
                      key={index}
                      href={proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="report-review__proof-link"
                    >
                      View Proof {index + 1}
                    </a>
                  ))}
                </div>
                <div className="report-review__actions">
                  <button
                    onClick={() => handleResolve(report._id)}
                    className="report-review__resolve-btn"
                  >
                    Remove From Complaint List
                  </button>
                  <button
                    onClick={() => handleReject(report._id)}
                    className="report-review__reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ReportReview;
