import { useEffect, useState } from 'react';
import './Navbar.css'

const Navbar = () => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const isAuthorized = async () => {
      const response = await fetch("/user");
      const data = await response.json();
      setUsername(data.username)

      setAuth((response.status == 401) ? false : true);
      }

    isAuthorized();
  })

  return (
    <div className='nav'>
      <a href="/">Шизофрения 18+</a>
      <div className='links'>
        { auth ? <p>{username}</p> : null }
        <a href={auth ? "/logout" : "/login"}>{auth ? "Logout" : "Login"}</a>
        <a href="/register">Register</a>
      </div>
    </div>
  )
}

export default Navbar;