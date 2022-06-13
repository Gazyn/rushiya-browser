const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CONFIG START
const thumbsDir = path.join(__dirname, 'Non-Membership Thumbnails');
const jsonsDir = path.join(__dirname, 'Non-Membership JSON Files');
const videosDir = path.join(__dirname, 'Non-Membership Streams');
const mediaPlayerDir = path.join(__dirname, 'mpv/mpv.exe');
// CONFIG END

console.log("===============")
console.log("Rushiya Browser")
console.log("===============")
console.log("")

let durations = {};

fs.readdir(jsonsDir, (err, files) => {
    files.forEach(async function (i) {
        fs.readFile(path.join(jsonsDir, i), (err, data) => {
            let duration = JSON.parse(data).duration;
            if (!isNaN(duration)) {
                durations[i] = new Date(duration * 1000).toISOString().substr(11, 8);
            }
        })
    })
})

console.log("Finished loading durations")

let channelData = {};

fs.readdir(jsonsDir, (err, files) => {
    fs.readFile(path.join(jsonsDir, files[files.length-1]), (err, data) => {
        channelData = JSON.parse(data);
    });
})

console.log("Finished loading channel data")

app.get("/channel", function(req, res) {
    res.send(channelData);
})

app.get("/thumbs", function (req, res) {
    fs.readdir(thumbsDir, (err, files) => {
        if (err) {
            res.send(err);
        } else {
            res.send(files);
        }
    });
})

app.get("/jsons", function (req, res) {
    fs.readdir(jsonsDir, (err, files) => {
        if (err) {
            res.send(err);
        } else {
            res.send(files);
        }
    });
})

app.get("/durations", async function (req, res) {
    res.send(durations);
})

app.post("/open", function (req, res) {
    let videoPath = req.body.path;
    videoPath = videoPath.replace(/(\.jpg)|(\.jpeg)|(\.webp)|(\.png)/, "") + ".mkv" //remove either .jpg or .webp and add .mkv
    videoPath = path.join(videosDir, videoPath);
    console.log("Attempting to open " + videoPath)
    exec("\"" + mediaPlayerDir + "\" \"" + videoPath + "\"", (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    })
    console.log("Attempting to focus window");
    exec("focus.exe")
    res.send("Opened")
})

app.use(express.static('view'));
app.use(express.static(thumbsDir))

console.log("Ready")

app.listen(3000);