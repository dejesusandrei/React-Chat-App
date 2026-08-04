import { NavLink } from 'react-router-dom';

import addFriend from '../../assets/add-friend.png'
import search from '../../assets/search.png'
import noChats from '../../assets/conversation.png'

export default function Chats(){
	return(
		<>
			<div className='flex flex-col h-full pb-6'>
				<header className="flex flex-col ">
						<div className="header ">
							<h1 className="text-[25px] font-roboto font-bold text-black dark:text-white">Chats</h1>
						</div>
						<div className='flex justify-start mt-5'>
							<button className='flex justify-center items-center pl-4 pr-2 border border-r-0 border-zinc-400 rounded-l-lg cursor-pointer'>
								<img className='w-5 h-5' src={search} alt="Search" />
							</button>
							<input className='h-auto grow px-1 py-2.5 text-[16px] text-black dark:text-zinc-200 outline-0 border border-l-0 border-zinc-400 rounded-r-lg' type="text" placeholder='Search ReiChats' />
						</div>
				</header>

				<section className='flex mt-4 grow w-full justify-center items-center'>
					<div className='flex flex-col items-center gap-1'>
						<div className='flex justify-center items-center'><img src={noChats} alt="No Conversation" /></div>
						<h2 className="text-[22px] font-roboto font-semibold mt-2 text-black dark:text-white">No conversation yet</h2>
						<p className="text-sm font-roboto text-black dark:text-zinc-400 max-w-75 text-center">Start a conversation by adding a friend to send messages, share media, and keep in touch.</p>

						<NavLink to="../contacts" className=" flex justify-center items-center gap-x-2 mt-6 bg-white rounded-xl px-6 py-3 cursor-pointer">
							<div className='flex justify-center items-center'><img className='w-7 h-7' src={addFriend} alt="Add Friend"/></div>
							<p className="text-[16px] font-roboto font-semibold text-white dark:text-zinc-900">Add Friend</p>
						</NavLink>
					</div>
				</section>
			</div>
		</>
	);
}