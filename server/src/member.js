import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { MemberModel } from "../../../Documents/nodejs/jeece/test/server/src/member.mjs";

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
            required: true,
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

const member = mongoose.Model( "Member", memberSchema );

export const createMember = ( f, l, e, p, pw, i ) => {
    return new member({
        firstName: f,
        lastName: l,
        email: e,
        pseudo: p,
        password: pw,
        img: i,
    });
}

const getMember = ( id ) => {
    return MemberModel.find(
        {
            _id: id
        }
    )[0]
}