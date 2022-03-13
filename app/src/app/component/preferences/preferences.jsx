import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./preferences.css"

export const Preference = ({ member_data, display, callback }) => {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(Object);
    const [ImgURL, setImgURL] = useState("");

    useEffect(() => {
        setData(member_data)
        if(member_data.img.length !== 0) setImgURL(`/image/${member_data.img}`);
    }, [member_data])

    const handleClose = () => {
        callback(false);
    }

    return(
        <div className="pref-container" style={{display: display ? "" : "none"}}>
            <div className="pref-wrapper">
                <button className="close-button" onClick={handleClose}>x</button>
                <div className="pref-input-container">
                    <DisplayBlockImg url={ImgURL}></DisplayBlockImg>
                    <DisplayBlockText title="Prénom" data={data.firstName}></DisplayBlockText>
                    <DisplayBlockText title="Nom" data={data.lastName}></DisplayBlockText>
                    <DisplayBlockText title="Pseudo" data={data.pseudo}></DisplayBlockText>
                    <DisplayBlockText title="Password"></DisplayBlockText>
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
};

Preference.propTypes = {
    member_data: PropTypes.object,
    display: PropTypes.bool,
    callback: PropTypes.func,
}

const DisplayBlockText = ({title, data, callback}) => {

    const handleClick = () => {
        callback(true);
    }

    return (
        <div className="input">
            <div className="title-bloc">
                <h1>{title}</h1>
            </div>
            <div className="main-bloc">
                <h1>{data === undefined ? "" : data}</h1>
                <button onClick={handleClick}>Modifier</button>
            </div>
        </div>
    )
};

DisplayBlockText.propTypes = {
    title: PropTypes.string,
    data: PropTypes.string,
    callback: PropTypes.func,
}

const DisplayBlockImg = ({url, callback}) => {

    const handleClick = () => {
        callback(true);
    }

    return (
        <div className="input">
            <div className="main-bloc">
                <img src={url} height="60" width="60"></img>
                <button onClick={handleClick}>Modifier</button>
            </div>
        </div>
    )
};

DisplayBlockImg.propTypes = {
    url: PropTypes.string,
    callback: PropTypes.func,
}