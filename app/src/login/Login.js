import { useEffect, useState } from "react";
import { Form } from "./components/form.jsx";

export const LoginForm = () => {
    const [login, setLogin] = useState(false);
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit] = useState(false);
    const [login_data, setLoginData] = useState([]);

    useEffect(() => {
        setLoginData([
            {
                placeholder: "Pseudo",
                type: "text",
                callback: setPseudo,
            },
            {
                placeholder: "Password",
                type: "password",
                callback: setPassword,
            },
            {
                placeholder: "Envoyer",
                type: "submit",
                callback: setSubmit,
            }
        ]);
    }, [])

    const swapLogin = () => {
        setLogin(!login);
        if(!login) {
            setLoginData([
                {
                    placeholder: "Prénom",
                    type: "text",
                    callback: setPrenom,
                },
                {
                    placeholder: "Nom",
                    type: "text",
                    callback: setNom,
                },
                {
                    placeholder: "Pseudo",
                    type: "text",
                    callback: setPseudo,
                },
                {
                    placeholder: "Email",
                    type: "email",
                    callback: setEmail,
                },
                {
                    placeholder: "Mot de Passe",
                    type: "password",
                    callback: setPassword,
                },
                {
                    placeholder: "Envoyer",
                    type: "submit",
                    callback: setSubmit,
                }
            ]);
        }
        else {
            setLoginData([
                {
                    placeholder: "Pseudo",
                    type: "text",
                    callback: setPseudo,
                },
                {
                    placeholder: "Mot de Passe",
                    type: "password",
                    callback: setPassword,
                },
                {
                    placeholder: "Envoyer",
                    type: "submit",
                    callback: setSubmit,
                }
            ]);
        }
    }

    const renderLink = () => {
        if(login) {
            return(
                <p>Pas encore membre <a href="#" onClick={swapLogin}>register</a>.</p>
            )
        }
        else {
            return(
                <p>Déjà membre <a href="#" onClick={swapLogin}>login</a>.</p>
            )
        }
    }

    return(
        <div>
            <Form inputs={login_data}></Form>
            {
                renderLink()
            }
        </div>
    )
};