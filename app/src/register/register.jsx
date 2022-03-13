import { useEffect, useState } from "react";
import { Form } from "../components/form.jsx";
import { SubmitForm, CheckEmail, CheckPassword } from "./function.js";
import "./register.css";

const initialData = [
    {
        placeholder: "Prénom",
        type: "text",
        className: "",
    },
    {
        placeholder: "Nom",
        type: "text",
        className: "",
    },
    {
        placeholder: "Email",
        type: "email",
        className: "",
    },
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

export const RegisterForm = () => {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [login_data, setData] = useState(initialData);
    const [show_error, setError] = useState(false);
    const [render, setRender] = useState(false);

    /**
     * 
     * @param {Boolean} value 
     */
     const checkIntegrityLoginForm = async (value) => {
        if(value === true) {
            console.log("here");
            let wrong = 0;
            if(prenom.length === 0) {
                login_data[0].className = "wrong"
                wrong++;
            }
            else {
                login_data[0].className = "correct"
            }
            if(nom.length === 0) {
                login_data[1].className = "wrong"
                wrong++;
            }
            else {
                login_data[1].className = "correct"
            }
            if(pseudo.length === 0) {
                login_data[3].className = "wrong"
                wrong++;
            }
            else {
                login_data[3].className = "correct"
            }
            if(!CheckPassword(password)) {
                login_data[4].className = "wrong"
                wrong++;
            }
            else {
                login_data[4].className = "correct"
            }
            if(!CheckEmail(email)) {
                login_data[2].className = "wrong"
                wrong++;
            }
            else {
                login_data[2].className = "correct"
            }
            setRender(!render);
            if(wrong !== 0) { return; }
            else {
                SubmitForm(pseudo, password, prenom, nom, email).then(msg => {
                    if(msg === "redirect") {
                        window.location = "/";
                    }
                    else if (msg === "already existing") {
                        setError(true);
                    }
                });
            }
        }
    }
    
    login_data[0]["callback"] = setPrenom;
    login_data[1]["callback"] = setNom;
    login_data[2]["callback"] = setEmail;
    login_data[3]["callback"] = setPseudo;
    login_data[4]["callback"] = setPassword;
    login_data[5]["callback"] = checkIntegrityLoginForm;

    useEffect(() => {
        if(show_error) {
            document.getElementById("error-p").classList.remove("unvisible");
        }
        else {
            document.getElementById("error-p").classList.add("unvisible");
        }
    }, [show_error]);

    return(
        <div className="register-container">
            <div className="register-form-wrapper">
                <h1 id="register-form-title">Register</h1>
                <Form inputs={login_data}></Form>
                <p id="error-p" className="error unvisible">Pseudo non disponible</p>
                <p>Déjà membre <a href="/login">Connectez-vous</a>.</p>
            </div>
        </div>
    )
};