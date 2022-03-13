import { useEffect, useState } from 'react';
import { w3cwebsocket as WebSocketClient} from "websocket";
import { UserArea } from './component/user-area.jsx';
import { UserMenu } from "./component/user-menu.jsx";
import { Preference } from './component/preferences.jsx';

import "./app.css";

const initial_data = {
  firstName: "",
  lastName: "",
  email: "",
  pseudo: "", 
  password: "",
  img : "",
}

function App() {
  const [memberData, setMemberData] = useState(initial_data); 
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          let data = JSON.parse(e.data);
          setMemberData(data.userData)
      }
    };
  }, []);

  useEffect(() => {
    
  }, [memberData]);

  return (
    <div className="App">
      <div>
        <UserArea imgURL={memberData.img} setUserMenuVisibilty={setShowUserMenu} visibiltyUserMenu={showUserMenu}></UserArea>
      </div>
      <Preference member_data={memberData}></Preference>
      <div>
        <UserMenu visibilty={showUserMenu}></UserMenu>
      </div>
    </div>
  );
}

export default App;
