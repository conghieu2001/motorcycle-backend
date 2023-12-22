const express = require('express');
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB'
import routers from './routes';
import session from 'express-session';
import passport from 'passport'
// const socketIO = require('socket.io');

const app =express();

dotenv.config()
app.use(cors({origin: true, credentials: true}));
connectDB();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.use(express.static('src/uploads'));
routers(app)
//passport
app.use(passport.initialize());
app.use(passport.session())

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running port ${port}`)
})
  