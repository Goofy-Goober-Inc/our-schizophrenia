import './App.css'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Chat from './components/Chat'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddEmote from './components/AddEmote'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Chat />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/emote' element={<AddEmote />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
