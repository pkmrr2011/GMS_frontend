import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignIn.css'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);  // Store token
      localStorage.setItem("email", data.data.email); // Store email
      console.log("Token : ", data.token, "Email : ", data.data.email)
      navigate('/Dash');
    } else {
      // If login failed, show an alert to the user
      alert('Wrong email or password!');
      console.error(data.message);
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') !== null;  // Check for token
    if (isLoggedIn) {
      navigate('/Dash');
    }
  }, [navigate]);

  return (
    <div className="home">
      <div className="name">
        <h1 className="welcome">Welcome</h1>
      </div>
      <div className="authenticate">
        <div className="content">
          <h2>Sign in</h2>
          <div className="form" style={{ width: '35vw', marginLeft: '7vw' }}>
            <form onSubmit={handleLogin}>
              <div>
                <label>Email address</label>
                <input type="email" placeholder="Username" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <a href="/" className="forget-pass">Forgot password?</a>
              <button className="sign-in-btn" type="submit">Sign in</button>
            </form>
          </div>
          <p className="register-link">
            Don't have an account? <a href="/">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
