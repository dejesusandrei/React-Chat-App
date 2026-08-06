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

	useEffect(() =>{
		if (!user?.uid) return;
		const connectedRef = ref(db, ".info/connected");
        const userStatusRef = ref(db, `users/${user.uid}/isOnline`);

        const unsubscribeConnected = onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === true) {
                // Awtomatikong magiging false kapag nag-close ng browser/app o nawalan ng internet
                onDisconnect(userStatusRef).set(false);
                // Gawing true (Online) habang nakakonekta
                set(userStatusRef, true);
            }
        });
        return () => {
			set(userStatusRef, false);
            unsubscribeConnected();
        };
	}, [user?.uid, db]);

	return (
		<AuthContext.Provider value={{ user, auth, db }}>
			{!loading && children}
		</AuthContext.Provider>
	);

}