import { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase/firebase.config";
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
import settings from '../assets/setting.png'
import logout from '../assets/logout.png'


export default function Sidebar({isSidebarOpen, setIsSidebarOpen, isMobile}) {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const auth = getAuth(app);
	const db = getDatabase(app);

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const profileRef = useRef(null);

	const handleLogout = async () =>{
		try {
      if (user?.uid) {
        const userStatusRef = ref(db, `users/${user.uid}/isOnline`);
        await set(userStatusRef, false);
      }
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error: ", error);
    }
	};

	const handleToggleProfile = () => {
  	setIsProfileOpen((prev) => !prev); // Kapag true, gagawing false. Kapag false, gagawing true!
	};


	useEffect(() => {
    function handleClickOutside(event) {
      // Kapag nag-click sa labas ng buong profileRef container -> ISARA
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

	return(
		<>
			<aside className={`h-screen bg-zinc-900 text-white fixed top-0 left-0 px-3 py-4 flex flex-col font-roboto  ${isMobile ? 'hidden w-0' : isSidebarOpen ? "w-76" : "w-18"}`}>
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
							
						<button onClick={() => handleToggleProfile()}
						ref={profileRef}
						className={isSidebarOpen ? 'relative flex gap-2 items-center grow h-12.5 p-2 hover:bg-zinc-800 rounded-md cursor-pointer' : 'flex gap-2 items-center grow h-12.5 p-2rounded-md cursor-pointer'}>
							<div className="image flex justify-center items-center w-9 h-9 rounded-full "
							style={{ backgroundColor: getDarkColor(user?.uid) }}>
								{user?.displayName[0].toUpperCase()}
							</div>
							{isSidebarOpen && (
								<div className="flex flex-col justify-center">
									<p className="font-bold text-[13px] lg:text-[14px]">{user?.displayName}</p>
									<p className="text-[12px] pl-0.5 lg:text-[13px] text-gray-200 mb-1">{user?.email}</p>
								</div>
							)}
						</button>
						<button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="w-9 h-9 flex justify-center items-center bg-zinc-700 cursor-pointer hover:bg-zinc-600 rounded-full">
							<img className='w-5 h-5' src={sidebar} alt="Sidebar" />
						</button>
					</div>
				</div>

				{isProfileOpen && (
					<div className={`flex absolute ${isSidebarOpen ? 'bottom-20 left-27' : 'bottom-28 left-4.75'} flex-col bg-[#242526] text-zinc-200 w-62 px-2 py-2 gap-y-2 rounded-xl shadow-2xl z-50 border border-zinc-700/40
						/* Dito ginawa ang maliit na arrow tail sa bottom-left */
						after:content-[''] 
						after:absolute 
						after:-bottom-2 
						after:left-2 
						after:w-0 
						after:h-0 
						after:border-l-8 after:border-l-transparent 
						after:border-r-8  after:border-r-transparent 
						after:border-t-8  after:border-t-[#242526]`}>

						<button onClick={() => console.log('Settings')}
						className="flex items-center cursor-pointer border-b border-zinc-700">
							<div className="flex gap-x-3 items-center w-full  hover:bg-zinc-600 hover:rounded-md px-2 py-2 mb-2">
								<img className="shrink-0 w-5 h-5" src={settings} alt="Settings" />
								<span className="text-black dark:text-zinc-200 font-semibold">Settings</span>
							</div>
						</button>

						<button onClick={() => handleLogout()}
						className="flex items-center cursor-pointer">
							<div className="flex gap-x-3 pr-2 items-center w-full  hover:bg-zinc-600 hover:rounded-md px-2 py-2 mb-2">
								<img className="shrink-0 w-5 h-5" src={logout} alt="Settings" />
								<span className="text-black dark:text-zinc-200 font-semibold text-[14px] sm:text-[15px]">Log out</span>
							</div>
						</button>

					</div>
				)}
				
			</aside>
		</>
	);
}    