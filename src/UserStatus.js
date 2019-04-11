import React, { Component } from 'react';
// import { serverAddress } from './ServerAddress'
// import Cable from 'actioncable'
// import { getProfileFetch } from './actions/index';
// import { connect } from 'react-redux';


// const mapDispatchToProps = dispatch => ({
//     getProfileFetch: () => dispatch(getProfileFetch())
//   })

class UserStatus extends Component {

  // state = {
  //   userList: []
  // }
  //
  // componentDidMount = () => {
  //   this.props.getProfileFetch();
  //   fetch(`http://${serverAddress}:3001/api/v1/users`, {
  //     method: "GET",
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     }
  //   })
  //   .then(res => res.json())
  //   .then(userList => this.setState({
  //     userList: userList
  //   }))
  // }


  // createSocket() {
  //   let cable = Cable.createConsumer(`ws://${serverAddress}:3001/cable`);
  //
  //   this.appearances = cable.subscriptions.create({
  //     channel: "AppearanceChannel"
  //   }, {
  //     connected: () => {console.log('AppearanceChannel connected!')},
  //     received: (data) => {
  //       console.log('data', data)
  //       let item = JSON.parse(data);
  //       let index = this.state.userList.findIndex(user => user.id === item.id);
  //       let updatedUserList = [
  //         ...this.state.userList.slice(0, index),
  //         item,
  //         ...this.state.userList.slice(index + 1)
  //       ];
  //       this.setState({ userList: updatedUserList });
  //     },
  //     online: () => {
  //
  //     }
  //   })
  // };

  render () {

    let onlineStatusText = this.props.online ? "ONLINE" : "OFFLINE"

    return (
      <h6>
        { this.props.user.username }: { onlineStatusText }
      </h6>
    )
  }
}

export default UserStatus;
