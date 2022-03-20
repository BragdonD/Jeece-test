import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { w3cwebsocket } from "websocket";
import "./meetings.css"

export const Meetings = ({meetings, setDisplay, display, id, ws}) => {
    const sendResponseToMeeting = (meeting, response) => {
        ws.send(JSON.stringify({
            task: response !== "accepted" ? "refuse meeting" : "accept meeting",
            _id: meeting,
            member: id,
        }));
    }

    const handleDeleteMeeting = (meeting) => {
        ws.send(JSON.stringify({
            task: "delete meeting",
            _id: meeting,
        }));
    }

    return (
        <div className={`meetings-container${display === true ? "" : " unvisible"}`}>
            <div>
                <button onClick={(e) => {setDisplay(false)}}>
                    <i className="fa fa-solid fa-arrow-left"></i>
                </button>
                <h1>Réunions</h1>
            </div>
            <div  className={`meetings-wrapper`}>
                {
                    meetings.map((elem, i) => {
                        return (
                            <div className={`meeting ${elem.members.find(obj => {return obj._id === id}).status}`} key={i}>
                                <>
                                {
                                    elem.members.find(obj => {return obj._id === id}).role !== "admin" ? undefined :
                                    <div className="delete" onClick={(e) => {
                                        handleDeleteMeeting(elem._id)
                                    }}>
                                        <svg viewBox="0 0 36 36" height="24" width="24">
                                            <path d="M8 7.5a1 1 0 00-1 1V10a1 1 0 001 1h20a1 1 0 001-1V8.5a1 1 0 00-1-1H8z"></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9 13.5a.5.5 0 01.5-.5h17a.5.5 0 01.5.5v12a3 3 0 01-3 3H12a3 3 0 01-3-3v-12zm4.5 3.25c0-.69.56-1.25 1.25-1.25h6.5a1.25 1.25 0 110 2.5h-6.5c-.69 0-1.25-.56-1.25-1.25z"></path>
                                        </svg>
                                    </div>
                                }
                                </>
                                <h1>{elem.title}</h1>
                                <p>{(new Date(elem.date)).toDateString() + " à " + (new Date(elem.date)).toLocaleTimeString()}</p>
                                <>
                                {
                                    elem.members.find(obj => {return obj._id === id}).status !== "Pending" ? undefined :
                                    <div>
                                        <button className="cancel" onClick={(e) => {
                                            sendResponseToMeeting(elem._id, "refused")
                                        }}>Refuser</button>
                                        <button className="confirm"onClick={(e) => {
                                            sendResponseToMeeting(elem._id, "accepted")
                                        }}>Accepter</button>                                   
                                    </div>
                                }
                                </>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}