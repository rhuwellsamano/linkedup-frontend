import React, { Component } from 'react'
import { connect } from 'react-redux'


const mapStateToProps = state => ({
    current_user: state.current_user
  })


class Profile extends Component {




  render() {
    console.log(this.props.current_user)
    return (
      <div className="profile-page">
      <h1>PROFILE</h1>
    </div>
    )
  }


}

export default connect(mapStateToProps)(Profile);
