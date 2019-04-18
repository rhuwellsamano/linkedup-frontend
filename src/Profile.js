import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import avatar from './avatar.png'
import { Link, Redirect } from 'react-router-dom';



const mapStateToProps = state => ({
    current_user: state.current_user
  })


class Profile extends Component {


  state = {}

  handleChange = (e, { value }) => this.setState({ value })

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
                  <span className='date'>Joined in 2019</span>
                </Card.Meta>
                <Card.Description>{ current_user.bio }</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <Icon name='thumbs up' />
                  22 Likes
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

export default connect(mapStateToProps)(Profile);
