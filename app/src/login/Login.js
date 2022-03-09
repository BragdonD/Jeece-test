import { useEffect, useState } from "react";
import { Form } from "./components/form.jsx";

export const LoginForm = () => {
    const [pseudo, setPseudo] = useState("");

    let login_data = [
        {
            placeholder: "Pseudo",
            type: "text",
            callback: setPseudo,
        }
    ];

    useEffect(() => {
        console.log(pseudo);
    })

    return(
        <div>
            <Form inputs={login_data}></Form>
        </div>
    )
};