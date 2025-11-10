import './Navbar.css'

const Navbar = () => {
  return (
    <div className='nav'>
      <a href="/">Шизофрения 18+</a>
      <div className='links'>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </div>
  )
}

export default Navbar;