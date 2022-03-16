import mongoose from "mongoose";
const Model = mongoose.model;
const Schema = mongoose.Schema;
import member from "./member.js";

const chatSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            default: "",
        },
        members: {
            type: Array.of({
                _id: {
                    type: String,
                    default: "",
                },
                pseudo: {
                    type: String,
                    default: "",
                },
                role: {
                    type: String,
                    default: "",
                }
            }),
            required: true,
            default: [],
        },
        messages: {
            type: Array.of({
                _id_creator: {
                    type: String,
                    default: "",
                },
                pseudo: {
                    type: String,
                    default: "",
                },
                text: {
                    type: String,
                    default: "",
                }
            })
        }
    },
    {
        collection: "chat",
    },
);

const saloon = Model( "Saloon", chatSchema );

const createMemberByPseudo = async (pseudo, role) => {
    const temp = (await member.getMemberByPseudo(pseudo));
    if(temp.length !== 0 ) {
        return {
            _id: temp[0]._id,
            pseudo: temp[0].pseudo,
            role: role
        }
    }
    return undefined;    
}

const createMemberByID = async (id, role) => {
    const temp = (await member.getMember(id));
    if(temp.length !== 0 ) {
        return {
            _id: temp[0]._id,
            pseudo: temp[0].pseudo,
            role: role
        }
    }
    return undefined;    
}

const createChat = async ( t, m ) => {
    let members = [];
    let i = 0;
    for(const elem of m) {
        let toAdd;
        if(i == 0)
            toAdd = await createMemberByID(elem, "admin");
        else
            toAdd = await createMemberByPseudo(elem, "");
            
        if(toAdd !== undefined)
            members.push(toAdd);

        i++;
    };

    return new saloon({
        title: t,
        members: members
    });
}

const getChats = async ( id ) => {
    return await saloon.find(
        {
            "member._id": id,
        }
    ).exec();
}

export default {
    createChat,
    getChats,
    createMemberByPseudo,
    createMemberByID
};