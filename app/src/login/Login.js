import { useEffect, useState } from "react";
import axios from "axios";
import { Form } from "./components/form.jsx";
import "./login.css";

export const LoginForm = () => {
    const [login, setLogin] = useState(true);
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit] = useState(false);
    const [login_data, setLoginData] = useState([]);

    useEffect(() => {
        if(login == false) {
            document.getElementById("login-form-title").innerText = "Register";
            setLoginData([
                {
                    placeholder: "Prénom",
                    type: "text",
                    callback: setPrenom,
                    className: "",
                },
                {
                    placeholder: "Nom",
                    type: "text",
                    callback: setNom,
                    className: "",
                },
                {
                    placeholder: "Pseudo",
                    type: "text",
                    callback: setPseudo,
                    className: "",
                },
                {
                    placeholder: "Email",
                    type: "email",
                    callback: setEmail,
                    className: "",
                },
                {
                    placeholder: "Mot de Passe",
                    type: "password",
                    callback: setPassword,
                    className: "",
                },
                {
                    placeholder: "Envoyer",
                    type: "submit",
                    callback: setSubmit,
                }
            ]);
        }
        else {
            document.getElementById("login-form-title").innerText = "Login";
            setLoginData([
                {
                    placeholder: "Pseudo",
                    type: "text",
                    callback: setPseudo,
                    className: "",
                },
                {
                    placeholder: "Mot de Passe",
                    type: "password",
                    callback: setPassword,
                    className: "",
                },
                {
                    placeholder: "Envoyer",
                    type: "submit",
                    callback: setSubmit,
                }
            ]);
        }
    }, [login]);

    useEffect(() => {
        let correct_input = 0;
        if(login) {
            let temp_data = [
                {
                    placeholder: "Pseudo",
                    type: "text",
                    callback: setPseudo,
                    className: "",
                },
                {
                    placeholder: "Mot de Passe",
                    type: "password",
                    callback: setPassword,
                    className: "",
                },
                {
                    placeholder: "Envoyer",
                    type: "submit",
                    callback: setSubmit,
                }
            ];

            if(pseudo.length == 0) {
                temp_data[0].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[0].className = "valid";
            }
            if(password.length == 0) {
                temp_data[1].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[1].className = "valid";
            }
            if(correct_input == 2) {
                SubmitForm();
            }
            setLoginData(temp_data);
        }
        else {
            let temp_data = [
                {
                    placeholder: "Prénom",
                    type: "text",
                    callback: setPrenom,
                    className: "",
                },
                {
                    placeholder: "Nom",
                    type: "text",
                    callback: setNom,
                    className: "",
                },
                {
                    placeholder: "Pseudo",
                    type: "text",
                    callback: setPseudo,
                    className: "",
                },
                {
                    placeholder: "Email",
                    type: "email",
                    callback: setEmail,
                    className: "",
                },
                {
                    placeholder: "Mot de Passe",
                    type: "password",
                    callback: setPassword,
                    className: "",
                },
                {
                    placeholder: "Envoyer",
                    type: "submit",
                    callback: setSubmit,
                }
            ];
            if(pseudo.length == 0) {
                temp_data[2].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[2].className = "valid";
            }
            if(password.length == 0) {
                temp_data[4].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[4].className = "valid";
            }
            if(prenom.length == 0) {
                temp_data[0].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[0].className = "valid";
            }
            if(nom.length == 0) {
                temp_data[1].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[1].className = "valid";
            }
            if(email.length == 0) {
                temp_data[3].className = "wrong";
            }
            else {
                correct_input++;
                temp_data[3].className = "valid";
            }
            if(correct_input == 5) {
                SubmitForm();
            }
            setLoginData(temp_data);
        }

        setSubmit(false);
    }, [submit])

    const swapLogin = async () => {
        setLogin(!login);
    }

    const renderLink = () => {
        if(login) {
            return(
                <p>Pas encore membre <a href="#login" onClick={swapLogin}>register</a>.</p>
            )
        }
        else {
            return(
                <p>Déjà membre <a href="#register" onClick={swapLogin}>login</a>.</p>
            )
        }
    }

    const SubmitForm = async () => {
        try {
            let url = "http://localhost:3000";
            let param;

            if(login) {
                url += "/login";
            }
            else {
                url += "/register";
            }
            console.log(url)
            const res = await axios({
                method: "post", 
                url: url,
                data: {
                    pseudo: pseudo,
                },
            }).then( x => x );
            console.log(res);
        } catch(error) {
            console.log(error);
        }
    }

    return(
        <div className="container">
            <div className="login-form-wrapper">
                <h1 id="login-form-title">Login</h1>
                <Form inputs={login_data}></Form>
                {
                    renderLink()
                }
            </div>
        </div>
    )
};