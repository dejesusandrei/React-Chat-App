import { useState } from 'react';

import addFriend from '../../assets/add-friend-gray.png'
import search from '../../assets/search.png'
import noChats from '../../assets/conversation.png'

import SuggestedFriends from '../Contact/SuggestedFriends'


export default function Contacts(){
	const [filter, setFilter] = useState('all');
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
				<div className='w-full flex gap-y-2 items-center mt-5 font-poppins'>
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
					className={ `text-blacktext-[17px] font-semibold px-5 py-2.5 cursor-pointer ${filter === 'offline' ? `border-b border-white dark:text-white` : 'dark:text-zinc-400 hover:text-white'}`}>
						Offline
					</button>
					<button 
					onClick={() => setFilter('request')}
					className={ `text-black text-[17px] font-semibold px-5 py-2.5 cursor-pointer ${filter === 'request' ? `border-b border-white dark:text-white` : 'dark:text-zinc-400 hover:text-white'}`}>
						Request
					</button>
				</div>

				<main className='flex flex-col mt-15'>
					<section className='flex grow w-full justify-center items-center pb-7 pt-3 border-b border-zinc-700'>
						<div className='flex flex-col items-center gap-1'>
							{/* <div className='flex justify-center items-center'><img src={noChats} alt="No Conversation" /></div> */}
							<h2 className="text-[24px] font-roboto font-semibold mt-1 text-black dark:text-white">No friends yet</h2>
							<p className="text-sm font-roboto text-black dark:text-zinc-400 max-w-75 text-center">Add friends and start connecting with people.</p>
						</div>
					</section>

					<SuggestedFriends />
				</main>

				
			</div>
		</>
	);
}