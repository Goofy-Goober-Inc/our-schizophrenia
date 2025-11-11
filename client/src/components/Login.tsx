import { useState } from 'react'
import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    if(response.status === 200) window.location.href = "/"
  }

  return (
    <section id='main'>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}/>
        <input type="password" name="password" id="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
        <button type="submit">Login</button>
      </form>
    </section>
  )
}

export default Login;