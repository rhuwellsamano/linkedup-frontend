import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import avatar from './avatar.png'
import { Link, Redirect } from 'react-router-dom';
import { addLike } from './actions/index'



const mapStateToProps = state => ({
    current_user: state.current_user
  })

const mapDispatchToProps = dispatch => ({
  addLike: (id, currentLikes) => dispatch(addLike(id, currentLikes))
})


class Profile extends Component {


  state = {}

  handleChange = (e, { value }) => this.setState({ value })

  handleLike = (event) => {
    console.log(this.state)
    event.preventDefault()
    this.props.addLike(this.props.current_user.id, this.props.current_user.likes)
  }

  render() {
    console.log(this.props.current_user)

    if (localStorage.token) {
        const { current_user } = this.props
        return (
          <div className="profile-div">
            <Card className="profile-card">
              <Image src={ avatar } />
              <Card.Content>
                <Card.Header>{ current_user.username }</Card.Header>
                <Card.Meta>
                  <span className='date'>Software Engineer</span>
                </Card.Meta>
                <Card.Description>{ current_user.bio }</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <div onClick={this.handleLike}>
                    <Icon name='thumbs up' />
                    { current_user.likes > 0 ? `${current_user.likes}` : `*crickets*` }
                  </div>
                </a>
              </Card.Content>
            </Card>
            <Link to="/edit"><Button>Edit Profile</Button></Link>
          </div>
        )

      } else {
        return <Redirect to="/login" />
      }

    }



}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
