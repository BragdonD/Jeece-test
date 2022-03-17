import { response, request } from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import { v4 } from "uuid"
import imageType from "image-type"
import { fileURLToPath } from "url";
import { app } from "./server.js";
import member from "./member.js"

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

app.put("/member/update/:data",
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    async function( req, res ) {
        if( req.cookies["AUTH"] === undefined ) {
            res.status(409).send({
                msg: "redirect"
            });
        }
        else {
            const payload = jsonwebtoken.verify( req.cookies["AUTH"], process.env.JWT_SECRET );
            const id = payload._id;
            const data = req.params.data;
            let value = (data === "img" ? req.body : req.body.value);
            const temp = await member.getMember(id).then(x => x);

            if( temp.length !== 0) {
                if(data && value) {
                    if(data === "pseudo") {
                        const test_pseudo = await member.getMemberByPseudo(pseudo).then(x => x);
                        if(test_pseudo.length === 0) {
                            member.updateMember(id, data, value);
                            res.status(200).send({
                                msg: "updated",
                            });
                        }
                    }
                    else if(data === "img") {
                        const type = imageType(value);
                        const name = v4()  + "." + type.ext;
                        const fullPath = "./private/img/" + name;
                        if(temp[0].img !== "basic-pp.png") {
                            fs.unlink("./private/img/" + temp[0].img, (err) => {
                                if(err) console.log(err);
                            })
                        }
                        fs.writeFile(fullPath, value, (error) => {
                            if(error) {
                                console.log(error);
                                res.status(501).send({
                                    msg: "error",
                                });
                            }
                        });
                        member.updateMember(id, data, name);
                        res.status(200).send({
                            msg: "updated",
                        });
                    }
                    else if(data === "password") {
                        value = await bcrypt.hash(value, 10).then( x => x );
                        member.updateMember(id, data, value);
                        res.status(200).send({
                            msg: "updated",
                        });
                    }
                    else {
                        member.updateMember(id, data, value);
                        res.status(200).send({
                            msg: "updated",
                        });
                    }
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

app.get("/member/image/:id", 
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    async function (req, res) {
        const temp = (await member.getMember(req.params.id))[0];
        res.sendFile(path.join(fileURLToPath(import.meta.url), `../../private/img/${temp.img}`));
    }
);