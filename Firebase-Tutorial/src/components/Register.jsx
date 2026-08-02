import { useState } from "react";
import app from "../firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { getDatabase, ref, set } from "firebase/database";

function Register() {
  const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const auth = getAuth(app);
  const db = getDatabase(app);

  async function registerUser() {
    if (!firstName || !lastName || !email || !password) {
			alert("Please fill in all fields.");
			return;
		}

    try {
      // 1. Create account
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;

      // 2. Save the user's name in Authentication
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 3. Save user info in Realtime Database
			await set(ref(db, `users/${user.uid}`), {
				uid: user.uid,
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				createdAt: new Date().toISOString(),
			});

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      alert(`${error.code}\n${error.message}`);
    }
  }

  return (
    <div>
      <input
				type="text"
				placeholder="First Name"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Last Name"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
			/>

			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
/>

      <br /><br />

      <button onClick={registerUser}>Register</button>
    </div>
  );
}

export default Register;