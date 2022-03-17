import React, { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";
import PropTypes from 'prop-types';
import "./chat-block.css";

export const ChatBlock = ({conversation, ws, id}) => {
    const [displayParameter, setDisplayParameter] = useState(false);

    useEffect(() => {}, [displayParameter])

    useEffect(() => {
        function handleResize() {
            if(window.innerWidth < 950)
                setDisplayParameter(false)
        }
        window.addEventListener('resize', handleResize)
    })

    return(
        <div className="chat-block-container">
            <div className="main-conv-wrapper">
                <MainConvBlock 
                    conversation={conversation} 
                    setDisplayParameter={setDisplayParameter} 
                    displayParameter={displayParameter}
                ></MainConvBlock>
            </div>
            <ModifyConvBlock
                conversation={conversation}
                ws={ws}
                display={displayParameter}
                id={id}
            ></ModifyConvBlock>
            
        </div>
    )
}

ChatBlock.propTypes = {
    conversation: PropTypes.object,
    ws: PropTypes.objectOf(w3cwebsocket),
    id: PropTypes.string
}

const MainConvBlock = ({conversation, setDisplayParameter, displayParameter}) => {
    const handleClickParameter = () => {
        setDisplayParameter(!displayParameter)
    }

    return (
        <div className="header-conv">
            <h1 className="title-conv">{conversation !== undefined ? conversation.title : undefined}</h1>
            <div className="menu-conv">
                <div onClick={handleClickParameter}>
                    <svg viewBox="0 0 36 36" height="28" width="28">
                        <path
                            d="M12.5 18A2.25 2.25 0 118 18a2.25 2.25 0 014.5 0zm7.75 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm5.5 2.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

MainConvBlock.propTypes = {
    conversation: PropTypes.object,
    displayParameter: PropTypes.bool,
    setDisplayParameter: PropTypes.func
}

const ModifyConvBlock = ({conversation, ws, display, id}) => {
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        if(conversation !== undefined) {
            if(conversation.members !== undefined) {
                const user = conversation.members.find(obj => {
                    return obj._id === id
                });
                const user_role = user.role;
                if(user_role === "admin") {
                    setAdmin(true);
                }
                else {
                    setAdmin(false);
                }
            }
            
        }
    }, [conversation])

    return (
        <div className={`modify-conv-wrapper ${display === true ? "" : " unvisible"}`}>
            <div className="header-modify">
                <h1 className="title-conv">{conversation !== undefined ? conversation.title : undefined}</h1>
            </div>
            <div className="menu-modify-container">
                {
                    admin === false ? undefined : 
                    <div className="wrapper-menu-option">
                        <div className="menu-option">
                            <h1>Modifier le nom de la discussion</h1>
                        </div>
                        <div className="menu-option">
                            <h1>Ajouter un membre</h1>
                        </div>
                    </div>
                }
            </div>
            <div className="members-container">
                {
                    conversation === undefined ? undefined : 
                    conversation.members.map((elem,i) => {
                        return(
                            <div key={i} className="member-wrapper">
                                <img className="member-image" src={`/member/image/${elem._id}`}/>
                                <div>
                                   <h1 className={elem.role}>{elem.pseudo}</h1> 
                                   <div>
                                   {
                                       elem.role !== "admin" ? undefined : <p>Admin</p>
                                   }
                                   </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}