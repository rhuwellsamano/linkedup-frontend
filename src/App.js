import React, { Component, createRef } from 'react';
import './App.css';
// import Cable from 'actioncable'
// import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
// import {chatLogsGetFetch} from './actions/index';
// import {userLoginFetch} from './actions/index';
import Navbar from './Navbar'
import {getProfileFetch} from './actions';
import { Route, Switch, Link } from "react-router-dom";
import Chatroom from './Chatroom'
import Signup from './Signup'
import Login from './Login'
import Profile from './Profile'
import EditProfile from './EditProfile'
import { Menu, Segment, Sidebar, Icon } from 'semantic-ui-react'
import { serverAddress } from './ServerAddress'
import { toggleVisible } from './actions'
import UserProfile from './UserProfile'


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

    let arrayOfOnlineUsers = this.state.userList.map((user, index) => <Link to={`/users/${user.id}`}><Menu.Item as="a"> {user.username} : { user.online ? <Icon name="check circle"/> : <Icon name="remove circle"/> } </Menu.Item></Link>)

    return (
      <div>
        <div className="">
          <div>
          <Route component={Navbar} />
        </div>
      </div>


<br></br>
  <br></br>


          <div>
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
                    <Route path="/users/:id" render={routerProps =>{
                        let userFound = this.state.userList.find(user => user.id === parseInt(routerProps.match.params.id))
                        return <UserProfile userFound={userFound}/>
                      } } />
                    <Route path="/profile" component={Profile} />
                    <Route path="/edit" component={EditProfile}/>
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
