import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './home'
import Login from './login/login'
import SignUp from './register/register'
import Profile from './profile/profile'

function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/profile" element={<Profile />}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
