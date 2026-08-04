import { Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

import Chats from "./components/Chat/Chats";
import Contacts from "./components/Contacts";
import Notifications from "./components/Notifications";

function App() {
    return(
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>}>
                {/* Redirect /home -> /home/chats */}
                <Route index element={<Navigate to="chats" replace />} />

                <Route path="chats" element={<Chats />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="notifications" element={<Notifications />} />
            </Route>

        </Routes>
    );
}

export default App
