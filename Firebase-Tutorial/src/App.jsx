import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Write from './components/Write'
import Read from './components/Read'
import Update from './components/Update'
import Register from './components/Register'

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
