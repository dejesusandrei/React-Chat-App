import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import '../index.css'

// icons
import logoWhite from '../assets/logo-white.png'
import sidebar from '../assets/sidebar.svg'
import chatHover from '../assets/chat-hover.svg'
import chat from '../assets/chat.svg'
import notifHover from '../assets/notif-hover.svg'
import notif from '../assets/notif.svg'
import contactHover from '../assets/contact-hover.png'
import contact from '../assets/contact.png'


export default function Sidebar({activeTab, setActiveTab, TABS, isSidebarOpen, setIsSidebarOpen, isMobile}) {
	const { user } = useContext(AuthContext);

	return(
		<>
			<aside className={`h-screen bg-zinc-900 text-white fixed top-0 left-0 px-3 py-4 flex flex-col font-roboto  ${isMobile ? 'hidden w-0' : isSidebarOpen ? "w-66" : "w-20"}`}>
				<div className="flex flex-col items-center justify-between h-full">
					
					<div className="w-full flex flex-col gap-y-1">

						{/* LOGO */}
						<div className='flex items-center grow h-15.5  rounded-md cursor-pointer mb-5'>
							<div className="image flex  w-19">
								<img className="w-full" src={logoWhite} alt="ReiChat icon" />
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center items-center">
									<p className='text-white text-[18px] font-mono font-semibold'>ReiChats</p>
								</div>
							)}
						</div>

						<div className={`flex items-center grow h-12.5 py-2 px-3 rounded-md cursor-pointer 
								${isSidebarOpen? "justify-start gap-3": "justify-center"}
								${activeTab === "chats"? "bg-zinc-800": "hover:bg-zinc-800"}`}
								onClick={() => setActiveTab(TABS.CHATS)}>
							<div className={`image flex justify-center items-center ${isSidebarOpen ? 'w-7 h-7' : 'w-6 h-6'}`}>
								<img src={activeTab === 'chats' ? chatHover : chat} alt="Chat icon" />
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center items-center">
									<p className={activeTab === 'chats' ? 'text-white text-[16px] font-semibold' : 'text-gray-300 text-[16px] font-semibold'}>Chats</p>
								</div>
							)}
						</div>

						<div className={`flex items-center grow h-12.5 py-2 px-3 rounded-md cursor-pointer 
								${isSidebarOpen? "justify-start gap-3": "justify-center"}
								${activeTab === "contacts"? "bg-zinc-800": "hover:bg-zinc-800"}`}
								onClick={() => setActiveTab(TABS.CONTACTS)}>
							<div className={`image flex justify-center items-center ${isSidebarOpen ? 'w-7 h-7' : 'w-6 h-6'}`}>
								<img src={activeTab === 'contacts' ? contactHover : contact} alt="Contact icon" />
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center items-center">
									<p className={activeTab === 'contacts' ? 'text-white text-[16px] font-semibold' : 'text-gray-300 text-[16px] font-semibold'}>Contacts</p>
								</div>
							)}
						</div>

						<div className={`flex items-center grow h-12.5 py-2 px-3 rounded-md cursor-pointer 
								${isSidebarOpen? "justify-start gap-3": "justify-center"}
								${activeTab === "notifications"? "bg-zinc-800": "hover:bg-zinc-800"}`}
								onClick={() => setActiveTab(TABS.NOTIFICATIONS)}>
							<div className={`image flex justify-center items-center ${isSidebarOpen ? 'w-7 h-7' : 'w-6 h-6'}`}>
								<img src={activeTab === 'notifications' ? notifHover : notif} alt="Notification icon" />
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center items-center">
									<p className={activeTab === 'notifications' ? 'text-white text-[16px] font-semibold' : 'text-gray-300 text-[16px] font-semibold'}>Notifications</p>
								</div>
							)}
						</div>

					</div>

					<div className={`w-full flex ${isSidebarOpen ? 'items-center gap-2' : 'flex-col items-center gap-1'}`}>
						<div className={isSidebarOpen ? 'flex gap-2 items-center grow h-12.5 p-2 hover:bg-zinc-800 rounded-md cursor-pointer' : 'flex gap-2 items-center grow h-12.5 p-2rounded-md cursor-pointer'}>
							<div className="image flex justify-center items-center w-9 h-9 rounded-full bg-violet-400">
								{user?.displayName[0].toUpperCase()}
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center">
									<p className="font-bold text-[14px]">{user?.displayName}</p>
									<p className="text-[13px] text-gray-200 mb-1">{user?.email}</p>
								</div>
							)}
						</div>

						<button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="w-9 h-9 flex justify-center items-center bg-zinc-700 cursor-pointer hover:bg-zinc-600 rounded-full">
							<img className='w-5 h-5' src={sidebar} alt="Sidebar" />
						</button>
					</div>


				</div>
			</aside>
		</>
	);
}    