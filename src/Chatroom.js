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



renderChatLog() {
  return this.props.chatLogs.map((el) => {
    return (
      <div>
        <li key={`chat_${el.id}`}>
          <span className='chat-user' style={divStyle}><strong>{ el.user }</strong> says: </span>
          <span className='chat-message'><em>{ el.content }</em></span>
          <span className='chat-created-at'>     sent: { el.created_at }</span>
        </li>
    </div>
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
        <div className='chatbox'>
          <div className='App'>

              <div className='stage'>

                <h1 className='app-name'><span role="img" aria-label="Fire">🔥</span> LinkedUp Chatroom <span role="img" aria-label="Fire">🔥</span></h1>

                <div className='chat-logs'>
                  { this.renderChatLog() }
                </div>

                <input
                  onKeyPress={ (e) => this.handleChatInputKeyPress(e) }
                  onChange={ (e) => this.updateCurrentChatMessage(e) }
                  value={ this.state.currentChatMessage }
                  type='text'
                  placeholder='Enter your message...'
                  className='chat-input'
                  autoFocus={true}/>

                <button
                  onClick={ (e) => this.handleSendEvent(e) }
                  className='send'>
                  Send
                </button>

              </div>

                <Link to="/splash"><button>Back Home</button></Link>

          </div>

      </div>
      );
    } else {
      return <Redirect to="/login" />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
