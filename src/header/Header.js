import React from 'react';
import './header.css';
import logo from '../images/logo.png';
import login from '../images/login.png';
import signup from '../images/signup.png';
import {GoogleLogin, useGoogleLogin} from '@react-oauth/google';

function Header() {

  return (
    <header className="header" id="header">
      {/*<GoogleLogin onSuccess={*/}
      {/*  credentialResponse => {*/}
      {/*    console.log(credentialResponse);*/}
      {/*    setAccessToken(credentialResponse.credential);*/}
      {/*  }*/}
      {/*} />*/}
      {/*<button onClick={loginToPipoServer}>get user token</button>*/}
      {/*<button onClick={userListToPipoServer}>get user list</button>*/}
      <div className="logo-wrap">
        {/*<span>My Painting</span>*/}
        <img src={logo} className="logo"/>
      </div>
      <div className="login-flex">
        <div className="login-wrap">
          {/*<span>Login</span>*/}
          <img src={login} className="logo"/>
        </div>
        <div className="login-wrap">
          <img src={signup} className="logo"/>
        </div>
      </div>
    </header>
  );
}

export default Header;