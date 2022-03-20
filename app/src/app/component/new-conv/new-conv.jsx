import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { w3cwebsocket } from "websocket";
import "./new-conv.css"

export const NewConv = ({ display, setDisplay, ws }) => {
    const [nbPeople, setNbPeople] = useState(0);
    const [PeopleList, setPeopleList] = useState([]);
    const [title, setTitle] = useState("");
    const [newPerson, setNewPerson] = useState("");

    useEffect(() => {}, [display]);
    useEffect(() => {}, [nbPeople]);

    const handleCancel = () => {
        setTitle("");
        setPeopleList([]);
        setDisplay(false);
    }

    const handleSubmit = () => {
        if(title.length !== 0 && PeopleList.length !== 0) {
            ws.send(JSON.stringify({
                task: "new conv",
                title: title,
                people: PeopleList,
            }));
            handleCancel();
        }
    }

    const addPeople = () => {
        if(newPerson.length !== 0) {
            let temp = PeopleList;
            temp.push(newPerson);
            setPeopleList(temp);
            setNbPeople(temp.length);
            setNewPerson("");
        }   
    }

    return (
        <div className={display === false ? "unvisible" : "" + " new-conv-container"}>
            <div className="new-conv-wrapper">
                <h1>Créer une nouvelle conversation</h1>
                <input type={"text"} value={title} placeholder={"Nom"} onChange={e => {setTitle(e.target.value)}}></input>
                <div className="people-list">
                    {
                        PeopleList.map((elem, i) => {
                            return(
                                <p key={i}>
                                    {elem}
                                    <button onClick={e => {
                                        let temp = PeopleList;
                                        temp.splice(temp.findIndex(obj => {
                                            return obj === elem;
                                        }),1);
                                        setPeopleList(temp);
                                        setNbPeople(temp.length);
                                    }}>X</button>
                                </p>
                            )
                        })
                    }
                </div>
                <div className="add-people-container">
                    <input type={"text"} value={newPerson} placeholder={"Pseudo à ajouter"} onChange={e => {setNewPerson(e.target.value)}}></input> 
                    <button className="add-people-to-list" onClick={addPeople}>+</button>
                </div>
                <div className="control-panel">
                    <button className="cancel" onClick={handleCancel}>Annuler</button>
                    <button className="confirm" onClick={handleSubmit}>Créer</button>
                </div>
            </div>
        </div>
    )
}

NewConv.propTypes = {
    display: PropTypes.bool,
    setDisplay: PropTypes.func,
    ws: PropTypes.objectOf(w3cwebsocket)
}