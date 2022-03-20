import React, { useEffect, useState, useRef } from "react";
import { w3cwebsocket } from "websocket";
import PropTypes from 'prop-types';
import ScrollableFeed from 'react-scrollable-feed';
import "./chat-block.css";

export const ChatBlock = ({conversation, ws, id, removeConversation}) => {
    const [displayParameter, setDisplayParameter] = useState(false);
    const [displayChangeNameConv, setDisplayChangeNameConv] = useState(false);
    const [displayLeaveConv, setDisplayLeaveConv] = useState(false);
    const [displayAddMember, setDisplayAddMember] = useState(false);

    useEffect(() => {}, [displayParameter])

    const handleResize = () => {
        if(window.innerWidth < 500) {
            setDisplayParameter(false)
        }
    }

    /**
     * 
     * @param {Boolean} value 
     */
    const handleLeaveConv = (value) => {
        if(value === true) {
            ws.send(JSON.stringify({
                task: "delete member",
                _id: conversation._id,
                person: id
            }));
            removeConversation(true);
        }
    }

    /**
     * 
     * @param {String} value 
     */
    const handleChangeNameConv = (value) => {
        if(value) {
            ws.send(JSON.stringify({
                task: "change name",
                _id: conversation._id,
                name: value
            }));
        }
    }

    const handleAddMember = (obj) => {
        if(obj.validation === true) {
            ws.send(JSON.stringify({
                task: "add member",
                _id: conversation._id,
                pseudo: obj.pseudo
            }))
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)
    }, []);

    return(
        <div className="chat-block-container">
            <div className="main-conv-wrapper">
                <MainConvBlock 
                    ws={ws}
                    conversation={conversation} 
                    setDisplayParameter={setDisplayParameter} 
                    displayParameter={displayParameter}
                    id={id}
                ></MainConvBlock>
            </div>
            <ModifyConvBlock
                conversation={conversation}
                ws={ws}
                display={displayParameter}
                id={id}
                setDisplayChangeNameConv={setDisplayChangeNameConv}
                setDisplayLeaveConv={setDisplayLeaveConv}
                setDisplayAddMember={setDisplayAddMember}
            ></ModifyConvBlock>
            <ChatNameEdit
                placeholder={conversation !== undefined ? conversation.title : undefined}
                display={displayChangeNameConv}
                setDisplay={setDisplayChangeNameConv}
                setNewName={handleChangeNameConv}
            ></ChatNameEdit>
            <LeaveConv
                display={displayLeaveConv}
                setDisplay={setDisplayLeaveConv}
                callback={handleLeaveConv}
            ></LeaveConv>
            <AddMember
                display={displayAddMember}
                setDisplay={setDisplayAddMember}
                callback={handleAddMember}
            ></AddMember>
        </div>
    )
}

ChatBlock.propTypes = {
    conversation: PropTypes.object,
    ws: PropTypes.objectOf(w3cwebsocket),
    id: PropTypes.string
}

