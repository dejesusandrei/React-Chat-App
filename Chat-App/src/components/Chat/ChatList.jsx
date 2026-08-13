import { NavLink, useOutletContext, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { ref, set, update, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";

import addFriend from '../../assets/add-friend.png'
import noChats from '../../assets/conversation.png'

export default function ChatList({ friends, users, lastChat, search }){
	const { user } = useContext(AuthContext);

	const navigate = useNavigate();
	const { activeChat, setActiveChat, setTitle } = useOutletContext() || {};

	const handeSelectChat = (friend) =>{
		if(setActiveChat) setActiveChat(friend);
		const titlePage = `${friend?.firstName} ${friend?.lastName}`;
		navigate(`?id=${friend.uid}`, {replace: true});
	}

	const filteredFriends = users.filter((u) => {
		const isFriend = friends.includes(u.uid)
		const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
		const matchesSearch = fullName.includes(search.toLowerCase());

    return isFriend && matchesSearch;
	});

	return(
		<>
		{filteredFriends.length === 0 ? (
			<>
				{search ? (
					<div className='flex items-center justify-center'>
						<p className="text-sm text-zinc-400 mt-2 wrap-break-word">
							No matching contacts found for "{search}"
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
				{filteredFriends.map((friend) =>{
					const isOnline = Boolean(friend?.isOnline);
					const isActive = activeChat?.uid === friend.uid;

					// 1. Kunin ang last chat info gamit ang friend's UID bilang Key
					const chatInfo = lastChat?.[friend.uid];
					const lastMessageText = chatInfo?.lastMessage;
					const isSelfSender = chatInfo?.senderId === user.uid;

					return(
						<button onClick={() => handeSelectChat(friend)}
						key={friend?.uid} 
						className={`flex gap-2.5 items-center w-full p-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-zinc-700/80" : "hover:bg-zinc-700/40"}`}>
							<div className="relative shrink-0">
								<div className="image flex justify-center items-center text-white font-semibold w-10 h-10 sm:w-12 sm:h-12 rounded-full"style={{ backgroundColor: friend?.avatarColor || "#4B5563" }}>
									{friend?.firstName?.[0]?.toUpperCase() || "?"}
								</div>
								<span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-gray-500"}`}/>
							</div>
							<div className="flex flex-col text-left font-roboto flex-1 min-w-0 overflow-hidden">
								<p className="font-semibold text-[14px] sm:text-[15px] text-white truncate">{`${friend?.firstName} ${friend?.lastName}`}</p>
								<p className={`text-[12px] sm:text-[13px] mb-1 font-semibold truncate w-full text-zinc-400`}>
									{lastMessageText ? (
										<>
											{isSelfSender && <span className='text-zinc-400'>You: </span>}
											{lastMessageText}
										</>
									) : (
										`You're now friends with ${friend?.firstName} ${friend?.lastName}`
									)}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		)}
		</>
	);
}