import { useState } from "react";
import { Link } from "react-router-dom";
import app from "../firebase/firebase.config";
import '../index.css'
import backIcon from '../assets/back-icon.png'

function Signup(){

	
	return(
		<>
			<title>Sign Up | ReiChat</title>
			<main className="w-full">
				<section className="mx-auto flex min-h-dvh max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
					<div className="w-full max-w-md bg-white px-5 flex flex-col items-center py-6">

						<Link to="/" className="w-full flex justify-start cursor-pointer">
							<img src={backIcon} alt="Back" className="w-8 object-contain" />
						</Link>

						<div className="text-center mt-5">
							<h2 className="text-[clamp(1.5rem,4vw,2rem)] font-bold font-roboto text-gray-800">Create an account</h2>
							<p className="text-gray-600 mt-1">SJoin ReiChat and start connecting with your friends</p>
						</div>

						<form className="mt-8 flex flex-col w-full gap-y-4.5">
							<div>
								<input type="text" placeholder="First Name" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input type="text" placeholder="Last Name" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input type="email" placeholder="Email" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input type="password" placeholder="Password" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input type="password" placeholder="Confirm Password" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Passwords do not match</p> */}
							</div>
							<button type="submit" className="w-full bg-gray-700 text-white py-2 px-4 mt-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer">Create Account</button>
						</form>

						<div className="mt-5 text-center text-gray-600">
							Already have an account? <Link to="/" className="text-blue-500 hover:underline">Sign In</Link>
						</div>

					</div>
				</section>
      </main>
		</>
	);
}

export default Signup;