import { jwtDecode } from "jwt-decode";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const API_URL = `${BASE_URL}/api/v1/admins` 

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
