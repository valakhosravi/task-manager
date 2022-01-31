import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";


const Home = () => {
  let history = useHistory();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);


  async function loginUser(credentials: any) {
    setError(null);
    return fetch('https://localhost:44366/api/Users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(res => {
      if (!res.ok) {
        throw Error('Username or Password is wrong');
      }
      return res.json()
    }).then(data => onLoginSuccess(data))
      .catch(error => onLoginError(error.message))
  }

  function onLoginSuccess(data: any) {
    history.push('/dashboard');
  }

  function onLoginError(error: any) {
    setError(error);
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    // setToken(token);
  }


  return (
    <div className="mi-container">
      <div className="mi-login_card col-lg-4 col-md-6 col-sm-12">
        <div className="mb-3 text-center">
          <b>
            Sign In
          </b>
        </div>
        <form className="border rounded p-3 mb-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1">Username</label>
            <input type="text" className="form-control" name="email" onChange={(e: any) => setUserName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1">Password</label>
            <input type="password" className="form-control" name="password" onChange={(e: any) => setPassword(e.target.value)} />
          </div>
          <div>
            <button className="btn btn-primary w-100" type="submit" onSubmit={handleSubmit}>Sign in</button>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  )
};

// Home.propTypes = {
//   setToken: PropTypes.func.isRequired
// };

export default connect()(Home);
