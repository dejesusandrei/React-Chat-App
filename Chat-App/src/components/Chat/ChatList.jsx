import { NavLink, useOutletContext, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { ref, set, update, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";
import { formatShortTime } from '../../utility/formatShortTime';

import addFriend from '../../assets/add-friend.png'
import noChats from '../../assets/conversation.png'
import deleteIcon from '../../assets/delete.png'
import moreIcon from '../../assets/more.png'

export default function ChatList({ friends, users, lastChat, search }){
	const { user } = useContext(AuthContext);
	const { activeChat, setActiveChat, setTitle } = useOutletContext() || {};
	const navigate = useNavigate();

	const [openMenu, setOpenMenu] = useState(null);

	async function handleRemoveChats(friendUid){
		if (!user?.uid || !friendUid) return;
		try {
			const chatRoomId = [user.uid, friendUid].sort().join("_");
			const updates = {};
			// Remove chat messages
			updates[`messages/${chatRoomId}`] = null;
			// Remove last chat information from both users
			updates[`lastChatMessage/${user.uid}/${friendUid}`] = null;
			updates[`lastChatMessage/${friendUid}/${user.uid}`] = null;
			await update(ref(db), updates);
		} catch (error) {
			console.error("Error removing friend chat request:", error);
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

	// Initial State Loader: Binabasa ang na-save na read state sa LocalStorage sa unang pag-load ng page
	const [readChats, setReadChats] = useState(() =>{
		if (!user?.uid) return {};
		try {
			const save = localStorage.getItem(`readChats_${user.uid}`);
			return save ? JSON.parse(save) : {};
		} catch (error) {
			return {};
		}
	});

	// Storage Sync: Ina-update ang LocalStorage tuwing magbabago ang readChats state
	useEffect(() =>{
		if(user?.uid) localStorage.setItem(`readChats_${user.uid}`, JSON.stringify(readChats));		
	}, [readChats, user?.uid]);

	// Read State Auto-Update: Awtomatikong mina-mark bilang READ ang kasalukuyang binuksan na chat
	useEffect(() => {
    if (!activeChat?.uid) return;
		const currentTimestamp = lastChat?.[activeChat.uid]?.timestamp;
		if (currentTimestamp) {
			setReadChats((prev) => {
				if (prev[activeChat.uid] === currentTimestamp) return prev;
				return {
					...prev,
					[activeChat.uid]: currentTimestamp,
				};
			});
		}
  }, [activeChat?.uid, lastChat]);

	// Manual Action Trigger: Inililipat ang active chat at mina-mark bilang READ ang napiling kaibigan kapag na-click
	const handeSelectChat = (friend) => {
    if (!friend?.uid) return;
    const currentMessageTimestamp = lastChat?.[friend.uid]?.timestamp;
    if (currentMessageTimestamp) {
      setReadChats((prev) => ({
        ...prev,
        [friend.uid]: currentMessageTimestamp,
      }));
    }
    if (setActiveChat) setActiveChat(friend);
    navigate(`?id=${friend.uid}`, { replace: true });
  };

	const filteredChats = users.filter((u) => {
		const isFriend = friends.includes(u.uid);
		// Sinu-suri kung may record ang user na ito sa lastChat object
		// this is for the user unfriend you, you can still messages each other
    const hasChatHistory = Boolean(lastChat?.[u.uid]);
		const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
		const matchesSearch = fullName.includes(search.toLowerCase());
    return (isFriend || hasChatHistory) && matchesSearch;
	});

	return(
		<>
		{filteredChats.length === 0 ? (
			<>
				{search ? (
					<div className='flex items-center justify-center'>
						<p className="text-sm text-zinc-400 mt-2 wrap-break-word text-center">
							No matching chats found for "{search}"
						</p>
					</div>
				) : (
				<div className='flex justify-center items-center w-full h-full'>
					<div className='flex flex-col items-center gap-1'>
						<div className='flex justify-center items-center'><img src={noChats} alt="No Conversation" /></div>
						<h2 className="text-[20px] sm:text-[24px] font-roboto font-semibold mt-1 text-black dark:text-white">No conversation yet</h2>
						<p className="text-[13px] sm:text-sm font-roboto text-black dark:text-zinc-400 max-w-75 text-center">Start a conversation by adding a friend to send messages, share media, and keep in touch.</p>

						<NavLink to="../contacts" className=" flex justify-center items-center gap-x-2 mt-6 bg-white rounded-xl px-6 py-2.75 cursor-pointer">
							<div className='flex justify-center items-center'><img className=' w-5 h-5 sm:w-7 sm:h-7' src={addFriend} alt="Add Friend"/></div>
							<p className="text-[14px] sm:text-[16px] font-roboto font-semibold text-white dark:text-zinc-900">Add Friend</p>
						</NavLink>
					</div>
				</div>
				)}
			</>
		) : (
			<div className="flex flex-col justify-center w-full gap-y-1">
				{[...filteredChats].sort((a, b) => {
					// Kunin ang timestamp ng huling chat kay Friend A at Friend B.
        	// Kapag walang chat (undefined), 0 ang gagamiting oras (pinakaluma).
					const timeA = lastChat?.[a.uid]?.timestamp || 0; // 1000 kahapon
					const timeB = lastChat?.[b.uid]?.timestamp || 0; // 3000 ngayon
					return timeB - timeA; // 3000 - 2000 = +2000 (POSITIVE)
				}).map((friend) =>{
					const isOnline = Boolean(friend?.isOnline);
					const isActive = activeChat?.uid === friend.uid;

					// 1. Kunin ang last chat info gamit ang friend's UID bilang Key
					const chatInfo = lastChat?.[friend.uid];
					const lastMessageText = chatInfo?.lastMessage;
					const lastMessageTimestamp = chatInfo?.timestamp;
					const isSelfSender = chatInfo?.senderId === user.uid;
					const isFriendSender = Boolean(chatInfo?.senderId) && !isSelfSender;
					const timeStamp = chatInfo?.timestamp;

					const lastReadTimestamp = readChats[friend.uid];

					// UI Rule Check: Magiging TRUE (Unread/White) lang kung galing sa kaibigan ang message 
					// HINDI mo kasalukuyang binubuksan ang chat, at BAGO ang timestamp nito
					const isUnread = isFriendSender && !isActive && (!lastReadTimestamp || lastMessageTimestamp > lastReadTimestamp)

					return(
							<button onClick={() => handeSelectChat(friend)}
							key={friend?.uid} 
							className={`flex gap-2.5 items-center w-full p-2 rounded-lg cursor-pointer transition-colors group ${isActive ? "bg-zinc-700/50" : "[&:not(:has(.friend-menu:hover))]:hover:bg-zinc-700/20"}`}>
								<div className="relative shrink-0">
									<div className="image flex justify-center items-center text-white font-semibold w-10 h-10 sm:w-12 sm:h-12 rounded-full"style={{ backgroundColor: friend?.avatarColor || "#4B5563" }}>
										{friend?.firstName?.[0]?.toUpperCase() || "?"}
									</div>
									<span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-gray-500"}`}/>
								</div>
								<div className="flex flex-col text-left font-roboto flex-1 min-w-0 overflow-hidden">
									<p className="font-semibold text-[14px] sm:text-[15px] text-white truncate">{`${friend?.firstName} ${friend?.lastName}`}</p>
									<p className={`text-[12px] sm:text-[13px] mb-1 font-semibold truncate w-full ${isUnread ? 'text-white' : 'text-zinc-400'}`}>
										{lastMessageText ? (
											<>
												{isSelfSender && <span className='text-zinc-400'>You: </span>}
												{lastMessageText}
												{<span className='pl-1 text-zinc-400'>· {formatShortTime(timeStamp)}</span>}
											</>
										) : (
											`Start a conversation with ${friend?.firstName} ${friend?.lastName}`
										)}
									</p>
								</div>
								<div className='relative friend-menu shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
									<div onClick={(e) =>	{
										e.stopPropagation(); 
										console.log(friend.uid);
									}}
									className={`flex justify-center items-center px-2 py-2 gap-x-2 rounded-full cursor-pointer bg-zinc-700/50 hover:bg-zinc-700/80`}>
										<img className='w-5 h-5 shrink-0' src={moreIcon} alt="More icon" />
									</div>
								</div>
							</button>
					);
				})}
			</div>
		)}
		</>
	);
}