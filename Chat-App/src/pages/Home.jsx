import { useState, useEffect, Fragment } from "react";

import Chats from "../components/Chat/Chats";
import Sidebar from "../components/Sidebar";
import useWindowSize from '../hooks/useWindowSize'

function Home(){
	const TABS = {
		CHATS: "chats",
		NOTIF: 'notifications',
		CONTACT: 'contacts',
		SETTINGS: "settings",
	};
	const [activeTab, setActiveTab] = useState(TABS.CHATS);
	
	const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
		const savedState = localStorage.getItem("sidebarOpen");
		return savedState !== null ? JSON.parse(savedState) : true;
	});

	useEffect(() => {
		localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
	}, [isSidebarOpen]);

	// To handle resizing the page and for responsiveness
	const { width } = useWindowSize();
	const isMobile = width < 450;
	const closeSidebar = width < 1357;
	
	useEffect(() =>{
		if(closeSidebar) setIsSidebarOpen(false);
	}, [closeSidebar]);

	return(
		<>
			<title>ReiChat</title>

			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile}/>
			
			<main className={`h-dvh bg-zinc-950 py-3.5 flex ${isMobile ? 'ml-0' : isSidebarOpen ? "ml-66" : "ml-20"}`}>
				
				<aside className="hidden lg:block w-166 ml-3 rounded-lg bg-zinc-800">
					{activeTab === TABS.CHATS && <Chats/>}
				</aside>

				<section className="w-full rounded-lg bg-zinc-800 ml-4 mr-4 text-white flex justify-center items-center">
					CHAT WINDOW
				</section>


			</main>
			
		</>
	);
}

export default Home;