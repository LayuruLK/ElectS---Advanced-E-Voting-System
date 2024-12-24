import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';

const AddElection = () => {
  const [formData, setFormData] = useState({
    name: '',
    where: '',
    date: '',
    description: '',
    rules: '',
  });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  return (
    <>
      <ElectionSideBar />
      <div className="add-election">
        <div className="form-container">
          <h1>Add New Election</h1>
        </div>
      </div>
    </>
  );
};

export default AddElection;