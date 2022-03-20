import mongoose from "mongoose";
const Model = mongoose.model;
const Schema = mongoose.Schema;
import member from "./member.js";

const meetingSchema = new Schema(
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
                },
                status: {
                    type: String,
                    default: "Pending"
                }
            }),
            required: true,
            default: [],
        },
        date: {
            type: Date,
            default: new Date()
        }
    },
    {
        collection: "meeting",
    },
);

const meeting = Model( "Meeting", meetingSchema );

const createMemberByID = async (id, role) => {
    const temp = (await member.getMember(id));
    if(temp.length !== 0 ) {
        return {
            _id: temp[0]._id,
            pseudo: temp[0].pseudo,
            role: role, 
            status: "Accepted"
        }
    }
    return undefined;    
}

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

const createMeeting = async ( t, m, date, hour ) => {
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

    return new meeting({
        title: t,
        members: members,
        date: new Date(date + "T" + hour)
    });
}

const getMeetings = async ( id ) => {
    return await meeting.find(
        {
            "members._id": id,
        }
    ).exec();
}

const getMeeting = async ( id ) => {
    return await meeting.find(
        {
            _id: id,
        }
    ).exec();
}

const DeleteMeeting = async (id) => {
    return await meeting.findOneAndDelete(
        {
            _id: id,
        }
    ).exec()
}

const AcceptMeeting = async (id, member) => {
    return await meeting.findOneAndUpdate(
        {
            _id: id,
            "members._id": member
        },
        {
            $set: {
                "members.$.status": "Accepted"
            }
        },
        {new: true}
    ).exec();
}

const RefuseMeeting = async (id, member) => {
    return await meeting.findOneAndUpdate(
        {
            _id: id,
            "members._id": member
        },
        {
            $set: {
                "members.$.status": "Refused"
            }
        },
        {new: true}
    ).exec();
}

export default {
    createMeeting,
    getMeetings,
    DeleteMeeting,
    AcceptMeeting,
    RefuseMeeting,
    getMeeting
};