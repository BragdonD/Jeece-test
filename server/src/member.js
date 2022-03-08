import mongoose from "mongoose";
const Model = mongoose.model;
const Schema = mongoose.Schema;

const memberSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            default: "",
        },
        lastName: {
            type: String,
            required: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            default: "",
        },
        pseudo: {
            type: String,
            required: true,
            default: "",
        }, 
        password: {
            type: String,
            required: true,
            default: "",
        },
        img : {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
    {
        collection: "member",
    },
);

const member = Model( "Member", memberSchema );

const createMember = ( f, l, e, p, pw, i ) => {
    return new member({
        firstName: f,
        lastName: l,
        email: e,
        pseudo: p,
        password: pw,
        img: i,
    });
}

const getMember = async ( id ) => {
    return await member.find(
        {
            _id: id
        }
    ).exec();
}

const getMemberByPseudo = async ( p ) => {
    return await member.find(
        {
            pseudo: p
        }
    ).exec();
}

const updateMember = ( id, d, v) => {
    member.findOneAndUpdate(
        {
            _id: id,
        },
        {
            [d]: v,
        },
    ).exec();
}

export default {
    createMember,
    getMember,
    getMemberByPseudo,
    updateMember,
};