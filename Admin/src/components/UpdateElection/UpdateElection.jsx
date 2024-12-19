import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import './UpdateElection.css';
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';

const UpdateElection = () => {
  const [elections, setElections] = useState([]); // Store all elections
  const [selectedElection, setSelectedElection] = useState(''); // Store the selected election ID
  const [searchTerm, setSearchTerm] = useState(''); // Store search term for filtering elections
  const [filteredElections, setFilteredElections] = useState([]); // Store filtered elections
  const [formData, setFormData] = useState({
    name: '',
    where: '',
    date: '',
    description: '',
    rules: '',
  });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Fetch elections list
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/elections');
        setElections(response.data.data);
        setFilteredElections(response.data.data); // Initially set filtered elections to all elections
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };

    fetchElections();
  }, []);

   // Fetch the election details when an election is selected
   useEffect(() => {
    if (selectedElection) {
      const fetchElectionDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/elections/${selectedElection}`);
          const { data } = response;
          setFormData({
            name: data.name,
            where: data.where,
            date: new Date(data.date).toISOString().split('T')[0], // Format to YYYY-MM-DD
            description: data.description,
            rules: data.rules,
          });
          setStartTime(new Date(data.startTime));
          setEndTime(new Date(data.endTime));
        } catch (error) {
          console.error('Error fetching election details:', error);
        }
      };
      fetchElectionDetails();
    }
  }, [selectedElection]);

    // Update filtered elections when search term changes
    useEffect(() => {
        setFilteredElections(
          elections.filter(election =>
            election.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }, [searchTerm, elections]);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Combine the selected date with the start and end times
        const electionDate = new Date(formData.date);
    
        // Combine the date with the start time
        const electionStartTime = new Date(electionDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0));
    
        // Combine the date with the end time
        const electionEndTime = new Date(electionDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0));
    
        // Format the times as ISO strings
        const startTimeFormatted = electionStartTime.toISOString();
        const endTimeFormatted = electionEndTime.toISOString();
    
        try {
          const response = await axios.put(`http://localhost:5000/api/v1/elections/${selectedElection}`, {
            ...formData,
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
          });
          alert(response.data.message);
        } catch (error) {
          console.error('Error updating election:', error);
        }
      };
    

  return (
    <>
    <ElectionSideBar/>
    <div className="update-election-container">
      <h1 className='up-ele'>Select Election to Update</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search elections by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display filtered elections as a clickable list */}
      <div className="election-list">
        {filteredElections.map((election) => (
          <div
            key={election._id}
            className="election-item"
            onClick={() => setSelectedElection(election._id)}
          >
            {election.name}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UpdateElection;
