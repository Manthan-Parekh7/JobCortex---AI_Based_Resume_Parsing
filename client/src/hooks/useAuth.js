// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
