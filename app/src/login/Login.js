import React, { useEffect, useState } from "react";
import { Form } from "./components/form.jsx";
import { SubmitForm } from "./function.js"
import "./login.css";

const initialData = [
    {
        placeholder: "Prénom",
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
    const [submit, setSubmit] = useState(false);  
    const [show_error, setError] = useState(false);
    const [render, setRender] = useState(false)
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
                console.log("here2");
                SubmitForm(pseudo, password);
            }
        }
    }
    
    login_data[0]["callback"] = setPseudo;
    login_data[1]["callback"] = setPassword;
    login_data[2]["callback"] = checkIntegrityLoginForm;

    useEffect(() => {
        
        let correct_input = 0;
        console.log("here");
        setSubmit(false);
    }, [submit]);

    return(
        <div className="container">
            <div className="login-form-wrapper">
                <h1 id="login-form-title">Login</h1>
                <Form inputs={login_data}></Form>
                <p id="error-p" className="error unvisible">Aucun compte trouver avec ces identifiants</p>
                <p>Pas encore membre <a href="/register">register</a>.</p>
            </div>
        </div>
    )
};