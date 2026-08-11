import { useState, useEffect, Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { getDatabase, ref, onValue, onDisconnect, set } from 'firebase/database';
import app from "../firebase/firebase.config";
import { AuthContext } from "../context/AuthProvider";
import { getAuth } from "firebase/auth";

import Chats from "../components/Chat/Chats";
import Sidebar from "../components/Sidebar";
import useWindowSize from '../hooks/useWindowSize'
import Contacts from "../components/Contact/Contacts";
import Notifications from "../components/Notification/Notifications";
import ChatWindow from "../components/Chat/ChatWindow";

function Home(){
	const { user } = useContext(AuthContext);
	const db = getDatabase(app);
	const auth = getAuth(app);

	const [users, setUsers] = useState([]);
	const [title, setTitle] = useState(null);

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
			}else { setUsers([]); }
		});

		return () => {
			if (auth.currentUser) {
        set(userStatusRef, false);
      }
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
	const isMobile = width < 20;
	const closeSidebar = width < 1280;
	
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
				setTitle(`${selectedUser.firstName} ${selectedUser.lastName}`);
			}
		}
	}, [chatIdFromUrl, users])

	return(
		<>
			<title>{`${title ? (`${title} | ReiChat`) : ('Reichat')}`}</title>

			<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile}/>
			
			<main className={`h-dvh bg-zinc-950 py-1.5 px-1.5 sm:py-3.5 flex ${isMobile ? 'ml-0' : isSidebarOpen ? "ml-76" : "ml-18"}`}>
				<aside className={`w-full lg:w-96 xl:w-md shrink-0 h-full p-3 overflow-hidden rounded-lg bg-zinc-800 ${activeChat ? "hidden lg:flex lg:flex-col" : "flex flex-col"}`}>
					{/* Outlet renders <Chats /> || <Contacts/> */}
					<Outlet context={{ activeChat, setActiveChat, title, setTitle }}/>
				</aside>

				<section className={`h-full bg-zinc-800 grow overflow-hidden rounded-lg md:mx-2 min-w-0 ${activeChat ? "flex flex-col w-full" : "hidden md:flex lg:flex-col"}`}>
					<ChatWindow activeChat={activeChat} onBack={() => setActiveChat(null)}/>
				</section>
			</main>
			
		</>
	);
}

export default Home;