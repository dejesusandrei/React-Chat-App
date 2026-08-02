import { useState } from "react";
import app from "../firebase/firebase.config";
import { Link } from "react-router-dom";
import '../index.css'
import logo from '../assets/logo.png'

function SignIn(){

	
	return(
		<>
			<title>Sign In | ReiChat</title>
			<main className="w-full">
      <section className="mx-auto flex min-h-dvh max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white px-5 flex flex-col items-center py-6">

          <div className="flex justify-center items-center w-65 sm:w-70 md:w-80"><img  src={logo} alt="Devrei Logo" className="h-auto w-full object-contain"/></div>

					<div className="text-center">
						<h2 className="text-[clamp(1.5rem,4vw,2rem)] font-bold font-roboto text-gray-800">Welcome back</h2>
						<p className="text-gray-600 mt-1">Sign in to continue chatting with your friends</p>
					</div>

					<form className="mt-8 flex flex-col w-full gap-y-4.5">
						<div>
							<input type="email" placeholder="Email" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700"/>
							{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
						</div>
						<div>
							<input type="password" placeholder="Password" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700"/>
							{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							<div className="flex justify-end">
								<Link to="/forgot-password" className="text-blue-500 text-sm mt-2 hover:underline">Forgot password?</Link>
							</div>
						</div>
						<button type="submit" className="w-full bg-gray-700 text-white py-2 px-4 mt-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer">Sign In</button>
					</form>

					<div className="mt-8 w-full border-b border-gray-400 relative"><p className="absolute font-roboto text-center text-gray-600 w-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">or</p></div>

					<div className="mt-8 w-full">
						<Link to="/signup" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors cursor-pointer text-center block">Continue with Google</Link>
					</div>

					<div className="mt-8 text-center text-gray-600">
						Dont have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
					</div>
        </div>
      </section>
    </main>
		</>
	);
}

export default SignIn;