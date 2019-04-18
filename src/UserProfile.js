import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Image } from 'semantic-ui-react'
import avatar from './avatar.png'


// const mapStateToProps = state => ({
//     userFound: state.userFound
//   })


class UserProfile extends Component {
  render() {
    console.log(this.props.userFound)
    const { userFound } = this.props
    if (userFound) {
      return (
        <div className="profile-div">
          <Card className="profile-card">
            <Image src={ avatar } />
            <Card.Content>
              <Card.Header>{ userFound.username }</Card.Header>
              <Card.Meta>
                <span className='date'>Joined in 2019</span>
              </Card.Meta>
              <Card.Description>{ userFound.bio }</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                22 Friends
              </a>
            </Card.Content>
          </Card>
        </div>
      )
    } else {
      return <div>Loading...</div>
    }

  }


}

export default connect()(UserProfile);
