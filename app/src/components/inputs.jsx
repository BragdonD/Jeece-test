import React from "react";
import PropTypes from 'prop-types';

export const Input = ( { placeholder, type, className, callback } ) => {
    /**
     * 
     * @param {InputEvent} e 
     */
    const handleChange = (e) => {
        callback(e.target.value);
    };

    const handleClick = () => {
        if(type === "submit") { 
            callback(true);
        }
    }

    return (
        <div>
            <input className={className} type={type} placeholder={placeholder} onChange={handleChange} onClick={handleClick}></input>
        </div>
    )
}

Input.propTypes = {
    placeholder: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    callback: PropTypes.func,
}