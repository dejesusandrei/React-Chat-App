import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import SuccessModal from "../components/SuccessModal";
import app from "../firebase/firebase.config";
import '../index.css'
import backIcon from '../assets/back-icon.png'

function Signup(){
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [isPasswordMatch, setIsPasswordMatch] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const navigate = useNavigate();

	const auth = getAuth(app);
  const db = getDatabase(app);
	
	async function handleSignup(event) {
		event.preventDefault();
		
		if (password !== confirmPassword) {
			setIsPasswordMatch(true);
			return;
		}

		setIsPasswordMatch(false);
		try{
			// 1. Create account
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;

      // 2. Save the user's name in Authentication
      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

			// 3. Save user info in Realtime Database
			await set(ref(db, `users/${user.uid}`), {
				uid: user.uid,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				password: confirmPassword.trim(),
				createdAt: new Date().toISOString(),
			});

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
			setConfirmPassword("");
      setIsPasswordMatch(false);
			setIsSuccessModalOpen(true);
			console.log(userCredential.user);
		}catch(error){
			console.error(`${error.code}\n${error.message}`);
		}
	}

	
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

						<form className="mt-8 flex flex-col w-full gap-y-4.5" onSubmit={handleSignup} onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								handleSignup(e);
							}
						}}>
							<div>
								<input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder="First Name" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="Last Name" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input onChange={(e) => {
									setPassword(e.target.value)
									if (isPasswordMatch) setIsPasswordMatch(false);
								}}
								value={password}
									type="password" placeholder="Password" className="w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700" required/>
								{/* <p className="text-red-500 mt-1 text-sm">Invalid email or password</p> */}
							</div>
							<div>
								<input onChange={(e) => {
									setConfirmPassword(e.target.value)
									if (isPasswordMatch) setIsPasswordMatch(false);
								}} 
								value={confirmPassword}
								type="password" placeholder="Confirm Password" 
								className={`w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-1 focus:outline-gray-700 ${isPasswordMatch ? 'border-red-500' : 'border-gray-400'}`} required/>
								{isPasswordMatch && (<p className="text-red-500 text-sm mt-1">Passwords do not match.</p>)}
							</div>
							<button type="submit" className="w-full bg-gray-700 text-white py-2 px-4 mt-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer">Create Account</button>
						</form>

						<div className="mt-5 text-center text-gray-600">
							Already have an account? <Link to="/" className="text-blue-500 hover:underline">Sign In</Link>
						</div>

					</div>
				</section>
				<SuccessModal 
          isOpen={isSuccessModalOpen} 
					onClose={() => setIsSuccessModalOpen(false)} 
					onDashboard={() => navigate('/home')} 
					title="Account created successfully!" 
					message="Welcome to ReiChat your account has been created and you can now start connecting with your friends."
        />
      </main>
		</>
	);
}

export default Signup;