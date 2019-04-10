import React, { Component } from 'react';
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

// import Welcome from './Welcome'

// const mapStateToProps = state => {
//   return {
//     current_user: state.current_user
//   }
// }

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch())
})

class App extends Component {

  componentDidMount = () => {
    this.props.getProfileFetch()
  }

  render() {
    return (
      <div>
        <Route component={Navbar} />
          <Switch>
            <Route path="/profile" component={Profile} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route exact path="/" component={Chatroom} />
          </Switch>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(App);
// export default withRouter(App);
