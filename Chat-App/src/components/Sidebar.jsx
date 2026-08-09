import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import '../index.css'

import { getDarkColor } from "../utility/getRandomDarkColor";

// icons
import logoWhite from '../assets/logo/logo-white.png'
import sidebar from '../assets/sidebar.svg'
import chatHover from '../assets/chat-hover.svg'
import chat from '../assets/chat.svg'
import notifHover from '../assets/notif-hover.svg'
import notif from '../assets/notif.svg'
import contactHover from '../assets/contact-hover.png'
import contact from '../assets/contact.png'


export default function Sidebar({isSidebarOpen, setIsSidebarOpen, isMobile}) {
	const { user } = useContext(AuthContext);
	return(
		<>
			<aside className={`h-screen bg-zinc-900 text-white fixed top-0 left-0 px-3 py-4 flex flex-col font-roboto  ${isMobile ? 'hidden w-0' : isSidebarOpen ? "w-76" : "w-20"}`}>
				<div className="flex flex-col items-center justify-between h-full">
					
					<div className="w-full flex flex-col gap-y-1">
						{/* LOGO */}
						{/* <div className='flex justify-center items-center grow h-15.5  rounded-md cursor-pointer mb-5'>
							<div className="image flex justify-center items-center  w-9">
								<img className="w-full" src={logoWhite} alt="ReiChat icon" />
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center items-center">
									<p className='text-white text-[18px] font-mono font-semibold'>ReiChats</p>
								</div>
							)}
						</div> */}

						<NavLink to="/home/chats" className={({ isActive }) =>
							`flex items-center h-12.5 px-3 rounded-md ${isSidebarOpen? "justify-start gap-3": "justify-center"} 
							${isActive? "bg-zinc-800": "hover:bg-zinc-800"}`}>
								{({ isActive }) => (
									<>
										<div className={`flex justify-center items-center ${isSidebarOpen ? "w-7 h-7" : "w-6 h-6"}`}>
												<img src={isActive ? chatHover : chat} alt="Chats" />
										</div>
										{isSidebarOpen && (<p className={isActive ? "text-white font-semibold" : "text-gray-300 font-semibold"}>Chats</p>)}
									</>
							)}
						</NavLink>

						<NavLink to="/home/contacts" className={({ isActive }) =>
							`flex items-center h-12.5 px-3 rounded-md ${isSidebarOpen? "justify-start gap-3": "justify-center"} 
							${isActive? "bg-zinc-800": "hover:bg-zinc-800"}`}>
							{({ isActive }) => (
									<>
										<div className={`flex justify-center items-center ${isSidebarOpen ? "w-7 h-7" : "w-6 h-6"}`}>
												<img src={isActive ? contactHover : contact} alt="Contacts" />
										</div>
										{isSidebarOpen && (<p className={isActive ? "text-white font-semibold" : "text-gray-300 font-semibold"}>Contacts</p>)}
									</>
							)}
						</NavLink>

						<NavLink to="/home/notifications" className={({ isActive }) =>
							`flex items-center h-12.5 px-3 rounded-md ${isSidebarOpen? "justify-start gap-3": "justify-center"} 
							${isActive? "bg-zinc-800": "hover:bg-zinc-800"}`}>
								{/* Gamitin ang children callback ng NavLink */}
							{({ isActive }) => (
									<>
										<div className={`flex justify-center items-center ${isSidebarOpen ? "w-7 h-7" : "w-6 h-6"}`}>
												<img src={isActive ? notifHover : notif} alt="Notifications" />
										</div>
										{isSidebarOpen && (<p className={isActive ? "text-white font-semibold" : "text-gray-300 font-semibold"}>Notifications</p>)}
									</>
							)}
						</NavLink>
					</div>

					<div className={`w-full flex ${isSidebarOpen ? 'items-center gap-2' : 'flex-col items-center gap-1'}`}>
						<div className={isSidebarOpen ? 'flex gap-2 items-center grow h-12.5 p-2 hover:bg-zinc-800 rounded-md cursor-pointer' : 'flex gap-2 items-center grow h-12.5 p-2rounded-md cursor-pointer'}>
							<div className="image flex justify-center items-center w-9 h-9 rounded-full "
							style={{ backgroundColor: getDarkColor(user?.uid) }}>
								{user?.displayName[0].toUpperCase()}
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center">
									<p className="font-bold text-[13px] lg:text-[14px]">{user?.displayName}</p>
									<p className=" text-[12px] lg:text-[13px] text-gray-200 mb-1">{user?.email}</p>
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