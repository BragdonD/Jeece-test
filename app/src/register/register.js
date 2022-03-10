import { useEffect, useState } from "react";
import { Form } from "./components/form.jsx";

export const RegisterForm = () => {
    const [login, setLogin] = useState(false);
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit] = useState(false);
    const [login_data, setLoginData] = useState([]);
    const [show_error, setError] = useState(false)

    useEffect(() => {
        if(login === false) {
            document.getElementById("login-form-title").innerText = "Register";
            setLoginData()
        }
        else {
            document.getElementById("login-form-title").innerText = "Login";
            setLoginData();
        }
    }, [login]);

    useEffect(() => {
        let correct_input = 0;
        if(login) {
            
        }
        else {
            
        }

        setSubmit(false);
    }, [submit])

    const swapLogin = async () => {
        setLogin(!login);
    }

    return(
        <div className="container">
            <div className="login-form-wrapper">
                <h1 id="login-form-title">Login</h1>
                <Form inputs={login_data}></Form>
                <p id="error-p" className="error unvisible">Aucun compte trouver avec ces identifiants</p>
                <p>Déjà membre <a href="/login">Connectez-vous</a>.</p>
            </div>
        </div>
    )
};