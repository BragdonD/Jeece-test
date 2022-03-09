import React, { useState } from "react";
import { Input } from "./inputs.jsx"

export const Form = ({ inputs }) => {
    return(
        inputs.map( (elem, i) => {
            return(
                <Input placeholder={elem.placeholder} type={elem.type} callback={elem.callback} key={i} className={elem.className}></Input>
            )
        })
    )
}