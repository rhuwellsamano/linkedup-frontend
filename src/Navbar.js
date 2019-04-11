import React from "react";
import { Link } from "react-router-dom";
import { logoutUser, updateUserStatus } from './actions'
import { connect } from 'react-redux'
// import Cable from 'actioncable'

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  updateUserStatus: (userObj) => dispatch(updateUserStatus(userObj))
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
            props.updateUserStatus(props.current_user)
          }}
        >
          Log Out
        </li>
      </ul>
  </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
