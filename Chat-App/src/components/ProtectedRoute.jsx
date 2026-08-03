import { useContext } from "react";
import { Navigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthProvider";

/**
 * habang si ProtectedRoute ang "enforcer" (ginagamit ang impormasyong iyon
 * para payagan o harangin ang access sa mga protected pages).
 */

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext); 
    if (!user) { 
        return <Navigate to="/" replace />; 
    } 
    return children; 
}