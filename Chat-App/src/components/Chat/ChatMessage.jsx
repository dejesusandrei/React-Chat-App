import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { formatShortTime } from "../../utility/formatShortTime";

export default function ChatMessage({messages, activeChat}){
	const { user } = useContext(AuthContext);
	return(
		<>
			{messages.length === 0 ? (
				<div className="flex grow items-center justify-center text-zinc-400 text-sm truncate">
					{`Say hi to ${activeChat?.firstName || 'your friend'}! 👋`}
				</div>
			) : (
				[...messages].reverse().map((msg) => {
					const isMe = msg.senderId === user?.uid;
					return (
					<>
						<div key={msg.id} className={`flex m-0 w-full ${isMe ? "justify-end" : "justify-start"}`}>
							<div className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[70%] text-white text-sm sm:text-base leading-relaxed wrap-break-words whitespace-pre-wrap ${isMe ? "bg-violet-600 rounded-br-none" : "bg-zinc-700 rounded-bl-none"}`}>
								<p className="text-sm sm:text-base wrap-break-words">{msg.text}</p>
							</div>
						</div>
						<div className="flex justify-center items-center text-zinc-400">4:39 PM</div>
					</>
					);
				})
			)}
		</>
	);
}