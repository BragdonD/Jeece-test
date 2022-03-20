import { server } from "./server.js";
import member from "./member.js";
import chat from "./chat.js";
import meeting from "./meeting.js";
import jsonwebtoken from "jsonwebtoken";
import ws from "websocket";
const WebSocketServer = ws.server;
const WSrequest = ws.request;

let clients = []

export let wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
});

/**
 * 
 * @param {WSrequest} request 
 * @returns 
 */
async function originIsAllowed(request) {
    const token = request.cookies.find(obj => {
        return obj.name === "AUTH"
    }); 
    if(token !== undefined) {
        const payload = jsonwebtoken.verify(token.value, process.env.JWT_SECRET);
        const id = payload._id;

        if((await member.getMember(id).then(x => x)).length !== 0) {
            return {
                res: true,
                _id: id,
            }
        }
    }
    return {
        res: false,
        _id: "",
    }
}

wsServer.on("request",
    /**
     * 
     * @param {WSrequest} request 
     * @returns 
     */ 
    async function(request) {
        try{
            const resTestOrigin = await originIsAllowed(request).then(x => x);
            if (!resTestOrigin.res) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }
            
            let connection = request.accept(null, request.origin);

            clients.push({
                id: resTestOrigin._id,
                ws: connection,
            })

            connection.send(JSON.stringify({
                userData: (await member.getMember(resTestOrigin._id))[0],
                userChats: (await chat.getChats(resTestOrigin._id)),
                userMeetings: (await meeting.getMeetings(resTestOrigin._id))
            }));

            connection.on('message', async function(message) {
                try {
                    if (message.type === 'utf8') {
                        const string = message.utf8Data;
                        const data = JSON.parse(string)
                        //console.log(data);

                        if(data["task"] === "new conv") {
                            const creator = clients.find(obj => {
                                return obj.ws === connection;
                            }).id;
                            data.people.unshift(creator);
                            const temp = (await chat.createChat(data.title, data.people));
                            await temp.save();
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            newChat: temp
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "change name") {
                            const temp = await chat.updateChatName(data._id, data.name);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            updateChat: {
                                                _id: data._id,
                                                title: data.name
                                            }
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "delete member") {
                            const temp = await chat.removeMember(data._id, data.person);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id || obj.id === data.person;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        if(it2.id === data.person) {
                                            it2.ws.send(JSON.stringify({
                                                userChats: (await chat.getChats(data.person._id))
                                            }))
                                        }
                                        else {
                                            it2.ws.send(JSON.stringify({
                                                updateChat: {
                                                    _id: data._id,
                                                    members: temp.members
                                                }
                                            }))
                                        }
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "add member") {
                            const temp = await chat.addMember(data._id, data.pseudo);
                            if(temp !== undefined) {
                                for(const it of temp.members) {
                                    let toUpt = clients.filter(obj => {
                                        return obj.id === it._id;
                                    });
                                    if(toUpt.length !== 0) {
                                        const newMemberID = (await member.getMemberByPseudo(data.pseudo))[0]._id;
                                        console.log(newMemberID);
                                        for(const it2 of toUpt) {
                                            if(it2.id === newMemberID.toString()) {
                                                it2.ws.send(JSON.stringify({
                                                    userChats: (await chat.getChats(newMemberID))
                                                }))
                                            }
                                            else {
                                                it2.ws.send(JSON.stringify({
                                                    updateChat: {
                                                        _id: data._id,
                                                        members: temp.members
                                                    }
                                                }))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "upgrade to admin"){
                            const temp = await chat.UpgradeToAdmin(data._id, data.member);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            updateChat: {
                                                _id: data._id,
                                                members: temp.members
                                            }
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "update pseudo") {
                            const temp = await chat.UpdateMemberPseudo(data._id, data.member, data.pseudo);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            updateChat: {
                                                _id: data._id,
                                                members: temp.members
                                            }
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "add message") {
                            const temp = await chat.AddMessage(data._id, data.creator, data.msg);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            updateChat: {
                                                _id: data._id,
                                                messages: temp.messages
                                            }
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "delete message") {
                            const temp = await chat.DeleteMessage(data._id, data.id);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            updateChat: {
                                                _id: data._id,
                                                messages: temp.messages
                                            }
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "new meetings") {
                            const creator = clients.find(obj => {
                                return obj.ws === connection;
                            }).id;
                            data.people.unshift(creator);                            
                            const temp = await meeting.createMeeting(data.title, data.people, data.date, data.hour);
                            await temp.save();
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            userMeetings: (await meeting.getMeetings(it2.id))
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "accept meeting") {
                            const temp = await meeting.AcceptMeeting(data._id, data.member);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            userMeetings: (await meeting.getMeetings(it2.id))
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "refuse meeting") {
                            const temp = await meeting.RefuseMeeting(data._id, data.member);
                            for(const it of temp.members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            userMeetings: (await meeting.getMeetings(it2.id))
                                        }))
                                    }
                                }
                            }
                        }
                        else if(data["task"] === "delete meeting") {
                            const members = (await meeting.getMeeting(data._id))[0].members;
                            await meeting.DeleteMeeting(data._id);
                            for(const it of members) {
                                let toUpt = clients.filter(obj => {
                                    return obj.id === it._id;
                                });
                                if(toUpt.length !== 0) {
                                    for(const it2 of toUpt) {
                                        it2.ws.send(JSON.stringify({
                                            userMeetings: (await meeting.getMeetings(it2.id))
                                        }))
                                    }
                                }
                            }
                        }
                    }
                } 
                catch (e) {
                    console.log(e);
                }
            });

            connection.on('close', function(reasonCode, description) {
                clients.splice(clients.indexOf(clients.find(obj => {
                    return obj.ws === connection;
                })), 1);
            });
        }
        catch (err) {
            console.log(err);
        }
    }
);