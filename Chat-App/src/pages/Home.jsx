import { useState, useEffect, Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";
import { getDatabase, ref, onValue, onDisconnect, set } from 'firebase/database';
import app from "../firebase/firebase.config";
import { AuthContext } from "../context/AuthProvider";

import Chats from "../components/Chat/Chats";
import Sidebar from "../components/Sidebar";
import useWindowSize from '../hooks/useWindowSize'
import Contacts from "../components/Contact/Contacts";
import Notifications from "../components/Notification/Notifications";
import ChatWindow from "../components/Chat/ChatWindow";

function Home(){
	const { user } = useContext(AuthContext);
	const db = getDatabase(app);
	// Para makita kung sino yung online
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


	const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
		const savedState = localStorage.getItem("sidebarOpen");
		return savedState !== null ? JSON.parse(savedState) : true;
	});
	
	useEffect(() => {
		localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
	}, [isSidebarOpen]);

	// To handle resizing the page and for responsiveness
	const { width } = useWindowSize();
	const isMobile = width < 620;
	const closeSidebar = width < 1357;
	
	useEffect(() =>{
		if(closeSidebar) setIsSidebarOpen(false);
	}, [closeSidebar]);

	return(
		<>
			<title>ReiChat</title>

			<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile}/>
			
			<main className={`h-dvh bg-zinc-950 py-3.5 flex ${isMobile ? 'ml-0' : isSidebarOpen ? "ml-66" : "ml-20"}`}>
				<aside className="hidden lg:block w-166 ml-3 p-4 rounded-lg bg-zinc-800">
					{/* Outlet renders <Chats /> || <Contacts/> */}
					<Outlet/>
				</aside>

				<section className="w-full h-full flex flex-col rounded-lg bg-zinc-800 ml-4 mr-4">
					<ChatWindow/>
				</section>
			</main>
			
		</>
	);
}

export default Home;