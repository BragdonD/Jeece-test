import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { w3cwebsocket } from "websocket";

export const NewMeetings = ({ display, setDisplay, ws }) => {
    const [nbPeople, setNbPeople] = useState(0);
    const [PeopleList, setPeopleList] = useState([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState();
    const [hour, setHour] = useState();
    const [newPerson, setNewPerson] = useState("");

    useEffect(() => {}, [display]);
    useEffect(() => {}, [nbPeople]);

    const handleCancel = () => {
        setTitle("");
        setPeopleList([]);
        setDate();
        setHour();
        setDisplay(false);
    }

    const handleSubmit = () => {
        if(title.length !== 0 && PeopleList.length !== 0 && date !== undefined && hour !== undefined) {
            ws.send(JSON.stringify({
                task: "new meetings",
                title: title,
                people: PeopleList,
                date: date,
                hour: hour
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
                <h1>Créer une nouvelle réunion</h1>
                <input type={"text"} value={title} placeholder={"Nom"} onChange={e => {setTitle(e.target.value)}}></input>
                <div >
                    <input type={"date"} value={date} onChange={(e) => {
                        setDate(e.target.value);
                    }}></input> 
                    
                </div>
                <div >
                    <input type={"time"} value={hour} onChange={(e) => {
                        setHour(e.target.value);
                    }}></input> 
                    
                </div>
                <div className="people-list">
                    {
                        PeopleList.map((elem, i) => {
                            return(
                                <div key={i}>
                                   <p>
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
                                   
                                </div>
                                
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

NewMeetings.propTypes = {
    display: PropTypes.bool,
    setDisplay: PropTypes.func,
    ws: PropTypes.objectOf(w3cwebsocket)
}