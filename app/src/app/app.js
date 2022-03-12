import { useEffect } from 'react';
import { w3cwebsocket as WebSocketClient} from "websocket"

function App() {
  let webSocket;  

  useEffect(() => {
    let client = new WebSocketClient('ws://localhost:3001/');

    client.onerror = function() {
      console.log('Connection Error');
      window.location = "/login";
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
  }, []);

  return (
    <div className="App">
    </div>
  );
}

export default App;
