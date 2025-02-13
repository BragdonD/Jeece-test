import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

export const UserMenu = ({visibilty, setShowPreference, setShowNewMeeting, setShowMeeting}) => {
    const handlePrefClick = () => {
        setShowPreference(true);
    }

    const handleDisconnection = () => {
        window.location = "/login"
    }

    const handleShowMeetingCick = () => {
        setShowNewMeeting(true);
    }

    return (
        <div className={(visibilty === true ? "" : "unvisible") + " user-menu-container"}>
            <ul>
                <li className="user-menu-choice" onClick={handlePrefClick}>
                    <div>
                        <svg viewBox="0 0 36 36" height="24" width="24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.842 7.526A1.5 1.5 0 0018.419 6.5h-.838a1.5 1.5 0 00-1.423 1.026l-.352 1.056c-.157.472-.541.827-1.006 1.003a8.93 8.93 0 00-.487.202c-.453.204-.976.225-1.42.002l-.997-.498a1.5 1.5 0 00-1.732.281l-.592.592a1.5 1.5 0 00-.28 1.732l.497.996c.223.445.202.968-.002 1.421-.072.16-.139.323-.202.487-.176.465-.531.849-1.003 1.006l-1.056.352A1.5 1.5 0 006.5 17.581v.838a1.5 1.5 0 001.026 1.423l1.056.352c.472.157.827.541 1.003 1.006.063.164.13.327.202.487.204.453.225.976.002 1.42l-.498.997a1.5 1.5 0 00.281 1.732l.593.592a1.5 1.5 0 001.73.28l.998-.497c.444-.223.967-.202 1.42.002.16.072.323.139.487.202.465.176.849.531 1.006 1.003l.352 1.056a1.5 1.5 0 001.423 1.026h.838a1.5 1.5 0 001.423-1.026l.352-1.056c.157-.472.541-.827 1.006-1.003.164-.063.327-.13.486-.202.454-.204.977-.225 1.421-.002l.997.498a1.5 1.5 0 001.732-.281l.592-.592a1.5 1.5 0 00.28-1.732l-.497-.996c-.223-.445-.202-.968.002-1.421.072-.16.139-.323.202-.487.176-.465.531-.849 1.003-1.006l1.056-.352a1.5 1.5 0 001.026-1.423v-.838a1.5 1.5 0 00-1.026-1.423l-1.056-.352c-.472-.157-.827-.541-1.003-1.006a8.991 8.991 0 00-.202-.487c-.204-.453-.225-.976-.002-1.42l.498-.997a1.5 1.5 0 00-.281-1.732l-.593-.592a1.5 1.5 0 00-1.73-.28l-.998.497c-.444.223-.967.202-1.42-.002a8.938 8.938 0 00-.487-.202c-.465-.176-.849-.531-1.006-1.003l-.352-1.056zM18 23.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"></path>
                        </svg>
                        <p>Préférences</p>
                    </div>
                </li>
                <li className="user-menu-choice" onClick={(e) => {setShowMeeting(true)}}>
                    <div>
                        <svg viewBox="0 0 36 36" height="24" width="24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18 28.074c6.394 0 11-4.467 11-10.57v-.002c0-6.103-4.606-10.498-11-10.498-6.392 0-10.998 4.395-11 10.498v.002c.001 2.091.415 3.98 1.384 5.562.458.747.563 1.664.29 2.5l-.728 2.41c-.2.614.373 1.188.964.986l3.668-1.125a4.26 4.26 0 012.39-.09c.953.232 1.967.327 3.032.327zM13 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                        </svg>
                        <p>Invitations aux réunions</p>
                    </div>
                </li>
                <li className="user-menu-choice" onClick={handleShowMeetingCick}>
                    <div>
                        <svg viewBox="0 0 36 36" height="24" width="24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18 9c-.69 0-1.25.56-1.25 1.25v6.25a.25.25 0 01-.25.25h-6.25a1.25 1.25 0 100 2.5h6.25a.25.25 0 01.25.25v6.25a1.25 1.25 0 102.5 0V19.5a.25.25 0 01.25-.25h6.25a1.25 1.25 0 100-2.5H19.5a.25.25 0 01-.25-.25v-6.25C19.25 9.56 18.69 9 18 9z"></path>
                        </svg>
                        <p>Créer une réunion</p>
                    </div>
                </li>
                <li className="user-menu-choice" onClick={handleDisconnection}>
                    <div>
                        <svg viewBox="0 0 36 36" height="24" width="24">
                            <path d="M21.498 14.75a1 1 0 001-1V12a4 4 0 00-4-4h-6.5a4 4 0 00-4 4v12a4 4 0 004 4h6.5a4 4 0 004-4v-1.75a1 1 0 00-1-1h-.5a1 1 0 00-1 1V24a1.5 1.5 0 01-1.5 1.5h-6.5a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h6.5a1.5 1.5 0 011.5 1.5v1.75a1 1 0 001 1h.5z"></path>
                            <path d="M14.498 16.75h9.752a.25.25 0 00.25-.25v-1.858a1 1 0 011.642-.766l4.002 3.356a1 1 0 010 1.532l-4.002 3.357a1 1 0 01-1.642-.767V19.5a.25.25 0 00-.25-.25h-9.752a1 1 0 01-1-1v-.5a1 1 0 011-1z"></path>
                        </svg>
                        <p>Déconnexion</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}

UserMenu.propTypes = {
    visibilty: PropTypes.bool,
    setShowPreference: PropTypes.func,
    setShowNewMeeting: PropTypes.func,
}
