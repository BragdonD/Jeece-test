import React, { useEffect, useState } from "react";
import { w3cwebsocket } from "websocket";
import PropTypes from 'prop-types';
import "./chat-block.css";

export const ChatBlock = ({conversation, ws, id}) => {
    const [displayParameter, setDisplayParameter] = useState(true);
    const [displayChangeNameConv, setDisplayChangeNameConv] = useState(false);
    const [displayLeaveConv, setDisplayLeaveConv] = useState(false);

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
        if(value) {
            ws.send(JSON.stringify({
                task: "delete member",
                _id: conversation._id,
                person: id
            }));
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

    useEffect(() => {
        window.addEventListener('resize', handleResize)
    }, []);

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
                setDisplayChangeNameConv={setDisplayChangeNameConv}
                setDisplayLeaveConv={setDisplayLeaveConv}
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
        console.log("here");
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

const ModifyConvBlock = ({conversation, ws, display, id, setDisplayChangeNameConv, setDisplayLeaveConv}) => {
    const [admin, setAdmin] = useState(false);
    const [displayMembers, setDisplayMembers] = useState(false);
    const [displayParameters, setDisplayParameters] = useState(false);

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
                                <div className="menu-option">
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