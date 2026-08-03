import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Home(){
	const TABS = {
		CHATS: "chats",
		NOTIF: 'notifications',
		CONTACT: 'contacts',
		SETTINGS: "settings",
	};
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [activeTab, setActiveTab] = useState(TABS.CHATS);

	return(
		<>
			<title>ReiChat</title>
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
			
			<main className={`h-dvh bg-zinc-950 ${
				isSidebarOpen ? "ml-66" : "ml-20"
			}`}>
				dsas
			</main>
			
		</>
	);
}

export default Home;