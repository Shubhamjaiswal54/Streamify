import React from 'react'
import { Route, Routes } from 'react-router'
import { HomePage } from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OnboradingPage from './pages/OnboradingPage'
import CallPage from './pages/CallPage'
import NortificationPage from './pages/NortificationPage'
import Toster, { toast, Toaster } from 'react-hot-toast'
import {useQuery} from '@tanstack/react-query'
function App() {
  return (
    <div >
      <button onClick={() => toast.success("hello World !")}>Click me</button>
      
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/onboarding' element={<OnboradingPage />} />
        <Route path='/call' element={<CallPage />} />
        <Route path='/notifications' element={<NortificationPage />} />
      </Routes>

      <Toaster  />
    </div>


  )
}

export default App