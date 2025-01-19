import React, { useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const provinces = [
    "Central Province",
    "Eastern Province",
    "North Central Province",
    "Northern Province",
    "North Western Province",
    "Sabaragamuwa Province",
    "Southern Province",
    "Uva Province",
    "Western Province",
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
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
  };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/users");
            setUsers(response.data.data);
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

  return <div>Users Component</div>;
};

export default Users;
