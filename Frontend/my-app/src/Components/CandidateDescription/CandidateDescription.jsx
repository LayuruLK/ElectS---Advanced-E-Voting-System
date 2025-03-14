import React, { useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import "./CandidateDescription.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext"; // Import theme context
const BASE_URL = process.env.REACT_APP_BASE_URL;

const CandidateDescription = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get theme from context
  const userId = localStorage.getItem("user-id");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasDescription, setHasDescription] = useState(false);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/description/view/${userId}`
        );
        const data = await response.json();

        if (data?.description) {
          setDescription(data.description);
          setHasDescription(true);
        }
      } catch (error) {
        console.error("Error fetching description:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = hasDescription
      ? `${BASE_URL}/api/v1/description/edit/${userId}`
      : `${BASE_URL}/api/v1/description/add/${userId}`;

    const method = hasDescription ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (response.ok) {
      alert("Profile updated successfully!");
      setHasDescription(true);
      navigate(`/candidate/${userId}`);
    } else {
      alert("Error updating profile!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="cand-desc-form" onSubmit={handleSubmit}>
      <h2 className="cand-desc-h">Create Your Profile</h2>
      <RichTextEditor value={description} onChange={setDescription} theme={theme} />
      <button type="submit" className="cand-desc-btn">Save</button>
    </form>
  );
};

export default CandidateDescription;
