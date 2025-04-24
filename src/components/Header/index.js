import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <Link to="/" className="nav-link">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>Jobs</li>
          </Link>
        </ul>
        <div className="nav-menu-mobile">
          <ul className="nav-menu-list-mobile">
            <Link to="/">
              <li className="nav-menu-item-mobile">
                <AiFillHome className="nav-mobile-icon" />
              </li>
            </Link>
            <Link to="/jobs">
              <li className="nav-menu-item-mobile">
                <BsBriefcaseFill className="nav-mobile-icon" />
              </li>
            </Link>
          </ul>
        </div>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
        <button
          type="button"
          className="logout-mobile-btn"
          onClick={onClickLogout}
        >
          <FiLogOut className="nav-mobile-icon" />
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
