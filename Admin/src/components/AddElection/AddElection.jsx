import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddElection.css';

const AddElection = () => {
  const [electionType, setElectionType] = useState("");
  const navigate = useNavigate();  // Initialize navigate function

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setElectionType(selectedType);
    
    // Redirect based on selected election type
    if (selectedType === "Presidential") {
      navigate("/presidential-election");  
    } else if (selectedType === "Parliamentary") {
      navigate("/parliment-election"); 
    } else if (selectedType === "Provincial Council") {
      navigate("/provincial-election");  
    } else if (selectedType === "General Election") {
      navigate("/general-election");  
    } 
    // You can add similar conditions for other election types if needed
  };

  return (
    <div className="add-election-container">
      <h2>Select Election Type</h2>
      <select
        value={electionType}
        onChange={handleTypeChange}
        className="election-type-dropdown"
      >
        <option value="" disabled>
          Choose Election Type
        </option>
        <option value="Presidential">Presidential</option>
        <option value="Parliamentary">Parliamentary</option>
        <option value="General Election">General Election</option>
        <option value="Provincial Council">Provincial Council</option>
      </select>
      {electionType && <p>You selected: {electionType}</p>}
    </div>
  );
};

export default AddElection;
