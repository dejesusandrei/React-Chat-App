import { useContext, useEffect, useState } from 'react';
import { ref, set, update, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";
import SuggestedFriends from '../Contact/SuggestedFriends'
import '../../index.css'

import noChats from '../../assets/conversation.png'
import addFriend from '../../assets/add-friend-gray.png'
import search from '../../assets/search.png'
import dots from '../../assets/dots.png'

function Request({user, db, users, setUsers, friendRequests, setFriendRequests}){
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

export function FriendList({userFriends, users, filterType = 'all'}){
	const filteredFriends = userFriends.filter((friendUid) => {
    const friendData = users[friendUid];
    if (!friendData) return false;
    const isUserOnline = Boolean(friendData.isOnline);
    if (filterType === 'online') {
      return isUserOnline === true; 
    }
    return true; // 'all' tab
  });

  const emptySubtitles = {
    all: "Add friends and start connecting with people.",
    online: "None of your friends are currently online.",
  };
	return(
		<>
			{filteredFriends.length === 0 ? (
				<div className='flex flex-col items-center gap-1 mt-13 w-full min-w-0 overflow-hidden'>
					<p className=" font-roboto text-black dark:text-zinc-400 text-[14px] sm:text-[15px] text-center w-full truncate">{emptySubtitles[filterType]}</p>
				</div>
			) : (
				<div className="flex flex-col justify-center w-full gap-y-1 overflow-scroll scrollbar-none">
					{filteredFriends.map((friendUid) =>{
						const friendData = users[friendUid];
						const isOnline = Boolean(friendData?.isOnline);
						return(
							<div key={friendUid} className= 'flex gap-2.5 items-center grow h-12.5 mt-2'>
								<div className="relative shrink-0">
                  <div className="image flex justify-center items-center text-white font-semibold w-10 h-10 rounded-full"style={{ backgroundColor: friendData?.avatarColor || "#4B5563" }}>
										{friendData?.firstName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-gray-500"}`}/>
                </div>
								<div className="flex flex-col text-left font-roboto flex-1 min-w-0 overflow-hidden">
									<p className="font-bold text-[14px] text-white truncate">{`${friendData?.firstName} ${friendData?.lastName}`}</p>
									<p className={`text-[13px] mb-1 font-semibold ${isOnline ? "text-green-500" : "text-gray-400"}`}>{isOnline ? "Online" : "Offline"}</p>
								</div>
								<button
								className='flex justify-center items-center px-3.5 py-2 gap-x-2 rounded-lg cursor-pointer'>
									<img className='w-5 h-5 shrink-0' src={dots} alt="Dots" />
								</button>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}

export default function Contacts(){
	const { user } = useContext(AuthContext);
	const [userFriends, setUserFriends] = useState([]);
	const [filter, setFilter] = useState('all');
	const [friendRequests, setFriendRequests] = useState([]);
	const [users, setUsers] = useState([]);
	const db = getDatabase(app);

	useEffect(() =>{
		if (!user?.uid) return;

		// Get Users
		const userRef = ref(db, ('users'));
		const unsubscribe = onValue(userRef, (snapshot) => {
			if(snapshot.exists()){ setUsers(snapshot.val()); }
		})

		// get requests
		const requestRef = ref(db, (`friendRequests/${user.uid}`));
		const unsubscribeRequests = onValue(requestRef, (snapshot) =>{
			if(snapshot.exists()){
				const data = snapshot.val();

				const incomingList = Object.entries(data)
					.filter(([_, value]) => value?.status === 'received')
					.map(([senderUid, value]) => ({
						senderUid,
						timestamp: value.timestamp,
					}));
				
				setFriendRequests(incomingList);
			}else{ setFriendRequests([]); }
		});

		// Get Friends
		const friendsRef = ref(db, `friends/${user.uid}`);
		const unsubscribeFriends = onValue(friendsRef, (snapshot) =>{
			if (snapshot.exists()) {
        const data = snapshot.val();
        const friendUids = Object.keys(data);
        setUserFriends(friendUids);
      } else {
        setUserFriends([]);
      }
		});

		return () =>{
			unsubscribe();
			unsubscribeRequests();
			unsubscribeFriends();
		}
	}, [user?.uid, db]);

	const renderContent = () => {
    switch (filter) {
      case 'requests':
        return (
          <Request user={user} db={db} users={users} setUsers={setUsers} friendRequests={friendRequests} setFriendRequests={setFriendRequests}/>
        );
      case 'online':
        return <FriendList userFriends={userFriends} users={users} filterType="online" />;
      case 'all':
      default:
        return <FriendList userFriends={userFriends} users={users} filterType="all" />;
    }
  };

	return(
		<>
			<div className='h-full'>
				<header className="flex flex-col ">
					<div className="header ">
						<h1 className="text-[25px] font-roboto font-bold text-black dark:text-white">Contacts</h1>
					</div>
					<div className='flex justify-start mt-5'>
						<button className='flex justify-center items-center pl-4 pr-2 border border-r-0 border-zinc-400 rounded-l-lg cursor-pointer'>
							<img className='w-5 h-5 shrink-0' src={search} alt="Search" />
						</button>
						<input className='h-auto grow px-1 py-2.5 w-0 text-[16px] text-black dark:text-zinc-200 outline-0 border border-l-0 border-r-0 border-zinc-400' 
						type="text" placeholder='Search username' />
						<button 
						className='flex justify-center items-center pl-4 pr-4 border border-l-0 border-zinc-400 rounded-r-lg cursor-pointer'>
							<img className='w-5 h-5 shrink-0' src={addFriend} alt="Add Friend" />
						</button>
					</div>
				</header>

				<div className="w-full flex gap-y-2 items-center mt-5 font-poppins">
        {['all', 'online', 'requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
						className={`relative flex items-center gap-x-2 capitalize text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${
            filter === tab? 'border-b border-white text-black dark:text-white': 'text-black dark:text-zinc-400 hover:text-white'}`}>
            <span>{tab}</span>
						{tab === 'requests' && friendRequests.length > 0 && (<span className="flex items-center justify-center min-w-5 h-5 pr-0.5 text-[12px] font-bold text-white bg-red-500 rounded-full">{friendRequests.length}</span>)}
          </button>
				))}
				</div>


				<main className='flex flex-col '>
					<section className='flex grow w-full justify-center items-center pb-7 pt-3 border-b border-zinc-700'>
						{renderContent()}
					</section>
					<SuggestedFriends />
				</main>
				
			</div>
		</>
	);
}