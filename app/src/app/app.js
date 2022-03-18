import { useEffect, useState } from 'react';
import { w3cwebsocket as WebSocketClient} from "websocket";
import { UserArea } from './component/user-area.jsx';
import { UserMenu } from "./component/user-menu.jsx";
import { ChatBar } from './component/chat-bar/chat-bar.jsx';
import { Preference } from './component/preferences/preferences';

import "./app.css";
import { NewConv } from './component/new-conv/new-conv.jsx';
import { ChatBlock } from './component/chat-block/chat-block.jsx';

const initial_data = {
  firstName: "",
  lastName: "",
  email: "",
  pseudo: "", 
  password: "",
  img : "",
}

let ws;

function App() {
  const [memberData, setMemberData] = useState(initial_data); 
  const [chats, setChats] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPreference, setShowPreference] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [convSelected, setConvSelected] = useState(0);
  const [render, setRender] = useState(false);
  const [Ws, setWs] = useState(new WebSocketClient('ws://localhost:3001/'));

  Ws.onerror = function() {
    console.log('Connection Error');
    window.location = "/login";
  };
  
  Ws.onopen = function() {
    console.log('WebSocket Client Connected');
  };
  
  Ws.onclose = function() {
    console.log('echo-protocol Client Closed');
    window.location = "/login";
  };
  
  Ws.onmessage = function(e) {
    if (typeof e.data === 'string') {
      let data = JSON.parse(e.data);
      console.log(data);
      if(data["userData"] !== undefined){
        //console.log("set member data");
        setMemberData(data.userData);
      }
      if(data["userChats"] !== undefined) {
        //console.log("set user Chats");
        setChats(data.userChats.reverse());
      }
      else if(data["newChat"] !== undefined) {
        let temp = chats;
        temp.push(data.newChat);
        setChats(temp);
        setRender(!render);
      }
      if(data["updateChat"] !== undefined && chats !== undefined) {
        if(data.updateChat.title) {
          let temp = chats;
          temp.forEach(element => {
            if(element._id === data.updateChat._id) {
              element.title = data.updateChat.title;
            }
          });
          setChats(temp);
          setRender(!render);
        }
        if (data.updateChat.members) {
          let temp = chats;
          temp.forEach(element => {
            if(element._id === data.updateChat._id) {
              element.members = data.updateChat.members;
            }
          });
          setChats(temp);
          setRender(!render);
        }
        
      }
    }
  };

  const removeConversation = (value) => {
    if(value === true) {
      let temp = chats;
      temp.splice(convSelected, 1);
      setChats(temp);
      setRender(!render);
    }
    
  }

  useEffect(() => {
    setShowUserMenu(false)
  }, [showPreference])

  useEffect(() => {
    //console.log(chats);
  });

  useEffect(() => {
    if(showNewMessage === true)
      setShowUserMenu(false)
  }, [showNewMessage])

  return (
    <div className="App">
      <div className="left-side">
        <UserArea 
          imgURL={memberData.img} 
          Prenom={memberData.pseudo} 
          setUserMenuVisibilty={setShowUserMenu} 
          visibiltyUserMenu={showUserMenu} 
          setShowNewMessage={setShowNewMessage}
        ></UserArea>
        <ChatBar 
          chats={chats} 
          selected={convSelected} 
          setSelected={setConvSelected}
        ></ChatBar>
      </div>
      <Preference 
        member_data={memberData} 
        display={showPreference} 
        callback={setShowPreference}
      ></Preference>
      <NewConv 
        display={showNewMessage} 
        setDisplay={setShowNewMessage} 
        ws={Ws}
      ></NewConv>
      <UserMenu 
        visibilty={showUserMenu} 
        setShowPreference={setShowPreference}
      ></UserMenu>
      <ChatBlock 
        conversation={chats !== undefined ? chats[convSelected] : undefined} 
        ws={Ws}
        id={memberData._id}
        removeConversation={removeConversation}
      ></ChatBlock>
    </div>
  );
}

export default App;
