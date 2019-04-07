import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser, updateUserStatus, toggleVisible } from './actions'
import { connect } from 'react-redux'
import { Menu, Icon } from 'semantic-ui-react'

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  updateUserStatus: (userObj) => dispatch(updateUserStatus(userObj)),
  toggleVisible: () => dispatch(toggleVisible())
})

const mapStateToProps = state => ({
  current_user: state.current_user,
  visible: state.visible
})

class Navbar extends Component {

  state = {
    activeItem: {}
  }

  toggleClick = () => this.props.toggleVisible()

  render() {
    const { activeItem } = this.state.activeItem
    const { visible } = this.props.visible
    return (
      <div>
        <Menu inverted fixed="top">
          <Menu.Item name='content' disabled={visible} position="left" onClick={ this.toggleClick }>
              <Icon name='content' />
          </Menu.Item>
          <Link to="/profile">
            <Menu.Item
              name='profile'
              active={activeItem === 'profile'}
              onClick={this.handleItemClick}>
              <Icon name='id card' />
              Profile
            </Menu.Item>
          </Link>
          <Link to="/">
            <Menu.Item
              name='chatroom'
              active={activeItem === 'chatroom'}
              onClick={this.handleItemClick}>
              <Icon name='users' />
              Chatroom
            </Menu.Item>
          </Link>
          { !localStorage.token ? <Link to="/signup">
            <Menu.Item
              name='signup'
              active={activeItem === 'signup'}
              position="right"
              onClick={this.handleItemClick}>
              <Icon name='signup'/>
              Sign Up
            </Menu.Item>
          </Link> : <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            position="right"
            onClick={() => {
              localStorage.removeItem("token");
              this.props.logoutUser();
              this.props.history.push("/login");
              this.props.updateUserStatus(this.props.current_user);
              // this.handleItemClick()
            }}
          >
          <Icon name='log out'/>
            Log Out
          </Menu.Item> }
          { !localStorage.token ? <Link to="/login">
            <Menu.Item
              name='login'
              active={activeItem === 'login'}
              position="right"
              onClick={this.handleItemClick}>
            <Icon name='sign-out'/>
              Log In
            </Menu.Item>
          </Link> : null }


      </Menu>
    </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
