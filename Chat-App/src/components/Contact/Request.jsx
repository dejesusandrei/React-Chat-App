import { useEffect, useState } from 'react';
import { ref, update } from "firebase/database";

export default function Request({user, db, users, setUsers, friendRequests, setFriendRequests}){
	const [loadingUid, setLoadingUid] = useState(null);

	async function handleAcceptRequest(senderUid){
		if (!user?.uid || !senderUid) return;
		try {
			const updates = {};
			const timestamp = Date.now();

			updates[`friends/${user.uid}/${senderUid}`] = { status: "friends", addedAt: timestamp}
			updates[`friends/${senderUid}/${user.uid}`] = { status: "friends", addedAt: timestamp}

			// Remove the request
			updates[`friendRequests/${user.uid}/${senderUid}`] = null;
      updates[`friendRequests/${senderUid}/${user.uid}`] = null;

			await update(ref(db), updates);
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}finally{
			setLoadingUid(null);
		}
	}

	async function handleDeclineRequest(senderUid){
		if (!user?.uid || !senderUid) return;
		try {
			const updates = {};
			// Remove the request
			updates[`friendRequests/${user.uid}/${senderUid}`] = null;
      updates[`friendRequests/${senderUid}/${user.uid}`] = null;

			await update(ref(db), updates);
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}finally{
			setLoadingUid(null);
		}
	}

	return(
		<>
			{friendRequests.length === 0 ? (
				<div className="flex flex-col items-center mt-13 w-full min-w-0 overflow-hidden">
					<p className="font-roboto text-black dark:text-zinc-400 max-w-75 text-[14px] sm:text-[15px] text-center w-full truncate">
						You have no pending requests.
					</p>
				</div>
				) :
				(
				<div className="flex flex-col justify-center w-full gap-y-3 mt-2 overflow-scroll scrollbar-none">
					<div className="text-black dark:text-white font-semibold text-[16.5px]">
						<p className='truncate'>Friend Requests ({friendRequests.length})</p>
					</div>

					{friendRequests.map(({senderUid}) =>{
						const sender = users[senderUid];
						return(
							<div key={senderUid} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-900/50 sm:bg-transparent border border-zinc-800/40 sm:border-none transition-all">
                {/* User Details */}
								<div className="flex items-center gap-3 min-w-0 flex-1">
									{/* Avatar */}
									<div 
										className="flex shrink-0 justify-center items-center text-white font-semibold w-11 h-11 rounded-full text-base" style={{ backgroundColor: sender?.avatarColor || "#4B5563" }}>
										{sender?.firstName?.[0]?.toUpperCase() || "?"}
									</div>
									<div className="flex flex-col justify-center font-roboto min-w-0 flex-1">
										<p className="font-bold text-[14px] text-white truncate">{sender ? `${sender.firstName} ${sender.lastName}` : "Loading user..."}</p>
										<p className="text-[13px] text-gray-400 truncate">{sender?.email || ""}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
									<button 
										onClick={() => handleAcceptRequest(senderUid)}
										disabled={loadingUid === senderUid}
										type="button"
										className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-zinc-100 hover:bg-zinc-300 dark:bg-zinc-100 dark:hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors disabled:opacity-50">
										<p className="text-[13px] sm:text-[14px] font-roboto font-semibold text-zinc-900">Accept</p>
									</button>

									<button 
										onClick={() => handleDeclineRequest(senderUid)}
										disabled={loadingUid === senderUid}
										type="button"
										className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg cursor-pointer transition-colors disabled:opacity-50">
										<p className="text-[13px] sm:text-[14px] font-roboto font-semibold text-zinc-200">Decline</p>
									</button>
								</div>
            </div>
						);
					})}
				</div>
				)
			}
		</>
	);
}