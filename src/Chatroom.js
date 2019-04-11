import React, { Component } from 'react';
import './App.css';
import Cable from 'actioncable'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { chatLogsGetFetch, getProfileFetch, addChatLog, loadChatLogs } from './actions/index';
import { serverAddress } from './ServerAddress'


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
    chatLogs: []
  }

  componentDidMount = () => {
  this.props.getProfileFetch()
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
    if (this._isMounted) {
      this.chats.create(this.state.currentChatMessage, this.props.current_user.username);
      this.setState({
        currentChatMessage: ''
      });
      // play sound here
    };
  }

// ORIGINAL
//   renderChatLog() {
//     return this.state.chatLogs.map((el) => {
//       return (
//         <div>
//           <li key={`chat_${el.id}`}>
//             <span className='chat-user'><strong>{ this.props.current_user.username }</strong> says: </span>
//             <span className='chat-message'><em>{ el.content }</em></span>
//             <span className='chat-created-at'> { el.created_at }</span>
//           </li>
//       </div>
//       );
//     });
//   }



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
  }

  render() {

    if (localStorage.token) {
      return (
        <div>
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
