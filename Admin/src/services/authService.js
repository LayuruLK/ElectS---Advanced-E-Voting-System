import jwtDecode from "jwt-decode";

const API_URL = "http://localhost:5000" 

const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data = await response.json();
  return data.token; // Return the token
};
const decodeToken = (token) => jwtDecode(token);

const authService = { login, decodeToken };
export default authService;
