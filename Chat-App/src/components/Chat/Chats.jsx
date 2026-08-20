import { useEffect, useState, useContext } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";


import searchIcon from '../../assets/search.png'
import ChatList from './ChatList'

export default function Chats(){
	const { user } = useContext(AuthContext);
	const db = getDatabase(app);
	const [search, setSearch] = useState("");

	return(
		<>
			<div className='flex flex-col h-full min-h-0 overflow-hidden pb-6'>
				<header className="flex flex-col">
						<div className="header ">
							<h1 className="text-[25px] font-roboto font-bold text-black dark:text-white">Chats</h1>
						</div>
						<div className='flex justify-start mt-5'>
							<button className='flex justify-center items-center pl-4 pr-2 border border-r-0 border-zinc-400 rounded-l-lg cursor-pointer'>
								<img className='shrink-0 w-4 h-4 sm:w-5 sm:h-5' src={searchIcon} alt="Search" />
							</button>
							<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)} 
							className='h-auto w-0 grow px-1 py-2.5 text-sm sm:text-[16px] text-black dark:text-zinc-200 outline-0 border border-l-0 border-zinc-400 rounded-r-lg' placeholder='Search ReiChats' />
						</div>
				</header>

				<section className='flex-1 min-h-0 overflow-y-auto scrollbar-none mt-4 flex flex-col w-full'>
					<ChatList search={search} db={db}/>
				</section>
			</div>
		</>
	);
}