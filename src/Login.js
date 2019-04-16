import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userLoginFetch } from './actions';
import { Redirect } from 'react-router-dom'
import { Form } from 'semantic-ui-react'


const mapStateToProps = state => ({
  current_user: state.current_user
})

const mapDispatchToProps = dispatch => ({
  userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo)),
})


class Login extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.userLoginFetch(this.state)
  }

  render() {
    if (localStorage.token) {
      return <Redirect to="/" />
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <h1>Login</h1>

      <Form.Field>
        <label>Username</label>
        <input
          name='username'
          placeholder='Username'
          value={this.state.username}
          onChange={this.handleChange}
          /><br/>
      </Form.Field>

      <Form.Field>
        <label>Password</label>
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={this.state.password}
          onChange={this.handleChange}
          /><br/>
      </Form.Field>
      <Form.Button>
        Submit
      </Form.Button>
      </Form>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
