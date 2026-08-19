import { useEffect, useState } from 'react';
import { ref, update } from "firebase/database";

import dots from '../../assets/dots.png'
import unfriend from '../../assets/unfriend.png'

export default function FriendList({userFriends, users, user, db, filterType = 'all', search}){
	const [openMenu, setOpenMenu] = useState(null);

	async function handleRemoveFriends(friendUid){
		if (!user?.uid || !friendUid) return;
		try {
			const updates = {};
			// Remove friendship from both users
				updates[`friends/${user.uid}/${friendUid}`] = null;
				updates[`friends/${friendUid}/${user.uid}`] = null;
			await update(ref(db), updates);
		} catch (error) {
			console.error("Error removing friend request:", error);
		}
	}

	const handleToggleMenu = (friendUid) => {
		setOpenMenu((prev) =>
			prev === friendUid ? null : friendUid
		);
	};

	// Hindi gagana ang useRef dahil naka map and multiple refs
	// Instead i use closest, meaning you can have many friend menus.
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest(".friend-menu")) {
				setOpenMenu(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const filteredFriends = userFriends.filter((friendUid) => {
		const friendData = users[friendUid];
		if (!friendData) return false;
		if (filterType === 'online' && !friendData.isOnline) return false;
		if (!search) return true;

		const firstName = friendData.firstName ?? '';
		const lastName = friendData.lastName ?? '';
		const fullName = `${firstName} ${lastName}`.toLowerCase();
		return fullName.includes(search);
	});

	const emptySubtitles = {
		all: "Add friends and start connecting with people.",
		online: "None of your friends are currently online.",
	};
	return(
		<>
			{filteredFriends.length === 0 ? (
				<>
					{search ? (
						<div className='flex flex-col items-center gap-1 mt-13 w-full min-w-0 overflow-hidden'>
							<p className=" font-roboto w-full text-black dark:text-zinc-400 text-[14px] sm:text-[15px] text-center">No matching contacts found for "{search}"</p>
						</div>
					) : (
						<div className='flex flex-col items-center gap-1 mt-13 w-full min-w-0 overflow-hidden'>
							<p className=" font-roboto w-full text-black dark:text-zinc-400 text-[14px] sm:text-[15px] text-center  ">{emptySubtitles[filterType]}</p>
						</div>
					)}
				</>
			) : (
				<div className="flex flex-col justify-center w-full gap-y-1 overflow-scroll scrollbar-none">
					{filteredFriends.map((friendUid) =>{
						const friendData = users[friendUid];
						const isOnline = Boolean(friendData?.isOnline);
						return(
							<div key={friendUid} className= 'flex gap-2.5 items-center grow h-12.5 mt-2'>
								<div className="relative shrink-0">
									<div className="image flex justify-center items-center text-white font-semibold w-9 h-9 sm:w-10 sm:h-10 rounded-full"style={{ backgroundColor: friendData?.avatarColor || "#4B5563" }}>
										{friendData?.firstName?.[0]?.toUpperCase() || "?"}
									</div>
									<span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-gray-500"}`}/>
								</div>
								<div className="flex flex-col text-left font-roboto flex-1 min-w-0 overflow-hidden">
									<p className="font-bold text-[13px] sm:text-[14px] text-white truncate">{`${friendData?.firstName} ${friendData?.lastName}`}</p>
									<p className={`text-[12px] sm:text-[13px] mb-1 font-semibold ${isOnline ? "text-green-500" : "text-gray-400"}`}>{isOnline ? "Online" : "Offline"}</p>
								</div>
								<div className='relative friend-menu'>
									<button onClick={() =>	handleToggleMenu(friendUid)}
									className={`flex justify-center items-center px-2 py-2 gap-x-2 rounded-full cursor-pointer hover:bg-zinc-700 ${openMenu === friendUid ? 'bg-zinc-700' : ''}`}>
										<img className='w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0' src={dots} alt="Dots" />
									</button>
									{/* Dropdown */}
									{openMenu === friendUid && (
										<div className="absolute right-0 top-10 z-50 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
											<button
												onClick={() => {
													handleRemoveFriends(friendUid);
													setOpenMenu(null);
												}}
												className="flex items-center gap-1 px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 cursor-pointer" >
												<img className='w-6 h-6 sm:h-7 sm:w-7 shrink-0' src={unfriend} alt="Unfriend icon" />
												<span>Remove friend</span>
											</button>
										</div>
									)}
								</div>

							</div>
						);
					})}
				</div>
			)}
		</>
	);
}