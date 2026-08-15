import { useState, useEffect, Fragment, useContext, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, push, update, serverTimestamp } from 'firebase/database';
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";
import ChatMessage from './ChatMessage'

import '../../index.css'
import Click from '../../assets/click.png'
import Info from '../../assets/info.png'
import Phone from '../../assets/phone-call.png'

export default function ChatWindow({activeChat, onBack}){
	const isOnline = Boolean(activeChat?.isOnline);
	const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
	const db = getDatabase(app);
	const { user } = useContext(AuthContext);

	const navigate = useNavigate();

	// reset the text height
	const textareaRef = useRef(null);
	const chatContainerRef = useRef(null);

	// Auto-scroll function papuntang pinaka-ilalim ng chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

	// FIX: Mag-i-scroll sa bottom tuwing may bago o nadagdag na message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
	
	// Load the messages
	useEffect(() =>{
		if(!user?.uid || !activeChat?.uid) return;
		
		// make a chatRoom ID
		const chatRoomId = [user.uid, activeChat.uid].sort().join("_");
		const messageRef = ref(db, `messages/${chatRoomId}`);
		const unsunscribe = onValue(messageRef, (snapshot) => {
			if(snapshot.exists()){
				const data = snapshot.val();
				const loadedMessages = Object.entries(data).map(([id, value]) => ({
					id,
					...value,
				}));
				setMessages(loadedMessages);
			}else{ setMessages([]); }
		});
		return () => unsunscribe();
	}, [user?.uid, activeChat?.uid, db]);
	
	// Send a Message
	const sendMessage = async () =>{
		if(!user?.uid || !activeChat?.uid || !messageText.trim()) return;
		
		try {
			// make a chat room id
			const chatRoomId = [user.uid, activeChat.uid].sort().join("_");
			const currentText = messageText;

			// 1. Kumuha muna ng unique key para sa bagong message
      const newMessageKey = push(ref(db, `messages/${chatRoomId}`)).key;

			const lastChatData = {
				lastMessage: currentText,
				senderId: user.uid,
				timestamp: serverTimestamp()
			};
			
			const updates = {};

			updates[`messages/${chatRoomId}/${newMessageKey}`] = {
				senderId: user.uid,
				receiverId: activeChat.uid,
				text: currentText,
				timestamp: serverTimestamp(),
      };

			// Last chat inbox summary (Sender at Receiver)
			updates[`lastChatMessage/${user.uid}/${activeChat.uid}`] = lastChatData;
			updates[`lastChatMessage/${activeChat.uid}/${user.uid}`] = lastChatData;

			// 4. Isang beses lang mag-ne-network request (Atomic Update)
			await update(ref(db), updates);

			setMessageText("");
			if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
		} catch (error) {
			console.error("Failed to send a message: ", error);
		}
	};

	return(
		<>
			{!activeChat ? (
				<div className='w-full h-full flex justify-center items-center'>
					<div className='flex flex-col items-center gap-1'>
						<h2 className="text-[23px] font-roboto font-semibold text-black dark:text-white">No conversation selected</h2>
						<p className="text-sm font-roboto text-black dark:text-zinc-400 max-w-50 text-center">Select a chat from the list to start messaging.</p>
					</div>
				</div>
			) : (
				<>
					<div className="flex justify-between  items-center py-3 px-2 sm:p-4 font-roboto border-b border-zinc-900 w-full ">
						<div className="flex gap-2 sm:gap-3 items-center  min-w-0 pr-2 z-50">
							<button 
								onClick={() =>  onBack()} 
								className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-full active:bg-zinc-800 shrink-0">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
							</button>

							{/* Avatar */}
							<div className="image flex shrink-0 justify-center items-center text-white font-semibold w-9 h-9 sm:w-11 sm:h-11 rounded-full  text-sm sm:text-base" style={{ backgroundColor: activeChat?.avatarColor || "#8B5CF6" }}>
								{activeChat?.firstName?.[0]?.toUpperCase() || "?"}
							</div>

							{/* Name Container */}
							<div className="flex flex-col justify-center min-w-0 grow font-roboto">
								<p className="font-bold text-[14px] sm:text-[17px] text-white truncate leading-tight">
									{`${activeChat?.firstName || "User"} ${activeChat?.lastName || ""}`}
								</p>
								<span className={`text-[11px] sm:text-[12px] font-medium truncate ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
							</div>
						</div>

						{/* Right Section: Action Buttons */}
						<div className="flex items-center sm:gap-2 shrink-0">
							<button 
								onClick={() => alert('Not available yet')} 
								className="flex justify-center items-center cursor-pointer w-9 h-9 sm:w-10 sm:h-10 rounded-full  hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
								title="Call">
								<img className="w-4 h-4 sm:w-5.5 sm:h-5.5" src={Phone} alt="Call" />
							</button>
							<button 
								className="flex justify-center items-center cursor-pointer w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
								title="Conversation Information">
								<img className="w-4.5 h-4.5 sm:w-6 sm:h-6" src={Info} alt="Info" />
							</button>
						</div>
					</div>

					{/* 2. Chat Messages Container (Scrollable Area) */}
					<div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 gap-y-2 bg-zinc-800 space-y-3 flex flex-col-reverse">
						<ChatMessage messages={messages} activeChat={activeChat} />
					</div>

					{/* 3. Bottom Chat Input Area */}
					<div className="p-3 border-t border-zinc-900 bg-zinc-800">
						<div className="flex items-end gap-3 bg-zinc-700/60 rounded-2xl p-2 border overflow-hidden border-zinc-700 focus-within:border-violet-400 transition">
							<textarea
								ref={textareaRef}
								value={messageText}
								placeholder="Type a message..."
								rows={1}
								className="w-0 grow bg-transparent text-white text-base scrollbar-none placeholder-zinc-400 resize-none outline-none px-2 py-1.5 max-h-32 overflow-y-auto"
								onInput={(e) => {
									// Kusa itong lalaki depende sa haba ng text hanggang sa max-h-32 (128px)
									e.target.style.height = "auto";
									e.target.style.height = `${e.target.scrollHeight}px`;
								}}
								onKeyDown={(e) => {
									// Magse-send kapag pinindot ang Enter (nang walang Shift)
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										sendMessage();
									}
								}}
								onChange={(e) => setMessageText(e.target.value)}
							/>
							{/* Send Button */}
							<button 
								className="flex justify-center items-center w-9 h-9 bg-violet-500 overflow-hidden hover:bg-violet-600 text-white rounded-full transition shrink-0 cursor-pointer"
								onClick={() => { sendMessage(); }}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 pl-0.5">
									<path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
								</svg>
							</button>
						</div>
					</div>
				</>
			)}
		</>
	);
}