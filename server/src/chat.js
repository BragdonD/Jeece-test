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

const chat = Model( "Saloon", chatSchema );

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

    return new chat({
        title: t,
        members: members
    });
}

const getChats = async ( id ) => {
    return await chat.find(
        {
            "members._id": id,
        }
    ).exec();
}

const updateChatName = async ( idChat, name ) => {
    return await chat.findOneAndUpdate(
        {
            _id: idChat
        }, 
        {
            title: name
        }
    ).exec();
}

const removeMember = async ( idChat, idMember ) => {
    return await chat.findOneAndUpdate(
        {
            _id: idChat
        },
        {
            $pull: {
                members: {
                    _id: idMember,
                }
            }
        },
        {new: true}
    ).exec();
}

const addMember = async ( idChat, pseudo ) => {
    const check = await chat.findOne(
        {
            _id: idChat,
            "members._id": (await member.getMemberByPseudo(pseudo))[0]._id
        }
    ).exec()
    if(check === null) {
        const temp = await createMemberByPseudo(pseudo, "");
        return await chat.findOneAndUpdate(
            {
                _id: idChat
            },
            {
                $push: {
                    members: temp
                }
            },
            {new: true}
        ).exec();
    }
    return undefined;
}

export default {
    createChat,
    getChats,
    createMemberByPseudo,
    createMemberByID,
    updateChatName,
    removeMember,
    addMember
};