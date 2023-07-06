import {Component} from 'react'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {usernameInput: '', passwordInput: '', errMsg: ''}

  onLogin = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username: usernameInput, password: passwordInput}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      const {history} = this.props
      console.log(data)
      history.replace('/')
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  onSearchInput = event => {
    this.setState({usernameInput: event.target.value})
  }

  onPasswordInput = event => {
    this.setState({passwordInput: event.target.value})
  }

  render() {
    const {usernameInput, passwordInput, errMsg} = this.state
    const {history} = this.props
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      history.replace('/')
    }

    return (
      <div className="login-bg">
        <div className="login-card">
          <img
            alt="website logo"
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
          />
          <form onSubmit={this.onLogin} className="form">
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <input
              value={usernameInput}
              onChange={this.onSearchInput}
              type="text"
              id="username"
              className="input-element"
              placeholder="Username"
            />
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              onChange={this.onPasswordInput}
              value={passwordInput}
              type="password"
              id="password"
              className="input-element"
              placeholder="Password"
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {errMsg !== '' ? <p className="error-message">*{errMsg}</p> : ''}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
