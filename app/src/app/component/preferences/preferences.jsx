import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./preferences.css"

export const Preference = ({ member_data }) => {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(Object);
    const [show_error, setError] = useState(false);
    const [ImgURL, setImgURL] = useState("");

    useEffect(() => {
        
    }, [member_data]);

    useEffect(() => {
        setData(member_data)
        if(member_data.img.length !== 0) setImgURL(`/image/${member_data.img}`);
    }, [member_data])

    return(
        <div className="pref-container">
            <div className="pref-wrapper">
                <button>X</button>
                <div className="pref-input-container">
                    <div className="input">
                        <div className="main-bloc">
                            <img src={ImgURL} height="60" width="60"></img>
                            <button>Modifier</button>
                        </div>
                    </div>
                    <div className="input">
                        <div className="title-bloc">
                            <h1>Prénom</h1>
                        </div>
                        <div className="main-bloc">
                            <h1>{data.firstName === undefined ? "" : data.firstName}</h1>
                            <button>Modifier</button>
                        </div>
                    </div>
                    <div className="input">
                        <div className="title-bloc">
                            <h1>Prénom</h1>
                        </div>
                        <div className="main-bloc">
                            <h1>{data.lastName === undefined ? "" : data.lastName}</h1>
                            <button>Modifier</button>
                        </div>
                    </div>
                    <div className="input">
                        <div className="title-bloc">
                            <h1>Nom</h1>
                        </div>
                        <div className="main-bloc">
                            <h1>{data.pseudo === undefined ? "" : data.pseudo}</h1>
                            <button>Modifier</button>
                        </div>
                    </div>
                    <div className="input">
                        <div className="title-bloc">
                            <h1>Password</h1>
                        </div>
                        <div className="main-bloc">
                            <button>Modifier</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="update-input">
                <input></input>
                <div>
                    <button>Annuler</button>
                    <button>Confirmer</button>
                </div>
            </div>
        </div>
    )
}

Preference.propTypes = {
    member_data: PropTypes.object,
}

