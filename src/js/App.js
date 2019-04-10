import React, { Component } from 'react';
import { Header, Input, Button } from 'semantic-ui-react'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript' 
import 'brace/theme/github'

import socket from './socket'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      connected: false,
      room: '---'
    }
  }

  handleChange(value) {
    socket.emit('CHANGE_CLIENT', {
      room: this.state.room,
      code: value
    })
    this.setState({
      value
    })
  }
  componentDidMount() {
    socket.on('CHANGE_SERVER', value => {
      this.setState({
        value
      })
    })
  }

  connectRoom() {
    socket.emit('JOIN_ROOM', this.state.room)
    this.setState({ connected: true })
  }
  render() {
    return (
      <div>
        <div className="header">
          <Header size="huge">Trycode {this.state.room}</Header>
          <Input onChange={e => this.setState({ room: e.target.value })} />
          <Button
            disabled={this.state.connected}
            onClick={this.connectRoom.bind(this)}>
            Connect
            </Button>
        </div>
        <div className="editor">
        <AceEditor
        mode="javascript"
        theme="github"
        name="editor"
        highlightActiveLine={true}
        showGutter={true}
        fontSize={18}
        editorProps={{
          $blockScrolling: true,
        }}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
        </div>
      </div>
    );
  }
}

export default App;
