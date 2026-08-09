import { useState, useEffect, Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
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
	const [users, setUsers] = useState([]);
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

		// Get all users
		const userRef = ref(db, "users");
		const unsubscribes = onValue(userRef, (snapshot) =>{
			if(snapshot.exists()){
				const data = snapshot.val();
				const usersArray = Object.entries(data).map(([uid, value]) => ({
					uid,
					...value
				}));
				setUsers(usersArray);
			}
		});

		return () => {
			set(userStatusRef, false);
			unsubscribeConnected();
			unsubscribes();
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
	const isMobile = width < 640;
	const closeSidebar = width < 1357;
	
	useEffect(() =>{
		if(closeSidebar) setIsSidebarOpen(false);
	}, [closeSidebar]);

	// Dito natin itatago kung sino ang kasalukuyang pino-click na kausap
  const [activeChat, setActiveChat] = useState(null);

	const [searchParams] = useSearchParams();
	const chatIdFromUrl = searchParams.get('id');

	useEffect(() => {
		// Kung may ID sa URL at may listahan ka ng users, hanapin at i-set as activeChat
		if (chatIdFromUrl) {
			const selectedUser = users.find(u => u.uid === chatIdFromUrl);
			if (selectedUser) {
				setActiveChat(selectedUser);
			}
		}
	}, [chatIdFromUrl, users])

	return(
		<>
			<title>ReiChat</title>

			<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile}/>
			
			<main className={`h-dvh bg-zinc-950 py-1.5 px-1.5 sm:py-3.5 flex ${isMobile ? 'ml-0' : isSidebarOpen ? "ml-66" : "ml-20"}`}>
				<aside className="hidden lg:block w-166 ml-3 p-4 rounded-lg bg-zinc-800">
					{/* Outlet renders <Chats /> || <Contacts/> */}
					<Outlet context={{ activeChat, setActiveChat }}/>
				</aside>

				<section className="w-full h-full flex flex-col bg-zinc-800 rounded-lg mx-1 sm:mx-4 overflow-hidden">
					<ChatWindow activeChat={activeChat}/>
				</section>
			</main>
			
		</>
	);
}

export default Home;