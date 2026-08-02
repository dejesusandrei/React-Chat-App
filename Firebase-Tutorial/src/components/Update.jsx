import { useState } from 'react'
import app from '../firebase.config'
import { getDatabase, ref, get } from 'firebase/database'

function Update() {
	let [fruits, setFruits] = useState([]);

	async function fetchData() {
		try {
			const db = getDatabase(app);
			const dbRef = ref(db, "nature/fruits");
			const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fruitsArray = Object.keys(data).map((key) => ({
          fruitId: key,
          ...data[key],
        }));
        setFruits(fruitsArray);
      } 
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
					<li key={index}>{fruit.fruitName}: {fruit.fruitColor}: {fruit.fruitId}</li>
				))}
			</ul>
		</div>
	);
}

export default Update;