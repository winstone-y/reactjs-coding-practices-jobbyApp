import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-bg">
      <Link to="/">
        <img
          alt="website logo"
          className="website-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        />
      </Link>
      <ul className="nav-items">
<Link to="/" className="link-text">
            
        <li>
          Home
         
        </li>
 </Link>
        <li>
          <Link to="/jobs" className="link-text">
            Jobs
          </Link>
        </li>
        <li className="logout-button">
          <button
            onClick={onLogout}
            type="button"
            className="findjobs-button login-button "
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
