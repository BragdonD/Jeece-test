import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./chat-bar.css";

export const ChatBar = ({chats, setSelected, selected}) => {
    //const [chatData, setChatData] = useState(chats);

    useEffect(() => {

    }, [chats]);

    const handleClick = (nb) => {
        setSelected(nb);
    }

    return (
        <div className="chats-box-container">
            <div className="chats-box-wrapper">
                {
                    chats.map( (elem, i) => {
                        return (
                            <div id={elem._id} className={`chat${i === selected ? " selected" : ""}`} key={i} onClick={(e) => handleClick(i)}>
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

ChatBar.propTypes = {
    chats: PropTypes.arrayOf(Object),
    setSelected: PropTypes.func,
    selected: PropTypes.number,
}

