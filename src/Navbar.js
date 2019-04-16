import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser, updateUserStatus } from './actions'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  updateUserStatus: (userObj) => dispatch(updateUserStatus(userObj))
})

const mapStateToProps = state => ({
  current_user: state.current_user
})

class Navbar extends Component {

  state = {

  }

  // handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    return (
      <div>
        <Menu>
          <Menu.Item>
            <span>🍔</span>
          </Menu.Item>
          <Link to="/profile">
            <Menu.Item
              name='profile'
              active={activeItem === 'profile'}
              onClick={this.handleItemClick}>
              Profile
            </Menu.Item>
          </Link>
          <Link to="/">
            <Menu.Item
              name='profile'
              active={activeItem === 'chatroom'}
              onClick={this.handleItemClick}>
              Chatroom
            </Menu.Item>
          </Link>
          { !localStorage.token ? <Link to="/signup">
            <Menu.Item
              name='signup'
              active={activeItem === 'signup'}
              onClick={this.handleItemClick}>
              Sign Up
            </Menu.Item>
          </Link> : <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={() => {
              localStorage.removeItem("token");
              this.props.logoutUser();
              this.props.history.push("/login");
              this.props.updateUserStatus(this.props.current_user);
              // this.handleItemClick()
            }}
          >
            Log Out
          </Menu.Item> }
          { !localStorage.token ? <Link to="/login">
            <Menu.Item
              name='login'
              active={activeItem === 'login'}
              onClick={this.handleItemClick}>
              Log In
            </Menu.Item>
          </Link> : null }


      </Menu>
    </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
