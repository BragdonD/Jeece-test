import { useEffect, useState } from 'react';
import { w3cwebsocket as WebSocketClient} from "websocket";
import { UserArea } from './component/user-area.jsx';
import { UserMenu } from "./component/user-menu.jsx";
import { ChatBar } from './component/chat-bar/chat-bar.jsx';
import { Preference } from './component/preferences/preferences';

import "./app.css";
import { NewConv } from './component/new-conv/new-conv.jsx';

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
  const [chats, setChats] = useState();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPreference, setShowPreference] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [Ws, setWs] = useState();

  useEffect(() => {

    let ws = new WebSocketClient('ws://localhost:3001/');

    ws.onerror = function() {
      console.log('Connection Error');
      window.location = "/login";
    };
    
    ws.onopen = function() {
      console.log('WebSocket Client Connected');
    };
    
    ws.onclose = function() {
      console.log('echo-protocol Client Closed');
    };
    
    ws.onmessage = function(e) {
      if (typeof e.data === 'string') {
          let data = JSON.parse(e.data);
          console.log(data);
          if(data["userData"] !== undefined)
            setMemberData(data.userData);
          if(data["userChats"] !== undefined) 
            setChats(data.userChats.reverse());;
      }
    };
    
    setWs(ws);
  }, []);

  useEffect(() => {}, [memberData]);

  useEffect(() => {
    setShowUserMenu(false)
  }, [showPreference])

  useEffect(() => {
    if(showNewMessage === true)
      setShowUserMenu(false)
  }, [showNewMessage])

  return (
    <div className="App">
      <div className="left-side">
        <UserArea imgURL={memberData.img} Prenom={memberData.pseudo} setUserMenuVisibilty={setShowUserMenu} visibiltyUserMenu={showUserMenu} setShowNewMessage={setShowNewMessage}></UserArea>
        <ChatBar chats={chats}></ChatBar>
      </div>
      <Preference member_data={memberData} display={showPreference} callback={setShowPreference}></Preference>
      <NewConv display={showNewMessage} setDisplay={setShowNewMessage} ws={Ws}></NewConv>
      <UserMenu visibilty={showUserMenu} setShowPreference={setShowPreference}></UserMenu>

    </div>
  );
}

export default App;
