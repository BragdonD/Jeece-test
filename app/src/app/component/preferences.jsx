import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const Preference = ({ member_data }) => {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();
    const [show_error, setError] = useState(false);

    useEffect(() => {
        console.log(member_data);
    }, [member_data])

    return(
        <div >
            <div className="form-wrapper">

            </div>
        </div>
    )
}

Preference.propTypes = {
    member_data: PropTypes.object,
}
