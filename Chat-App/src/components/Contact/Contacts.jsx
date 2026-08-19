import { useContext, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ref, set, update, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";
import SuggestedFriends from '../Contact/SuggestedFriends'
import FriendList from './FriendList';
import Request from './Request';
import '../../index.css'

import noChats from '../../assets/conversation.png'
import addFriend from '../../assets/add-friend-gray.png'
import searchIcon from '../../assets/search.png'
import dots from '../../assets/dots.png'
import unfriend from '../../assets/unfriend.png'

export default function Contacts(){
	const { user } = useContext(AuthContext);
	const db = getDatabase(app);

	const { setOpenModal, openModal } = useOutletContext() || {};

	const [userFriends, setUserFriends] = useState([]);
	const [filter, setFilter] = useState('all');
	const [friendRequests, setFriendRequests] = useState([]);
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");

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
        return <FriendList userFriends={userFriends} users={users} filterType="online" user={user} db={db}/>;
      case 'all':
      default:
        return <FriendList userFriends={userFriends} users={users} filterType="all" user={user} db={db} search={search.toLowerCase()} />;
    }
  };

	return(
		<>
			<div className='relative flex flex-col h-full min-h-0 overflow-hidden'>
				<header className="flex flex-col ">
					<div className="header flex justify-between items-center">
						<h1 className="text-[25px] font-roboto font-bold text-black dark:text-white">Contacts</h1>
						<button 
						onClick={() => setOpenModal((prev) => !prev)}
							className='flex justify-center items-center pl-4 pr-4  cursor-pointer'>
							<img className='w-5 h-5  sm:w-5.5 sm:h-5.5 shrink-0' src={addFriend} alt="Add Friend" />
						</button>
					</div>
					<div className='flex justify-start mt-5'>
						<button className='flex justify-center items-center pl-4 pr-2 border border-r-0 border-zinc-400 rounded-l-lg cursor-pointer'>
							<img className='w-4 h-4 sm:w-5 sm:h-5 shrink-0' src={searchIcon} alt="Search" />
						</button>
						<input value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='h-auto grow px-1 py-2.5 w-0 text-sm sm:text-[16px] text-black dark:text-zinc-200 outline-0 border border-l-0 rounded-r-lg  border-zinc-400' 
						type="text" placeholder='Search username' />
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


				<main className='flex flex-col flex-1 h-full min-h-0 overflow-y-auto scrollbar-none'>
					<section className='flex shrink-0 w-full justify-center items-center pb-7  pt-3 border-b border-zinc-700'>
						{renderContent()}
					</section>
					<SuggestedFriends />
				</main>
			</div>
		</>
	);
}