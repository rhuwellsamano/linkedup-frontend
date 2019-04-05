import React, { Component } from 'react';
import './App.css';
import Cable from 'actioncable'

class App extends Component {

  state = {
    currentChatMessage: '',
    chatLogs: []
  }

  componentWillMount() {
    this.createSocket();
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage);
    this.setState({
      currentChatMessage: ''
    });
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
    // let cable = Cable.createConsumer('wss://serene-hollows-71418.herokuapp.com/');
    // let cable = Cable.createConsumer('wss://274bc527.ngrok.io/cable');
    // let cable = Cable.createConsumer('ws://10.39.109.8:3001/cable');
    let cable = Cable.createConsumer('ws://10.39.109.8:3001/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        this.setState({ chatLogs: chatLogs });
      },
      create: function(chatContent) {
        this.perform('create', {
          content: chatContent
        });
      }
    });
  }

  render() {
    return (
      <div className='App'>
        <div className='stage'>
          <h1><span role="img" aria-label="Fire">🔥</span> LinkedUp Chatroom <span role="img" aria-label="Fire">🔥</span></h1>
          <div className='chat-logs'>
            { this.renderChatLog() }
          </div>
          <input
            onKeyPress={ (e) => this.handleChatInputKeyPress(e) }
            onChange={ (e) => this.updateCurrentChatMessage(e) }
            value={ this.state.currentChatMessage }
            type='text'
            placeholder='Enter your message...'
            className='chat-input'/>
          <button
            onClick={ (e) => this.handleSendEvent(e) }
            className='send'>
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default App;
