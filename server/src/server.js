import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
const port = 3001;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.raw({ type: ["image/jpeg", "image/png"], limit: "5mb" }))

mongoose.connect( process.env.URL_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    }).then( function(){ 
        console.log( ( new Date() ) + " connect to a mongodb database") 
    }).catch(function( err ) { 
        console.log(err) 
    });



export const server = app.listen(port, function() { 
    console.log( ( new Date() ) + " a server has been created at http://localhost:%d", port );
});