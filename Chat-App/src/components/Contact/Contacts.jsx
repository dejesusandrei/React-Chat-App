import { useState } from 'react';
import { ref, set, update, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";

import addFriend from '../../assets/add-friend-gray.png'
import search from '../../assets/search.png'
import noChats from '../../assets/conversation.png'

import SuggestedFriends from '../Contact/SuggestedFriends'

function Request(){
	const [getfriendsRequests, setGetFriendRequests] = useState([]);
	const db = getDatabase(app);

	return(
		<>
			{/* <div className="flex flex-col items-center gap-1">
				<h2 className="text-[24px] font-roboto font-semibold mt-1 text-black dark:text-white">
					Friend Requests
				</h2>
				<p className="text-sm font-roboto text-black dark:text-zinc-400 max-w-75 text-center">
					You have no pending requests.
				</p>
			</div> */}

			<div className="flex flex-col justify-center w-full gap-y-3 mt-2 overflow-scroll scrollbar-none">
					<div className="text-black dark:text-white font-semibold text-[16.5px]">
						<p>Frind Requests (3)</p>
					</div>
							<div className= 'flex gap-2.5 items-center grow h-12.5'>
								<div className="image flex justify-center items-center text-white font-semibold w-10 h-10 rounded-full">
									M
								</div>
								<div className="flex flex-col justify-center font-roboto grow">
									<p className="font-bold text-[14px] text-white">Marjea Sacdalan</p>
									<p className="text-[13px] text-gray-200 mb-1">Jea@gmail.com</p>
								</div>
								<button className="flex justify-center items-center px-3.5 py-2 gap-x-2 bg-zinc-100 rounded-lg  cursor-pointer">
									<p className="text-[14px] font-roboto font-semibold text-white dark:text-zinc-900">Accept</p>
								</button>
								<button className="flex justify-center items-center px-3.5 py-2 gap-x-2 bg-zinc-800 rounded-lg border border-zinc-300  cursor-pointer">
									<p className="text-[14px] font-roboto font-semibold text-black dark:text-zinc-200">Decline</p>
								</button>
							</div>
				</div>
		</>
	);
}

export function All(){
	return(
		<>
			<div className='flex flex-col items-center gap-1 mt-13'>
				{/* <div className='flex justify-center items-center'><img src={noChats} alt="No Conversation" /></div> */}
				<h2 className="text-[24px] font-roboto font-semibold mt-1 text-black dark:text-white">No friends yet</h2>
				<p className="text-sm font-roboto text-black dark:text-zinc-400 max-w-75 text-center">Add friends and start connecting with people.</p>
			</div>
		</>
	);
}

export default function Contacts(){
	const [filter, setFilter] = useState('all');

	const renderContent = () => {
    switch (filter) {
      case 'request':
        return <Request />;
      case 'online':
        return <p className="text-zinc-400 mt-13">No online friends.</p>;
      case 'offline':
        return <p className="text-zinc-400 mt-13">No offline friends.</p>;
      case 'all':
      default:
        return <All />;
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
							<img className='w-5 h-5' src={search} alt="Search" />
						</button>
						<input className='h-auto grow px-1 py-2.5 text-[16px] text-black dark:text-zinc-200 outline-0 border border-l-0 border-r-0 border-zinc-400' 
						type="text" placeholder='Search username' />
						<button 
						className='flex justify-center items-center pl-4 pr-4 border border-l-0 border-zinc-400 rounded-r-lg cursor-pointer'>
							<img className='w-5 h-5' src={addFriend} alt="Add Friend" />
						</button>
					</div>
				</header>

				{/* FILTERS */}
				{/* <div className='w-full flex gap-y-2 items-center mt-5 font-poppins'>
					<button 
					onClick={() => setFilter('all')}
					className={ `text-black text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${filter === 'all' ? `border-b border-white dark:text-white` : 'dark:text-zinc-400 hover:text-white'}`}>
						All
					</button>
					<button 
					onClick={() => setFilter('online')}
					className={ `text-black text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${filter === 'online' ? `border-b border-white dark:text-white` : 'dark:text-zinc-400 hover:text-white'}`}>
						Online
					</button>
					<button 
					onClick={() => setFilter('offline')}
					className={ `text-black text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${filter === 'offline' ? `border-b border-white dark:text-white` : 'dark:text-zinc-400 hover:text-white'}`}>
						Offline
					</button>
					<button 
					onClick={() => setFilter('request')}
					className={ `text-black text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${filter === 'request' ? `border-b border-white dark:text-white` : 'dark:text-zinc-400 hover:text-white'}`}>
						Request
					</button>
				</div> */}

				<div className="w-full flex gap-y-2 items-center mt-5 font-poppins">
        {['all', 'online', 'offline', 'request'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`capitalize text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${ filter === tab ? 'border-b border-white text-black dark:text-white': 'text-black dark:text-zinc-400 hover:text-white'}`}>
            {tab}
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