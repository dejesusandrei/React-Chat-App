import { Routes, Route } from 'react-router-dom'
import './index.css'

import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return(
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App
