import { useContext, Fragment } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { formatShortTime } from "../../utility/formatShortTime";
import { formatTimeAMPM } from '../../utility/formatTimeAMPM'

export default function ChatMessage({messages, activeChat}){
	const { user } = useContext(AuthContext);
	return(
		<>
			{messages.length === 0 ? (
				<div className="flex grow items-center justify-center text-zinc-400 text-sm truncate">
					{`Say hi to ${activeChat?.firstName || 'your friend'}! 👋`}
				</div>
			) : (
				<div className="flex flex-col space-y-2">
					{messages.map((msg, i) => {
						const isMe = msg.senderId === user?.uid;
						const prevMsg = messages[i - 1];

						// Ipakita lang ang oras kung unang message O iba ang sender O lampas 5 mins ang agwat
						const showTime = i === 0 || prevMsg?.senderId !== msg.senderId ||
							(msg.timestamp - prevMsg?.timestamp > 10 * 60 * 1000);

						return (
							<Fragment key={msg.id || i}>
								{showTime && msg.timestamp && (
									<div className="text-center text-xs sm:text-sm text-zinc-500 my-2">
										{formatTimeAMPM(msg.timestamp)}
									</div>
								)}
								<div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
									<div className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[70%] text-white text-sm sm:text-base leading-relaxed wrap-break-words whitespace-pre-wrap ${isMe ? "bg-violet-600 rounded-br-none" : "bg-zinc-700 rounded-bl-none"}`}>
										{msg.text}
									</div>
								</div>
							</Fragment>
						);
					})}
				</div>
			)}
		</>
	);
}