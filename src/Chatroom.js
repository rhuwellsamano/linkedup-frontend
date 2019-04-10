import React, { Component } from 'react';
import './App.css';
import Cable from 'actioncable'
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {chatLogsGetFetch} from './actions/index';
import {getProfileFetch} from './actions/index';


const mapStateToProps = state => {
  return {
    chatLogs: state.chatLogs,
    current_user: state.current_user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    chatLogsGetFetch: () => dispatch(chatLogsGetFetch()),
    getProfileFetch: () => dispatch(getProfileFetch())
  }
}

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
      this.chats.create(this.state.currentChatMessage);
      this.setState({
        currentChatMessage: ''
      })
    };
  }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{ el.content }</span>
          <span className='chat-created-at'> { el.created_at }</span>
        </li>
      );
    });
  }

  handleChatInputKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleSendEvent(event);
    }
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://10.39.105.71:3001/cable');
    // let cable = Cable.createConsumer('ws://10.39.111.52:3001/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        if (this._isMounted) {
          this.setState({ chatLogs: chatLogs });
        }
      },
        create: function(chatContent) {
          this.perform('create', {
            content: chatContent
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
