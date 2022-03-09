import express from "express";
import { response, request } from "express";
import jsonwebtoken from "jsonwebtoken";
import WebSocketServer from "websocket/lib/WebSocketServer.js";
import expressParser from "express-parser"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import member from "./src/member.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 1063;

app.use(expressParser.use());
app.use(cookieParser());

mongoose.connect( process.env.URL_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    }).then( function(){ 
        console.log( ( new Date() ) + " connect to a mongodb database") 
    }).catch(function( err ) { 
        console.log(err) 
    });

/*
let wsServer = new WebSocketServer({
    httpServer: app,
    autoAcceptConnections: false,
});


function originIsAllowed(origin) {
    origin.headers["AUTH"];
    
    return true;
}

wsServer.on("request", function(request) {

});

function CheckAuthToken(token, callback) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, function(err, res) {
        callback(err, res);
    });
}*/

app.post(
    "/login",
    /**
     * @brief
     * @param {request} req 
     * @param {response} res 
     */ 
    async function( req, res ) {
        const auth = req.cookies["AUTH"];
        if(auth) {
            try {
                const payload = jsonwebtoken.verify(auth, process.env.JWT_SECRET);
                if( member.getMember(payload._id) ) {
                    res.status(200).code({
                        code: 200,
                    });
                }
                else {
                    res.status(404).send({
                        code: 404,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const pseudo = req.query.pseudo;
                const password = req.query.password;
                if(pseudo && password) {
                    const checkMember = (await member.getMemberByPseudo(pseudo).then( x => x ))[0];
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
                            code: 201
                        });
                    }
                    else {
                        res.status(501).send({
                            code: 501,
                        });
                    }
                }
                else {
                    res.status(404).send({
                        code: 404,
                    });
                }
                
            } catch (error) {
                console.log(error);
            }
            

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
                const hash = await bcrypt.hash(password, 10).then( x => x );
                let newMember = member.createMember(fName, lName, email, pseudo, hash, "");
                newMember.save();
                const token = jsonwebtoken.sign({
                    _id: newMember._id
                }, process.env.JWT_SECRET);
                res.cookie("AUTH", token, {
                    httpOnly: true,
                    sameSite: "strict",
                });
                res.status(201).send({
                    code: 201,
                });
            }
            else {
                res.status(404).send({
                    code: 404,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
);

app.put("/memberdata",
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    function( req, res ) {
        if( req.cookies["AUTH"] == undefined ) {
            res.status(501).send({
                code: 501,
            });
        }
        else {
            const payload = jsonwebtoken.verify( req.cookies["AUTH"], process.env.JWT_SECRET );
            const id = payload._id;
            const data = req.query.data;
            const value = req.query.value;

            if(data && value) {
                console.log(id);
                if(data != "email") {
                    member.updateMember(id, data, value);
                    res.status(200).send({
                        code: 200,
                    })
                }
                else {
                    res.status(404).send({
                        code: 404,
                    });
                }
            }
            else {
                res.status(404).send({
                    code: 404
                });
            }
            
        }
    }
);

app.listen(port, function() { 
    console.log( ( new Date() ) + " a server has been created at http://localhost:%d", port );
});