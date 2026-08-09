import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, onDisconnect, set } from 'firebase/database';
import app from "../firebase/firebase.config";

/**
 * Sa madaling salita, si AuthProvider ang "source of truth" (alam kung sino ang user)
 */

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth(app);
	const db = getDatabase(app);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return unsubscribe;
	}, [auth]);

	return (
		<AuthContext.Provider value={{ user, auth, db }}>
			{!loading && children}
		</AuthContext.Provider>
	);

}