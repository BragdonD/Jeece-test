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
import member from "./member.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 1063;

app.use(expressParser.use());
app.use(cookieParser());

mongoose.connect(
        process.env.URL_MONGODB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(
        function(){ 
            console.log( ( new Date() ) + " connect to a mongodb database") 
        }
    )
    .catch(
        function( err ) { 
            console.log(err) 
        }
    );

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
    function( req, res ) {
        res.sendFile(
            path.join(
                path.dirname( fileURLToPath( import.meta.url ) ),
                "../app/index.html"
            )
        );
    }
);

app.post(
    "/register",
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
                const token = await jsonwebtoken.sign(
                                                {_id: newMember._id},
                                                process.env.JWT_SECRET,);
                res.cookie("AUTH", token,   {
                                                httpOnly: true,
                                                sameSite: "strict",
                                            })
                res.status(201).redirect("/");
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
)

app.put(
    "/member",
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    function( req, res ) {
        if( req.cookies["AUTH"] == undefined ) {
            res.redirect("/login");
        }
        else {
            const id = jsonwebtoken.verify(
                req.cookies["AUTH"],
                process.env.JWT_SECRET
            );
            
            member.updateMember();
            
        }
    }
)

app.listen(
    port,
    async function() { 
        console.log( ( new Date() ) + " a server has been created at http://localhost:%d", port );
    }
);