import { useState } from 'react'
import app from '../firebase.config'
import { getDatabase, ref, get } from 'firebase/database'

function Read() {
	let [fruits, setFruits] = useState([]);

	async function fetchData() {
		try {
			const db = getDatabase(app);
			// Create a new unique reference
			const dbRef = ref(db, "nature/fruits");

			const snapshot = await get(dbRef);
			snapshot ? setFruits(Object.values(snapshot.val())) : setFruits([]);

			alert("✅ Data displayed successfully!");
		} catch (error) {
			console.error("Firebase Error:", error);
			alert(`❌ Failed to display data: ${error.message}`);
		}
	}

	return(
		<div>
			<button onClick={fetchData}>Display Data</button>
			<ul>
				{fruits.map((fruit, index) => (
					<li key={index}>{fruit.fruitName}: {fruit.fruitColor}</li>
				))}
			</ul>
		</div>
	);
}

export default Read;