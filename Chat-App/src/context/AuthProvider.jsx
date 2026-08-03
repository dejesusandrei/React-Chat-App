import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase/firebase.config";

/**
 * Sa madaling salita, si AuthProvider ang "source of truth" (alam kung sino ang user)
 */


export const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth(app);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>
			{!loading && children}
		</AuthContext.Provider>
	);

}