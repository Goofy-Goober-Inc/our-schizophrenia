import { useEffect, useState } from 'react';
import './Navbar.css'

const Navbar = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const isAuthorized = async () => {
      const response = await fetch("/user");

      setAuth((response.status == 401) ? false : true);
      }

    isAuthorized();
  })

  return (
    <div className='nav'>
      <a href="/">Шизофрения 18+</a>
      <div className='links'>
        <a href={auth ? "/logout" : "/login"}>{auth ? "Logout" : "Login"}</a>
        <a href="/register">Register</a>
      </div>
    </div>
  )
}

export default Navbar;