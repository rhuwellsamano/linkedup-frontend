import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Image } from 'semantic-ui-react'
import avatar from './avatar.png'
import { addLike } from './actions/index'


// const mapStateToProps = state => ({
//     current_user: state.current_user
//   })

const mapDispatchToProps = dispatch => ({
  addLike: (id, currentLikes) => dispatch(addLike(id, currentLikes))
})

class UserProfile extends Component {


  handleLike = (event) => {
    console.log(this.state)
    event.preventDefault()
    this.props.addLike(this.props.userFound.id, this.props.userFound.likes)
  }

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
                <span className='date'>Software Engineer</span>
              </Card.Meta>
              <Card.Description>{ userFound.bio }</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <div onClick={this.handleLike}>
                  <Icon name='thumbs up' />
                    { userFound.likes > 0 ? `${userFound.likes}` : `*crickets*` }
                </div>
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

export default connect(null, mapDispatchToProps)(UserProfile);