const MainConvBlock = ({conversation, ws, id, setDisplayParameter, displayParameter}) => {
    const [MsgValue, setMsgValue] = useState("");
    const [bufferKey, setBufferKey] = useState([]);
    const [render, setRender] = useState(false);
    const [admin, setAdmin] = useState(false);

    const handleChange = (value) => {
        setMsgValue(value);
    };
    const handleClickParameter = () => {
        setDisplayParameter(!displayParameter)
    }
    const handleSubmitNewMessage = () => {
        if(MsgValue.length !== 0) {
            ws.send(JSON.stringify({
                task: "add message",
                _id: conversation._id,
                creator: id,
                msg: MsgValue
            }));
        }

        setMsgValue("");
        document.getElementById("new-message-input").innerHTML = "";
    }

    const handleDeleteMessage = (id) => {
        ws.send(JSON.stringify({
            task: "delete message",
            _id: conversation._id,
            id: id,
        }));
    }

    useEffect(() => {
        if(MsgValue.length === 1) {
            if(MsgValue === "\n") {
                setMsgValue("");
                document.getElementById("new-message-input").removeChild(document.getElementById("new-message-input").childNodes[0])
            }
        }
    }, [MsgValue])

    useEffect(() => {
    }, [render])

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
        <div className="main-bloc">
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
            <ScrollableFeed className="messages-container">
                {
                    conversation === undefined ? undefined : 
                    conversation.messages.map((elem, i) => {
                        return (
                            <div className={`message${elem._id_creator === id ? " mine" : ""}`} key={i}>
                                <div className="msg-img-creator-wrapper">
                                    <img className="msg-img-creator" src={`/member/image/${elem._id_creator}`}></img>
                                </div>
                                <p>
                                {
                                    elem.text
                                }  
                                </p>
                                <div className="message-menu-wrapper">
                                    <>
                                    {
                                        admin === false && elem._id_creator !== id  ? undefined : 
                                        <div className="message-menu-button" onClick={e => {
                                            if(document.getElementById(`message-menu-${elem._id}`).classList.contains("unvisible"))
                                                document.getElementById(`message-menu-${elem._id}`).classList.remove("unvisible");
                                            else 
                                                document.getElementById(`message-menu-${elem._id}`).classList.add("unvisible");
                                        }}>
                                            <svg width="22px" height="22px" viewBox="0 0 22 22">
                                                <circle cx="11" cy="6" r="2" strokeWidth="1px" fill="var(--placeholder-icon)"></circle>
                                                <circle cx="11" cy="11" r="2" strokeWidth="1px" fill="var(--placeholder-icon)"></circle>
                                                <circle cx="11" cy="16" r="2" strokeWidth="1px" fill="var(--placeholder-icon)"></circle>
                                            </svg>
                                        </div>
                                    } 
                                    </>                                
                                    <div id={`message-menu-${elem._id}`} className="unvisible message-menu">
                                        {
                                            admin === false && elem._id_creator !== id ? undefined : 
                                            <h1 onClick={(e) => {
                                                handleDeleteMessage(elem._id);
                                            }}>Supprimer</h1>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </ScrollableFeed>
            
            <div className="new-message-input-container"> 
                <div className="new-message-input-wrapper">
                    <div className="new-message-input-wrapper2">
                        <EditableElement onChange={handleChange}>
                            <p id="new-message-input"
                                data-placeholder="Aa"
                                onKeyDown={(e) => {
                                    let KeysPressed = bufferKey;
                                    if(KeysPressed.find(obj => { return obj === e.key}) === undefined) {
                                        KeysPressed.push(e.key);
                                        setBufferKey(KeysPressed);
                                    }

                                    if(MsgValue.length === 0 && e.key === "Backspace") setMsgValue("");

                                    if(KeysPressed.find(obj => { return obj === "Shift"}) === undefined && e.key === "Enter") {
                                        handleSubmitNewMessage();
                                    }

                                    setRender(!render);
                                }}
                                onKeyUpCapture={
                                    (e) => {
                                        let KeysPressed = bufferKey;
                                        KeysPressed.splice(KeysPressed.indexOf(KeysPressed[e.key],0),1);
                                        
                                        setBufferKey(KeysPressed);
                                    }
                                }
                            >
                            </p>
                        </EditableElement>
                    </div>
                    
                    <div className="submit" onClick={handleSubmitNewMessage}>
                        <svg width="20px" height="20px" viewBox="0 0 24 24">
                            <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" fill="#f0f0f0">
                            </path>
                        </svg>
                    </div>
                    
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

const EditableElement = (props) => {
    const { onChange } = props;
    const element = useRef();
    let elements = React.Children.toArray(props.children);
    if (elements.length > 1) {
      throw Error("Can't have more than one child");
    }
    const onMouseUp = () => {
      const value = element.current?.value || element.current?.innerText;
      if (onChange) {
        onChange(value);
      }
    };
    useEffect(() => {
      const value = element.current?.value || element.current?.innerText;
      if (onChange) {
        onChange(value);
      }
    }, []);
    elements = React.cloneElement(elements[0], {
      contentEditable: true,
      suppressContentEditableWarning: true,
      ref: element,
      onKeyUp: onMouseUp
    });
    return elements;
  };

const ModifyConvBlock = ({conversation, ws, display, id, setDisplayChangeNameConv, setDisplayLeaveConv, setDisplayAddMember}) => {
    const [admin, setAdmin] = useState(false);
    const [displayMembers, setDisplayMembers] = useState(false);
    const [displayParameters, setDisplayParameters] = useState(false);
    const [displayInputName, setDisplayInputName] = useState({value: false, id: ""});
    const [newNameValue, setNewName] = useState("");

    useEffect(() => {
        setNewName("");
    }, [displayInputName])

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

    const handleChangeName = () => {
        setDisplayChangeNameConv(true);
    }

    const handleLeave = () => {
        setDisplayLeaveConv(true);
    }

    const handleAddMember = () => {
        setDisplayAddMember(true);
    }

    const handleUpgradeAdmin = (id) => {
        ws.send(JSON.stringify({
            task: "upgrade to admin",
            _id: conversation._id,
            member: id
        }));
    }

    const handleKick = (id) => {
        ws.send(JSON.stringify({
            task: "delete member",
            _id: conversation._id,
            person: id
        }));
    }

    const handleNewName = (id) => {
        ws.send(JSON.stringify({
            task: "update pseudo",
            _id: conversation._id,
            member: id,
            pseudo: newNameValue
        }));
    }

    return (
        <div className={`modify-conv-wrapper ${display === true ? "" : " unvisible"}`}>
            <div className="header-modify">
                <h1 className="title-conv">{conversation !== undefined ? conversation.title : undefined}</h1>
            </div>
            <div className="conv-option" onClick={(e) => {setDisplayParameters(!displayParameters)}}>
                <h1>Parametres de la discussion</h1>
                <i className={`fa fa-solid${displayParameters === false ? " fa-angle-down" : " fa-angle-up"}`}></i>
            </div>
            <div className={`menu-modify-container${displayParameters === false ? " unvisible": ""}`}>
                    <div className="wrapper-menu-option">
                        {
                            admin === false ? undefined : 
                            <>
                                <div className="menu-option" onClick={handleChangeName}>
                                    <svg viewBox="0 0 36 36" height="24" width="24">
                                        <path d="M20.953 12.569a.75.75 0 00-1.06 0l-8.938 8.937a4.004 4.004 0 00-.715.973l-2.121 4.05c-.455.867.481 1.804 1.35 1.349l4.049-2.121c.358-.188.686-.429.972-.715l8.938-8.937a.75.75 0 000-1.061l-2.475-2.475zm3.889 1.061a.75.75 0 001.06 0l1.363-1.362a2.5 2.5 0 00-3.536-3.536l-1.362 1.362a.75.75 0 000 1.06l2.475 2.476z"></path>
                                    </svg>
                                    <h1>Modifier le nom de la discussion</h1>
                                </div>
                                <div className="menu-option" onClick={handleAddMember}>
                                    <svg viewBox="0 0 36 36" height="24" width="24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18 9c-.69 0-1.25.56-1.25 1.25v6.25a.25.25 0 01-.25.25h-6.25a1.25 1.25 0 100 2.5h6.25a.25.25 0 01.25.25v6.25a1.25 1.25 0 102.5 0V19.5a.25.25 0 01.25-.25h6.25a1.25 1.25 0 100-2.5H19.5a.25.25 0 01-.25-.25v-6.25C19.25 9.56 18.69 9 18 9z"></path>
                                    </svg>
                                    <h1>Ajouter un membre</h1>
                                </div>
                            </>
                        }   
                        <div className="menu-option" onClick={handleLeave}>
                            <svg viewBox="0 0 36 36" height="24" width="24">
                                <path d="M8 7.5a1 1 0 00-1 1V10a1 1 0 001 1h20a1 1 0 001-1V8.5a1 1 0 00-1-1H8z"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M9 13.5a.5.5 0 01.5-.5h17a.5.5 0 01.5.5v12a3 3 0 01-3 3H12a3 3 0 01-3-3v-12zm4.5 3.25c0-.69.56-1.25 1.25-1.25h6.5a1.25 1.25 0 110 2.5h-6.5c-.69 0-1.25-.56-1.25-1.25z"></path>
                            </svg>
                            <h1>Quitter la discussion</h1>
                        </div>
                    </div>
            </div>
            <div className="conv-option" onClick={(e) => {setDisplayMembers(!displayMembers)}}>
                <h1>Membres de la discussion</h1>
                <i className={`fa fa-solid${displayMembers === false ? " fa-angle-down" : " fa-angle-up"}`}></i>
            </div>
            <div className={`members-container${displayMembers === false ? " unvisible": ""}`}>
                {
                    conversation === undefined ? undefined : 
                    conversation.members.map((elem,i) => {
                        return(
                            <div key={i} className="member-wrapper">
                                <img className="member-image" src={`/member/image/${elem._id}`}/>
                                <div className="right-member-part">
                                    <div>
                                        <>
                                        {
                                            displayInputName.value === false ? 
                                                <h1 className={elem.role}>{elem.pseudo}</h1> :
                                                elem._id !== displayInputName.id ?
                                                    <h1 className={elem.role}>{elem.pseudo}</h1> :
                                                    <input placeholder={elem.pseudo} value={newNameValue} onKeyDown={(e) => {
                                                        if(e.key === "Enter") {
                                                            handleNewName(elem._id)
                                                            setDisplayInputName({
                                                                value: false,
                                                                id: ""
                                                            });
                                                        }
                                                        else if(e.key == "Escape") {
                                                            setDisplayInputName({
                                                                value: false,
                                                                id: ""
                                                            });
                                                        }
                                                    }} 
                                                    onChange={(e) => {
                                                        setNewName(e.target.value);
                                                    }}></input>
                                        }
                                        </>                                        
                                        <>
                                        {
                                            elem.role !== "admin" ? undefined : <p>Admin</p>
                                        }
                                        </>
                                    </div>
                                    <div className="options-control-member" onClick={(e) => {
                                        setDisplayInputName({value: false, id: ""});
                                        if(document.getElementById(`${elem._id}-menu`) !== null){
                                            if(document.getElementById(`${elem._id}-menu`).classList.contains("unvisible"))
                                                document.getElementById(`${elem._id}-menu`).classList.remove("unvisible")
                                            else 
                                                document.getElementById(`${elem._id}-menu`).classList.add("unvisible")
                                        }
                                        for(const it of document.getElementsByClassName("menu-conv-user-container")) {
                                            if(it !== document.getElementById(`${elem._id}-menu`))
                                                it.classList.add("unvisible");
                                        }
                                        
                                    }}>
                                        <svg viewBox="0 0 36 36" height="28" width="28">
                                            <path
                                                d="M12.5 18A2.25 2.25 0 118 18a2.25 2.25 0 014.5 0zm7.75 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm5.5 2.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z">
                                            </path>
                                        </svg>
                                    </div>
                                    <>
                                    {
                                        (elem._id !== id && admin !== true) || (elem.role === "admin" && elem._id !== id)  ? undefined : 
                                        <div id={`${elem._id}-menu`} className="unvisible menu-conv-user-container">
                                            <>
                                            {
                                                elem._id !== id && admin !== true ? undefined : 
                                                <div onClick={(e) => {
                                                    setDisplayInputName({
                                                        value: !displayInputName.value,
                                                        id: elem._id
                                                    });
                                                    if(document.getElementById(`${elem._id}-menu`) !== null){
                                                        if(document.getElementById(`${elem._id}-menu`).classList.contains("unvisible"))
                                                            document.getElementById(`${elem._id}-menu`).classList.remove("unvisible")
                                                        else 
                                                            document.getElementById(`${elem._id}-menu`).classList.add("unvisible")
                                                    }
                                                }}>
                                                    <h2>Changer pseudo</h2>
                                                </div>
                                            }
                                            </>
                                            <>
                                            {
                                                admin !== true || elem.role === "admin" ? undefined : 
                                                <div onClick={(e) => {
                                                    handleUpgradeAdmin(elem._id)
                                                }}>
                                                    <h2>Rendre administrateur</h2>
                                                </div>
                                            }
                                            </>
                                            <>
                                            {
                                                elem._id === id || admin !== true || elem.role === "admin" ? undefined : 
                                                <div onClick={(e) => {
                                                    handleKick(elem._id)
                                                }}>
                                                    <h2>Exclure du groupe</h2>
                                                </div>
                                            }
                                            </>
                                            
                                        </div>
                                    }
                                    </>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const ChatNameEdit = ({placeholder, setNewName, display, setDisplay}) => {
    const [value, setValue] = useState("");
    const [canConfirm, setCanConfirm] = useState(false)

    const handleCancel = () => {
        setValue("");
        setDisplay(!display);
    }

    const handleValidation = () => {
        setNewName(value);
        setValue("");
        setDisplay(!display);
    }

    useEffect(() => {
        setCanConfirm(value.length !== 0);
    }, [value]);

    return (
        <div className={`chat-edit-container${display === false ? " unvisible" : ""}`}>
            <div className="chat-edit-wrapper">
                <h2>Modifier le nom de la discussion</h2>
                <input type={"text"} placeholder={placeholder} value={value} onChange={(e) => {
                    setValue(e.target.value);
                }
                }/>
                <div >
                    <button className="cancel" onClick={handleCancel}>Annuler</button>
                    <button className="confirm" onClick={handleValidation} disabled={(!canConfirm)}>Valider</button>
                </div>
            </div>
        </div>
    )
}

const LeaveConv = ({display, setDisplay, callback}) => {
    
    const handleCancel = () => {
        setDisplay(false);
        callback(false);
    }

    const handleValidation = () => {
        setDisplay(false);
        callback(true);
    }

    return (
        <div className={`chat-edit-container${display === true ? "" : " unvisible"}`}>
            <div className="chat-edit-wrapper">
                <h2>Quitter la conversation</h2>
                <p>Vous vous appretez à quitter la conversation. Veuillez confirmez votre choix.</p>
                <div>
                    <button className="cancel" onClick={handleCancel}>Annuler</button>
                    <button className="confirm" onClick={handleValidation}>Confirmer</button>
                </div>
            </div>
        </div>
    )
}

const AddMember = ({display, setDisplay, callback}) => {
    const [value, setValue] = useState("");
    
    const handleCancel = () => {
        setValue("");
        setDisplay(false);
        callback(
            {
                validation: false
            });
    }

    const handleValidation = () => {
        setValue("");
        setDisplay(false);
        callback(
            {
                validation: true,
                pseudo: value,
            }
        );
    }

    return (
        <div className={`chat-edit-container${display === true ? "" : " unvisible"}`}>
            <div className="chat-edit-wrapper">
                <h2>Ajouter un membre à la conversation</h2>
                <input type="text" value={value} onChange={(e) => {setValue(e.target.value)}}/>
                <div>
                    <button className="cancel" onClick={handleCancel}>Annuler</button>
                    <button className="confirm" onClick={handleValidation}>Confirmer</button>
                </div>
            </div>
        </div>
    )
}