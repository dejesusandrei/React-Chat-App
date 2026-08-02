import { Routes, Route } from 'react-router-dom'
import './index.css'

import Signup from './pages/Signup'
import SignIn from './pages/SignIn'

function App() {
    return(
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    );
}

export default App
