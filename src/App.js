import React, { Component, createRef } from 'react';
import './App.css';
// import Cable from 'actioncable'
// import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
// import {chatLogsGetFetch} from './actions/index';
// import {userLoginFetch} from './actions/index';
import Navbar from './Navbar'
import {getProfileFetch} from './actions';
import { Route, Switch } from "react-router-dom";
import Chatroom from './Chatroom'
import Signup from './Signup'
import Login from './Login'
import Profile from './Profile'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar, Sticky } from 'semantic-ui-react'
import { serverAddress } from './ServerAddress'
import { toggleVisible } from './actions'


// import Welcome from './Welcome'

const mapStateToProps = state => {
  return {
    visible: state.visible
  }
}

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
  toggleVisible: () => dispatch(toggleVisible())
})

class App extends Component {

  state = {
    visible: true,
    userList: []
   }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  componentDidMount = () => {
    this.props.getProfileFetch();
    fetch(`http://${serverAddress}:3001/api/v1/users`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(userList => this.setState({
      userList: userList
    }))
  }

  contextRef = createRef()

  render() {
    const { visible } = this.props

    let arrayOfOnlineUsers = this.state.userList.map((user, index) => <Menu.Item as="a"> {user.username} : { user.online ? "✅" : "❌" } </Menu.Item>)

    return (
      <div>
        <div className="">
          <div>
          <Route component={Navbar} />
        </div>
      </div>

          <div>
            <Button.Group>
              <Button disabled={visible} onClick={ !this.state.visible ? this.handleShowClick : this.handleHideClick}>
                Show sidebar
              </Button>
            </Button.Group>

            <Sidebar.Pushable as={Segment}>
              <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                visible={visible}
                width='thin'
              >
                { arrayOfOnlineUsers }

              </Sidebar>

              <Sidebar.Pusher>
                <Segment basic>
                  <Switch>
                    <Route path="/profile" component={Profile} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                    <Route exact path="/" component={Chatroom} />
                  </Switch>
                </Segment>
              </Sidebar.Pusher>

            </Sidebar.Pushable>
          </div>








      </div>




    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default withRouter(App);
