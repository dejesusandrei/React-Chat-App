import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function ChatMessage({messages, activeChat}){
	const { user } = useContext(AuthContext);
	return(
		<>
			{messages.length === 0 ? (
				<div className="flex grow items-center justify-center text-zinc-400 text-sm">
					{`Say hi to ${activeChat?.firstName || 'your friend'}! 👋`}
				</div>
			) : (
				messages.map((msg) => {
					const isMe = msg.senderId === user?.uid;
					return (
						<div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
							<div className={`p-3 rounded-2xl max-w-[75%] wrap-break-word text-white ${isMe ? "bg-violet-600 rounded-br-none" : "bg-zinc-700 rounded-bl-none"}`}>
								<p className="text-sm">{msg.text}</p>
							</div>
						</div>
					);
				})
			)}
		</>
	);
}