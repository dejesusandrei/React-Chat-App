import { useEffect, useState, useContext } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../context/AuthProvider";
import '../../index.css'
import { getRandomDarkColor } from '../../utility/getRandomDarkColor'

import addFriend from '../../assets/add-friend.png'

export default function SuggestedFriends(){
	const darkColors = [
		'bg-violet-700',
		'bg-indigo-700',
		'bg-blue-700',
		'bg-emerald-700',
		'bg-rose-700',
		'bg-slate-700',
		'bg-amber-700'
	];
	// Pili ng random class
	const randomDarkBg = darkColors[Math.floor(Math.random() * darkColors.length)];

	const { user } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	const db = getDatabase(app);

	useEffect(() =>{
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

		// Pag nag exit si user sa page nag off ang pag get ng users
		return () => unsubscribe();
	}, []);
	const suggestedFriends = users.filter(u => u.uid !== user.uid);


	return(
		<>
			{suggestedFriends.length >= 1 ? (
				<div className="flex flex-col justify-center mt-5 gap-y-3">
					<div className="text-black dark:text-white font-semibold text-[16.5px]">
						People you may know
					</div>

					{suggestedFriends.map((friend) =>{
						return(
							<div key={friend?.uid} className= 'flex gap-2.5 items-center grow h-12.5'>
								<div className="image flex justify-center items-center text-white font-semibold w-10 h-10 rounded-full" style={{backgroundColor: friend?.avatarColor}}>
									{friend?.firstName[0].toUpperCase()}
								</div>
								<div className="flex flex-col justify-center font-roboto grow">
									<p className="font-bold text-[14px] text-white">{`${friend?.firstName} ${friend?.lastName}`}</p>
									<p className="text-[13px] text-gray-200 mb-1">{friend?.email}</p>
								</div>
								<button className="flex justify-center items-center px-3.5 py-2 gap-x-2 bg-zinc-100 rounded-lg  cursor-pointer">
									<div className='flex justify-center items-center'><img className='w-5 h-5' src={addFriend} alt="Add Friend"/></div>
									<p className="text-[14px] font-roboto font-semibold text-white dark:text-zinc-900">Add</p>
								</button>
							</div>
						);
					})}
				</div>
			): ''}
		</>
	);
}