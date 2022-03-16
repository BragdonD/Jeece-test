import React, { useEffect, useState } from "react";
import { updateData, checkValidity } from "./function";
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
    const [showInputModif, setShowInputModif] = useState(false);
    const [dataInputModif, setDataInputModif] = useState({});

    useEffect(() => {
        setData(member_data)
        if(member_data.img.length !== 0) setImgURL(`/image/${member_data.img}`);
    }, [member_data])

    const handleClose = () => {
        callback(false);
    }

    const HandleClik = () => {

    }

    return(
        <div className="pref-container" style={{display: display ? "" : "none"}}>
            <div className="pref-wrapper">
                <button className="close-button" onClick={handleClose}>x</button>
                <div className="pref-input-container">
                    <DisplayBlockImg url={ImgURL} callback={setShowInputModif} setDataToModif={setDataInputModif}></DisplayBlockImg>
                    <DisplayBlockText title="Prénom" data={data.firstName} callback={setShowInputModif} setDataToModif={setDataInputModif}></DisplayBlockText>
                    <DisplayBlockText title="Nom" data={data.lastName} callback={setShowInputModif} setDataToModif={setDataInputModif}></DisplayBlockText>
                    <DisplayBlockText title="Pseudo" data={data.pseudo} callback={setShowInputModif} setDataToModif={setDataInputModif}></DisplayBlockText>
                    <DisplayBlockText title="Mot de passe" callback={setShowInputModif} setDataToModif={setDataInputModif}></DisplayBlockText>
                </div>
                <DataModifBlock display={showInputModif} setDisplay={setShowInputModif} 
                    title={dataInputModif.title !== undefined ? dataInputModif.title : "" }
                    placeholder={dataInputModif.placeholder !== undefined ? dataInputModif.placeholder : ""}
                    inputType={dataInputModif.type !== undefined ? dataInputModif.type : ""}
                    imgSrc={ImgURL}
                ></DataModifBlock>
            </div>
        </div>
    )
};

Preference.propTypes = {
    member_data: PropTypes.object,
    display: PropTypes.bool,
    callback: PropTypes.func,
}

const DisplayBlockText = ({title, data, callback, setDataToModif}) => {

    const handleClick = () => {
        setDataToModif({
            type: "text",
            title: title,
            placeholder: data
        });
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
    setDataToModif: PropTypes.func,
}

const DisplayBlockImg = ({url, callback, setDataToModif}) => {

    const handleClick = () => {
        setDataToModif({
            type: "file",
            title: "Photo de profil",
            placeholder: url
        });
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
    setDataToModif: PropTypes.func,
}

const DataModifBlock = ({ inputType, title, placeholder, display, setDisplay, upload, callback, imgSrc }) => {
    const [value, setValue] = useState();
    const [IMG, setImg ] = useState(imgSrc);

    useEffect(() => {
        setImg(imgSrc);
    }, [imgSrc]);

    const handleClose = () => {
        setValue();
        setImg(imgSrc);
        setDisplay(false);
    }

    const handleSubmit = async () => {
        let name = "";
        switch (title.toLocaleLowerCase()) {
            case "prénom":
                name = "firstName";
                break;
            case "nom":
                name = "lastName";
                break;
            case "mot de passe":
                name = "password";
                break;
            case "photo de profil":
                name = "img";
                break;
            case "pseudo":
                name = "pseudo";
                break;
            default:
                break;
        }
        if(checkValidity(name, value)) {
            const res = await updateData(name, value);
            if(res === "updated") {
                window.location.reload();
            }
            else {
                
            }
        }
        else {
            document.getElementById(inputType === "text" ? "input-modif" : "new-input-img").classList.add("wrong");
        }
        
    }

    /**
     * 
     * @param {Event} e 
     */
    const handleChange = (e) => {
        setValue(e.target.files[0])
        setImg(URL.createObjectURL(e.target.files[0]));
    }

    const imgClick = () => {
        document.getElementById("new-input-img").click();
    }
    
    return (
        <div className={display === false ? "unvisible" : "" + " input-modif-container"}>
            <div className="input-modif-wrapper">
                <h1>{"Modifier " + title}</h1>
                {
                    inputType === "text" ? 
                        <input id="input-modif" type={inputType} onChange={(e) => {setValue(e.target.value)}} placeholder={placeholder} value={value === undefined ? "" : value}></input> :
                        <div className="input-modif-file-container">
                            <img  src={IMG}/>
                            <i onClick={imgClick}></i>
                            <input id="new-input-img" type={"file"} onChange={handleChange}></input>
                        </div>
                }
                
                <div className="control-panel">
                    <button className="cancel" onClick={handleClose}>Annuler</button>
                    <button className="confirm" onClick={handleSubmit}>Confirmer</button>
                </div>
            </div>
        </div>
    )
}

DataModifBlock.propTypes = {
    inputType : PropTypes.string,
    title: PropTypes.string,
    placeholder : PropTypes.string,
    display : PropTypes.bool,
    setDisplay : PropTypes.func,
    upload : PropTypes.func,
    callback : PropTypes.func,
    imgSrc: PropTypes.string,
}