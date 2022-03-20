import React, { useEffect, useState } from "react";
import { Form } from "../components/form.jsx";
import { SubmitForm } from "./function.js";
import "./login.css";

const initialData = [
    {
        placeholder: "Pseudo",
        type: "text",
        className: "",
    },
    {
        placeholder: "Mot de Passe",
        type: "password",
        className: "",
    },
    {
        placeholder: "Envoyer",
        type: "submit",
    }
];

export const LoginForm = () => {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [show_error, setError] = useState(false);
    const [render, setRender] = useState(false);
    const [login_data, setData] = useState(initialData);

    /**
     * 
     * @param {Boolean} value 
     */
    const checkIntegrityLoginForm = (value) => {
        if(value === true) {
            console.log("here");
            let wrong = 0;
            if(pseudo.length === 0) {
                login_data[0].className = "wrong"
                wrong++;
            }
            else {
                login_data[0].className = "correct"
            }
            if(password.length === 0) {
                login_data[1].className = "wrong"
                wrong++;
            }
            else {
                login_data[1].className = "correct"
            }
            setRender(!render);
            if(wrong !== 0) { return; }
            else {
                SubmitForm(pseudo, password).then(msg => {
                    if(msg === "redirect") {
                        window.location = "/";
                    }
                    else if (msg === "no match") {
                        setError(true);
                    }
                });
                
            }
        }
    }
    
    login_data[0]["callback"] = setPseudo;
    login_data[1]["callback"] = setPassword;
    login_data[2]["callback"] = checkIntegrityLoginForm;

    useEffect(() => {
        if(show_error) {
            document.getElementById("error-p").classList.remove("unvisible");
        }
        else {
            document.getElementById("error-p").classList.add("unvisible");
        }
    }, [show_error]);

    return(
        <div className="login-container">
            <div className="login-form-wrapper">
                <h1 id="login-form-title">Login</h1>
                <Form inputs={login_data}></Form>
                <p id="error-p" className="error unvisible">Aucun compte trouver avec ces identifiants</p>
                <p>Pas encore membre <a href="/register">Créez un compte</a>.</p>
            </div>
        </div>
    )
};