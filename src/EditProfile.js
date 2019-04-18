import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import { updateUser, deleteUser } from './actions/index'


const mapStateToProps = state => ({
  current_user: state.current_user
})

const mapDispatchToProps = dispatch => ({
  updateUser: (updatedUser) => dispatch(updateUser(updatedUser)),
  deleteUser: (id) => dispatch(deleteUser(id))
})

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
]

class EditProfile extends Component {
  state = {
    id: this.props.current_user.id,
    username: this.props.current_user.username,
    bio: this.props.current_user.bio,
    avatar: this.props.current_user.avatar
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.updateUser(this.state)
    // window.location = '/login'
  }


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleDelete = () => {
    this.props.deleteUser(this.props.current_user.id);
  }

  render () {
    console.log("hi", this.props)
    console.log("hi from state", this.state)
    return (
      <div>
        <h2>Edit Profile</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Input fluid label='Username' placeholder='Username...' value={this.state.username} name='username' onChange={this.handleChange}/>
            <Form.TextArea fluid label='Bio' placeholder='Tell us more about you...' value={this.state.bio} name='bio' onChange={this.handleChange}/>
            <Form.Select fluid label='Avatar' placeholder='Avatar'  options={options} name='avatar' onChange={this.handleChange}/>
          </Form.Group>
          <Form.Button>Submit</Form.Button>
          </Form>
          <Button onClick={this.handleDelete}>Delete My Account</Button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
