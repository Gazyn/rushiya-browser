# Rushiya Browser

A simple node.js application that runs on localhost:3000, meant as a browser for local video files

## Requirements

- Node.js

- mpv media player

## Installation

Download the repository as ZIP

Extract it into the directory in which you have folder for thumbnails, json files and videos. the mpv folder should also be among these

If your folder names are different from the default, go and change them in `server.js`, lines 11-14

Open the folder in cmd or whichever terminal you prefer

Run `npm install` in the same folder as package.json and server.js

---

Your folder after installation should look like this (at a minimum):

- server.js

- package.json

- focus.exe

- view

- mpv

- node_modules (generated after npm install)

- (Thumbnails Folder)

- (JSON Folder)

- (Videos Folder)

## Usage

Run `npm start` or `node server.js`

Open `localhost:3000` in your browser

## Other notes

Only .mkv video files are supported. If your videos are in another format, you can change it in server.js:69

If you don't trust focus.exe (fair) you can see the source for it in focus.ahk, and compile it yourself with autohotkey. All it does is bring mpv player to the foreground.

focus.exe might not always work, in that case the video will be open in the background

if you want to use start.bat edit the drive letter on the first line to whatever drive your server is on

personally i use task scheduler to run this bat file on startup, could be handy for you