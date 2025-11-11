import { useState } from 'react'
import './Register.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}/>
        <input type="password" name="password" id="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
        <button type="submit">Register</button>
      </form>
    </section>
  )
}

export default Register;