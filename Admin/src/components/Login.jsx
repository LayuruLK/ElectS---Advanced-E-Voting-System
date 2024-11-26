import React, { useState } from "react";

export default function AdminLogin(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    // Clear errors
    setError("");

    // Handle admin login logic
    console.log("Admin login attempt:", { username, password });

    // Example: redirect to admin dashboard or show error
    if (username === "admin" && password === "admin123") {
      alert("Login successful!");
      // Redirect logic here
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 style={styles.heading}>Admin Login</h2>

        {error && <p>{error}</p>}

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};