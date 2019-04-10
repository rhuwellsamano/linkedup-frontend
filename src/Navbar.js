import React from "react";
import { Link, withRouter } from "react-router-dom";
import { logoutUser } from './actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser())
})

const mapStateToProps = state => ({
  current_user: state.current_user
})

const Navbar = props => {
  return (
    <div>
      <h4> { props.current_user.username }</h4>
      <ul>
        <Link to="/profile">
          <li>Profile</li>
        </Link>
        <Link to="/">
          <li>Chatroom</li>
        </Link>
        <Link to="/signup">
          <li>Sign Up</li>
        </Link>
        <Link to="/login">
          <li>Log In</li>
        </Link>
        <li
          onClick={() => {
            localStorage.removeItem("token");
            props.logoutUser();
            props.history.push("/login");
          }}
        >
          Log Out
        </li>
      </ul>
  </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
