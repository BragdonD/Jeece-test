import express from "express";
import { response, request } from "express";
import jsonwebtoken from "jsonwebtoken";
import ws from "websocket";
const WebSocketServer = ws.server;
const WSrequest = ws.request;
import expressParser from "express-parser"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import member from "./member.js"

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect( process.env.URL_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    }).then( function(){ 
        console.log( ( new Date() ) + " connect to a mongodb database") 
    }).catch(function( err ) { 
        console.log(err) 
    });

app.post(
    "/login",
    /**
     * @brief
     * @param {request} req 
     * @param {response} res 
     */ 
    async function( req, res ) {
        try {
            const pseudo = req.query.pseudo;
            const password = req.query.password;

            if(pseudo && password) {
                const checkMember = (await member.getMemberByPseudo(pseudo).then( x => x ))[0];
                if(checkMember !== undefined) {
                    const right = await bcrypt.compare(password, checkMember.password).then( x => x );
                    if(right) {
                        const token = jsonwebtoken.sign( {
                            _id: checkMember._id
                        }, process.env.JWT_SECRET);
                        res.cookie("AUTH", token, {
                            httpOnly: true,
                            sameSite: "strict",
                        });
                        res.status(201).send({
                            msg: "redirect",
                        });;
                    }
                    else {
                        res.status(409).send({
                            msg: "no match",
                        });
                    }
                }
                else {
                    res.status(409).send({
                        msg: "no match",
                    });
                }
            }
            else {
                res.header()
                res.status(409).send({
                    msg: "wrong inputs",
                });
            }
            
        } catch (error) {
            console.log(error);
        }
    }
);

app.post("/register",
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    async function( req, res ) {
        try {
            const fName = req.query.fName;
            const lName = req.query.lName;
            const pseudo = req.query.pseudo;
            const password = req.query.password;
            const email = req.query.email;

            if(fName && lName && pseudo && password && email) {
                const test_pseudo = await member.getMemberByPseudo(pseudo).then(x => x);
                if(test_pseudo.length === 0) {
                    const hash = await bcrypt.hash(password, 10).then( x => x );
                    let newMember = member.createMember(fName, lName, email, pseudo, hash);
                    newMember.save();
                    const token = jsonwebtoken.sign({
                        _id: newMember._id
                    }, process.env.JWT_SECRET);
                    res.cookie("AUTH", token, {
                        httpOnly: true,
                        sameSite: "strict",
                    });
                    res.status(201).send({
                        msg: "redirect"
                    });
                }
                else {
                    res.status(501).send({
                        msg: "already existing"
                    });
                }
                
            }
            else {
                res.status(404).send({
                    msg: "wrong inputs",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
);

app.put("/member",
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    async function( req, res ) {
        if( req.cookies["AUTH"] == undefined ) {
            res.redirect("/login");
        }
        else {
            const payload = jsonwebtoken.verify( req.cookies["AUTH"], process.env.JWT_SECRET );
            const id = payload.id;
            const data = req.query.data;
            const value = req.query.value;

            if((await member.getMember(id).then(x => x)).length !== 0) {
                if(data && value) {
                    member.updateMember(id, data, value);
                }
                else {
                    res.status(404).send({
                        msg: "wrong inputs",
                    });
                }
            }
            else {
                res.status(501).send({
                    msg: "wrong token",
                });
            }

            
            
        }
    }
);

app.get("/image/:id", 
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    function (req, res) {
        res.sendFile(path.join(fileURLToPath(import.meta.url), `../../private/img/${req.params.id}`));
    }
);

const server = app.listen(port, function() { 
    console.log( ( new Date() ) + " a server has been created at http://localhost:%d", port );
});

let wsServer = new WebSocketServer({
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
        _id: id,
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

            console.log((new Date()) + ' Connection accepted.');

            connection.send(JSON.stringify({
                userData: (await member.getMember(resTestOrigin._id).then(x => x))[0]
            }));

            connection.on('message', async function(message) {
                try {
                    if (message.type === 'utf8') {
                        console.log('Received Message: ' + message.utf8Data);
                        const string = message.utf8Data;
                        const data = JSON.parse(string)
                        console.log(data);
                        connection.send(JSON.stringify({
                            msg: "",
                        }))
                    }
                } 
                catch (e) {
                    console.log(e);
                }
                
            });

            connection.on('close', function(reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        }
        catch (err) {
            console.log(err);
        }
    });