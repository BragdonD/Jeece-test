import React, { useState } from "react";

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