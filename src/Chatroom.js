import React, { Component } from 'react';
import './App.css';
import Cable from 'actioncable'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { chatLogsGetFetch, getProfileFetch, addChatLog, loadChatLogs } from './actions/index';
import { serverAddress } from './ServerAddress'
import UserStatus from './UserStatus'
// import  { audio1, playMessageSent } from './audio'
import SidebarExampleSidebar from './Sidebar'
import { Menu, Input, Comment } from 'semantic-ui-react'
import ducky from './duck.png'



const mapStateToProps = state => {
  return {
    chatLogs: state.chatLogs,
    current_user: state.current_user
  }
}

const mapDispatchToProps = dispatch => ({
    chatLogsGetFetch: () => dispatch(chatLogsGetFetch()),
    getProfileFetch: () => dispatch(getProfileFetch()),
    addChatLog: (chatLog) => dispatch(addChatLog(chatLog)),
    loadChatLogs: () => dispatch(loadChatLogs())
  })

  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const divStyle = {
    color: getRandomColor(),
  };


class App extends Component {
  _isMounted = false;

  state = {
    currentChatMessage: '',
    chatLogs: [],
    userList: []
  }

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

  componentWillMount() {
    if (this._isMounted === false) {
      this.createSocket();
      this._isMounted = true;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.chats.unsubscribe()
    console.log("unmounted")
  }

  updateCurrentChatMessage(event) {
    if (this._isMounted) {
      this.setState({
        currentChatMessage: event.target.value
      })
    };
  }

  handleSendEvent(event) {
    event.preventDefault();
    if (this.state.currentChatMessage === '') {
      console.log("Type something in, first!")
    }
    if (this._isMounted && this.state.currentChatMessage !== '') {
      this.chats.create(this.state.currentChatMessage, this.props.current_user.username);
      this.setState({
        currentChatMessage: ''
      });
      // play sound here
      // playMessageSent()
    };
  }

//   <div>
//     <li key={`chat_${el.id}`}>
//       <span className='chat-user' style={divStyle}><strong>{ el.user }</strong> says: </span>
//       <span className='chat-message'>{ el.content }</span>
//       <span className='chat-created-at'>     sent: { el.created_at }</span>
//     </li>
// </div>



renderChatLog() {
  return this.props.chatLogs.map((el) => {
    return (

    <Comment key={`chat_{el.id}`}>
      <Comment.Avatar src={ ducky } />
      <Comment.Content>
        <Comment.Author>{ el.user }</Comment.Author>
        <Comment.Metadata>
          <div>sent: { el.created_at }</div>
        </Comment.Metadata>
        <Comment.Text>{ el.content }</Comment.Text>
      </Comment.Content>
    </Comment>

    );
  });
}

  handleChatInputKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleSendEvent(event);
    }
  }

  createSocket() {
    let cable = Cable.createConsumer(`ws://${serverAddress}:3001/cable`);
    // let cable = Cable.createConsumer('ws://10.39.111.52:3001/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        // below was the original line
        // let chatLogs = this.state.chatLogs;
        let chatLogs = this.props.chatLogs;
        chatLogs.push(data);
        if (this._isMounted) {
          this.setState({
            chatLogs: chatLogs
          });
          console.log(chatLogs)
          this.props.addChatLog(chatLogs)
        }
      },
        create: function(chatContent, user) {
          this.perform('create', {
            content: chatContent,
            user: user
          });
        }
      });
///
      this.appearances = cable.subscriptions.create({
        channel: "AppearanceChannel"
      }, {
        connected: () => {console.log('AppearanceChannel connected!')},
        received: (data) => {
          console.log('data', data)
          let item = JSON.parse(data);
          let index = this.state.userList.findIndex(user => user.id === item.id);
          let updatedUserList = [
            ...this.state.userList.slice(0, index),
            item,
            ...this.state.userList.slice(index + 1)
          ];
          this.setState({ userList: updatedUserList });
        },
        online: () => {

        }
    });
      console.log('CHATROOM STATE:', this.state.userList)
///
  }

  render() {

    if (localStorage.token) {

      return (
        <React.Fragment>
        <div className='chatbox'>
          <div className='App'>

                <h1 className='app-name'><span role="img" aria-label="Fire">🔥</span> LinkedUp Chatroom <span role="img" aria-label="Fire">🔥</span></h1>


                <div className='chat-logs'>
                   <Comment.Group>
                     { this.renderChatLog() }
                  </Comment.Group>
                </div>

          </div>

      </div>

          <Menu fixed="bottom">
            <Input
              fluid
              action={{ icon: 'send', onClick: (e) => this.handleSendEvent(e) } }
              onKeyPress={ (e) => this.handleChatInputKeyPress(e) }
              onChange={ (e) => this.updateCurrentChatMessage(e) }
              value={ this.state.currentChatMessage }
              type='text'
              placeholder='Enter your message...'
              className='chat-input'
              autoFocus={true}/>
          </Menu>
        </React.Fragment>
      );
    } else {
      return <Redirect to="/login" />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
