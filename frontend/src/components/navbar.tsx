import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import JPFlag from "../Icons/japan-svgrepo-com.svg"
import "../css/navbar.css"
import { useCookieCheck } from "../hooks/userAuth"

export function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const {checkCookie} = useCookieCheck();

  useEffect(() => {

    setLoggedIn(checkCookie?.data?.authenticated)

  }, [checkCookie.data, setLoggedIn])

  if (checkCookie.isLoading) return <h1> Loading... </h1>

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="home-link">
          <img src={JPFlag} alt="" className="jp-flag" />
        </Link>
        <h1 className="navbar-logo">JPSubsAPI</h1>
        <ul className="navbar-menu">
          {!loggedIn ? (
            <>
              <li>
                <Link to="/Login" className="nav-link">Login</Link>
              </li>
              <li>
                <Link to="/Register" className="nav-link">Register</Link>
              </li>
            </>
          ) : (
          <li>
            <Link to="/AddSubs" className="nav-link">AddSubs</Link>
          </li>
            )}
        </ul>
      </div>
    </nav>
  )
}
