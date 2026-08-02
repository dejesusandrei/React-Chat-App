import { useState } from "react";
import app from "../firebase/firebase.config";
import '../index.css'
import logo from '../assets/logo.png'

function Login(){

	
	return(
		<>
			<main className="w-full">
      <section className="mx-auto flex min-h-dvh max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white px-3 flex flex-col items-center">
          <div className="flex justify-center items-center w-65 sm:w-70 md:w-80"><img  src={logo} alt="Devrei Logo" className="h-auto w-full object-contain"/></div>

					<div className="text-center">
						<h2 className="text-[clamp(1.25rem,4vw,1.5rem)] font-bold font-roboto text-gray-800">Welcome to ReiChat!</h2>
						<p className="text-gray-600">Sign in to your account</p>
					</div>

					<form className="mt-8">
						<input type="email" placeholder="Email" className="w-full rounded-md border border-gray-400 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
						<input type="password" placeholder="Password" className="w-full rounded-md border border-gray-400 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
						<button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors cursor-pointer">Sign In</button>
					</form>

					<div className="mt-8 w-full border-b border-gray-400 relative"><p className="absolute font-roboto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">or</p></div>

        </div>
      </section>
    </main>
		</>
	);
}

export default Login;