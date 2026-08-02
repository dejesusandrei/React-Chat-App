import { useState } from 'react'
import app from '../firebase.config'
import { getDatabase, ref, set, push } from 'firebase/database'

function Write() {
	const [inputValue, setInputValue] = useState('');
	const [inputValue1, setInputValue1] = useState('');

	async function saveData() {
		// Validate inputs
		if (!inputValue.trim() || !inputValue1.trim()) {
			alert("Please fill in all fields.");
			return;
		}

		try {
			const db = getDatabase(app);
			// Create a new unique reference
			const newDocRef = push(ref(db, "authentication"));
			// Save data
			await set(newDocRef, {
				fruitName: inputValue.trim(),
				fruitColor: inputValue1.trim(),
				createdAt: new Date().toISOString(),
			});
			alert("✅ Data saved successfully!");
			// Clear inputs (if using useState)
			setInputValue("");
			setInputValue1("");
		} catch (error) {
			console.error("Firebase Error:", error);
			alert(`❌ Failed to save data: ${error.message}`);
		}
	}

	return(
		<div>
			<input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
			<input type="text" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} /> <br/>

			<button onClick={saveData}>SAVE DATA</button>
		</div>
	);
}

export default Write;