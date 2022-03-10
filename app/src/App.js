import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { w3cwebsocket as WebSocketClient} from "websocket"
const gateway = "ws://localhost:3001";
/*
var client = new WebSocketClient('ws://localhost:3001/');

client.onerror = function() {
  console.log('Connection Error');
};

client.onopen = function() {
  console.log('WebSocket Client Connected');
};

client.onclose = function() {
  console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
  if (typeof e.data === 'string') {
      console.log("Received: '" + e.data + "'");
  }
};
*/
function App() {  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
