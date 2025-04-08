import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Import the corresponding CSS file
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Provinces and districts in Sri Lanka
  const provinces = [
    "Central Province",
    "Eastern Province",
    "North Central Province",
    "Northern Province",
    "North Western Province",
    "Sabaragamuwa Province",
    "Southern Province",
    "Uva Province",
    "Western Province"
];

const districts = {
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Western Province": ["Colombo", "Gampaha", "Kalutara"]
};

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/users`);
      setUsers(response.data.data);
      console.log(response.data.data);
      
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users by type
  const filterUsers = (type) => {
    setFilterType(type);
    let filtered = users;

    if (type === "candidates") {
      filtered = users.filter(user => user.isCandidate);
    } else if (type === "normal") {
      filtered = users.filter(user => !user.isCandidate);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter(user => user.province === selectedProvince);
    }

    if (selectedDistrict) {
      filtered = filtered.filter(user => user.district === selectedDistrict);
    }

    setFilteredUsers(filtered);
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${BASE_URL}/api/v1/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Handle province change
  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict("");
    filterUsers(filterType);
  };

  // Handle district change
  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    filterUsers(filterType);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    filterUsers(filterType);
  };

  return (
    <div className="users-container">
      <h1 className="ad-usr-h1">User Management</h1>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="dropdowns">
          <select
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!selectedProvince}
          >
            <option value="">Select District</option>
            {selectedProvince &&
              districts[selectedProvince]?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button onClick={() => filterUsers("all")} className={filterType === "all" ? "active" : ""}>
            All Users
          </button>
          <button onClick={() => filterUsers("candidates")} className={filterType === "candidates" ? "active" : ""}>
            Candidates
          </button>
          <button onClick={() => filterUsers("normal")} className={filterType === "normal" ? "active" : ""}>
            Normal Users
          </button>
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <img className="ad-usr-img" src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
              <div className="user-info">
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <p>NIC: {user.nic}</p>
                <p>Province: {user.province}</p>
                <p>District: {user.district}</p>
              </div>
              <button className="ad-usr-delete-button" onClick={() => handleDelete(user._id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
