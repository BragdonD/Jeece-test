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

    const getPseudo = async (id) => {
        const res = await fetch(`/member/pseudo/${id}`);
    }

    return (
        <div className="chats-box-container">
            <div className="chats-box-wrapper">
                {
                    chats.map( (elem, i) => {
                        return (
                            <div id={elem._id} className={`chat${i === selected ? " selected" : ""}`} key={i} onClick={(e) => handleClick(i)}>
                                <h1>{elem.title}</h1>
                                <div className="last-message">
                                    <p>
                                    {
                                        elem.messages[elem.messages.length-1] === undefined ? undefined :
                                        elem.members.find(obj => {
                                            return obj._id === elem.messages[elem.messages.length-1]._id_creator;
                                        }) === undefined ? "leave" + " : " + elem.messages[elem.messages.length-1].text : 
                                        elem.members.find(obj => {
                                            return obj._id === elem.messages[elem.messages.length-1]._id_creator;
                                        }).pseudo + " : " + elem.messages[elem.messages.length-1].text
                                    }
                                    </p>
                                </div>
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

