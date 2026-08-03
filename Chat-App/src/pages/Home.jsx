import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

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

	return(
		<>
			<title>ReiChat</title>
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
			
			<main className={`h-dvh bg-zinc-950 ${isSidebarOpen ? "ml-66" : "ml-20"}`}>
				dsas
			</main>
			
		</>
	);
}

export default Home;