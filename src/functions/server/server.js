'use strict';

require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname)));
app.use(cors());

/*
 * Pusher
 */
const Pusher = require('pusher');
const pusher = new Pusher({
    appId: process.env.VUE_APP_PUSHER_API_ID,
    key: process.env.VUE_APP_PUSHER_API_KEY,
    secret: process.env.VUE_APP_PUSHER_API_SECRET,
    cluster: process.env.VUE_APP_PUSHER_CLUSTER,
    useTLS: true
});

/*
 * Mongodb
 */
const mongoose = require('mongoose');
const Sprint = require("./models/Sprint");

const options = {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('MongoDB connected.');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

const router = express.Router();
router.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channelName = req.body.channel_name;
    if (/^presence-/.test(channelName)) {
        let presenceData = {
            user_id: `user-${new Date().getTime()}`,
            user_info: {
                username: req.body.username,
            },
        };
        let auth = pusher.authenticate(socketId, channelName, presenceData);
        res.send(auth);
    } else {
        let auth = pusher.authenticate(socketId, channelName);
        res.send(auth);
    }
});

router.post('/sprints', (req, res) => {
    const sprintData = JSON.parse(req.body);
    const sprint = new Sprint();
    sprint.sprintId = sprintData.sprintId;
    sprint.sprintName = sprintData.sprintName;
    sprint.votingSystem = sprintData.votingSystem;
    console.log("Insert data to mongodb : ");
    if (sprint.sprintId && sprint.sprintName) {
        sprint.save(err => {
            if (err) {
                res.send(err);
            }
            console.log("Insert data to mongodb OK");
            res.status(201);
            res.send();
        });

    } else {
        console.log("Insert data to mongodb KO");
        res.status(422);
        res.send();
    }
});

app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
