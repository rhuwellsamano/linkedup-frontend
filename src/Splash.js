import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

class Splash extends Component {

  render() {
    return (
      <div className='splash-container'>
        <h1 className='app-name'><span role="img" aria-label="Fire">🔥</span> LinkedUp Chatroom <span role="img" aria-label="Fire">🔥</span></h1>
        <div className='login-container'>
          <h2> Sign Up </h2>
            <p>Username: <input type="text"/></p>
            <p>Password: <input type="password"/></p>
          <Link to="/"><button>Back To Chat</button></Link>

        </div>
      </div>
    );
  }
}

export default Splash;
