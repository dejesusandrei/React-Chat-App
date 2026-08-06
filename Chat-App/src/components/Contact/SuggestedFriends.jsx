import { useEffect, useState, useContext } from "react";
import { ref, set, update, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";
import '../../index.css'
import { getRandomDarkColor } from '../../utility/getRandomDarkColor'

import addFriend from '../../assets/add-friend.png'

export default function SuggestedFriends(){
	const { user } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	const [userFriends, setUserFriends] = useState({});
	const [sentRequests, setSentRequests] = useState({});
	const [loadingUid, setLoadingUid] = useState(null);
	const db = getDatabase(app);

	useEffect(() =>{
		if (!user?.uid) return;

		// Get all users
		const usersRef = ref(db, "users");
		const unsubscribe = onValue(usersRef, (snapshot) =>{
			if(snapshot.exists()){
				const data = snapshot.val();
				const usersArray = Object.entries(data).map(([uid, value]) => ({
					uid,
					...value
				}));
				setUsers(usersArray);
			}
		});

		// Get Friends
		const friendsRef = ref(db, `friends/${user.uid}`);
		const unsubscribeFriends = onValue(friendsRef, (snapshot) =>{
			setUserFriends(snapshot.exists() ? snapshot.val() : {})
		});

		// Get all request
		const requestRef = ref(db, `friendRequests/${user.uid}`);
		const unsubscribeRequests = onValue(requestRef, (snapshot) => {
			if(snapshot.exists()){
				setSentRequests(snapshot.val());
			}else{ setSentRequests({});}
		});

		// Pag nag exit si user sa page nag off ang pag get ng users
		return () => {
			unsubscribe();
			unsubscribeRequests();
			unsubscribeFriends();
		};

	}, [user?.uid, db]);

	const suggestedFriends = users.filter(u => 
		u.uid !== user?.uid && 
		sentRequests[u.uid]?.status !== "received" &&
		userFriends[u.uid]?.status !== "friends"
	);
	/*
	 * * Handles Sending / Canceling Friend Requests sa Firebase
	 */
	async function handleToggleFriendRequest(targetUid){
		if (!user?.uid || !targetUid) return;
		setLoadingUid(targetUid);

		const requestRefSender = ref(db, `friendRequests/${user.uid}/${targetUid}`);
		const requestRefReceiver = ref(db, `friendRequests/${targetUid}/${user.uid}`);

		try {
			const isAlreadySent = sentRequests[targetUid]?.status === "sent";
			const updates = {};

			if (isAlreadySent) {
				updates[`friendRequests/${user.uid}/${targetUid}`] = null;
				updates[`friendRequests/${targetUid}/${user.uid}`] = null;
				await update(ref(db), updates);
			} else {
				// Kapag 'Add Friend' - I-save sa Firebase database
				const timestamp = Date.now();
				updates[`friendRequests/${user.uid}/${targetUid}`] = { status: "sent", timestamp };
				updates[`friendRequests/${targetUid}/${user.uid}`] = { status: "received", timestamp };
				await update(ref(db), updates);
			}
		} catch (error) {
			console.error("Error updating friend request:", error);
		}finally{
			setLoadingUid(null);
		}
	}


	return(
		<>
			{suggestedFriends.length >= 1 ? (
				<div className="flex flex-col justify-center mt-5 gap-y-3 overflow-scroll scrollbar-none">
					<div className="text-black dark:text-white font-semibold text-[16.5px]">
						People you may know
					</div>

					{suggestedFriends.map((friend) =>{
						const isRequested = sentRequests[friend?.uid]?.status === "sent";
						const isLoading = loadingUid === friend?.uid;

						return(
							<div key={friend?.uid} className= 'flex gap-2.5 items-center grow h-12.5'>
								<div className="image flex justify-center items-center text-white font-semibold w-10 h-10 rounded-full" style={{backgroundColor: friend?.avatarColor || "#4B5563"}}>
									{friend?.firstName?.[0]?.toUpperCase() || "?"}
								</div>
								<div className="flex flex-col justify-center font-roboto grow">
									<p className="font-bold text-[14px] text-white">{`${friend?.firstName || "User"} ${friend?.lastName || ""}`}</p>
									<p className="text-[13px] text-gray-200 mb-1">{friend?.email || ""}</p>
								</div>
								<button onClick={() => handleToggleFriendRequest(friend?.uid)} 
								disabled={isLoading}
								type="button"
								className={`flex justify-center items-center px-3.5 py-2 gap-x-2 rounded-lg cursor-pointer ${
                  isRequested ? 'bg-zinc-700 text-white': 'bg-zinc-100 dark:bg-zinc-100 hover:bg-zinc-300'}`}>
									{/* <div className='flex justify-center items-center'><img className='w-5 h-5' src={addFriend} alt="Add Friend"/></div> */}
									<p className={`text-[14px] font-roboto font-semibold ${isRequested ? 'text-white' : 'text-zinc-900' }`}>
                    {isRequested ? 'Cancel Request' : 'Add friend'}
                  </p>
								</button>
							</div>
						);
					})}
				</div>
			): ''}
		</>
	);
}