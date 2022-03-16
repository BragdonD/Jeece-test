import React, { useEffect, useState } from "react";
import "./chat-bar.css";

export const ChatBar = ({chats, setClick}) => {
    const [chatData, setChatData] = useState(chats);

    useEffect(() => {
        setChatData(chats);
    }, [chats]);

    const handleClick = (nb) => {
        
    }

    return (
        <div className="chats-box-container">
            <div className="chats-box-wrapper">
                {
                    chatData === undefined ? "" : chatData.map( (elem, i) => {
                        return (
                            <div className="chat" key={i} onClick={(e) => handleClick(i)}>
                                <h1>{elem.title}</h1>
                                <p>{elem.messages[elem.messages.length]}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

