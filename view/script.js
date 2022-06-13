let thumbs = [];
let jsons = [];
let durations = {};
let channel = {};
let icon = "";

checks = {
    thumbnails: false,
    jsons: false,
    durations: false,
    channel: false
}
let timeoutInterval = 1000;

let lastClicked = Array(2);

function getThumbs() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "thumbs", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processThumbs(this.responseText);
        }
    }
    xhr.send();
}

function processThumbs(res) {
    thumbs = JSON.parse(res);
    icon = thumbs.pop(); //The last image is the profile picture, used for favicon
    createAllThumbnails();
}

function readTitle(name) {
    return name.slice(9, name.indexOf(" - ")) //strip the timestamp and video id
}

function createThumbnail(source) {

    let div = document.createElement("div");
    div.classList.add("thumbnail-div");

    let imgDiv = document.createElement("div");
    imgDiv.classList.add("thumb-img-container");

    let image = document.createElement("img");
    const container = document.querySelector("#vid-container");
    image.src = encodeURIComponent(source);
    image.classList.add("thumbnail-image");

    image.addEventListener("click", function(e){clickThumbnail(source, e.target)})

    let durationTextContainer = document.createElement("div");
    durationTextContainer.classList.add("duration-text-container");

    let durationText = document.createElement("span");
    durationText.classList.add("duration-text")

    let titleText = document.createElement("span");
    titleText.textContent = readTitle(source);
    titleText.classList.add("title-text");

    titleText.addEventListener("click", function(e){clickThumbnail(source, e.target.previousSibling.children[0])})

    durationTextContainer.appendChild(durationText);
    imgDiv.appendChild(image);
    imgDiv.appendChild(durationTextContainer);
    div.appendChild(imgDiv);
    div.appendChild(titleText);
    container.appendChild(div);
    /*
    The structure in html is:

    <div class="thumbnail-div">
        <div class="thumb-img-container">
            <img class=thumbnail-image>
            <div class="duration-text-container>
                <span class="duration-text">
            </div>
        </div>
        <span class="title-text">
    </div>

    All of these are contained within <div id="vid-container">
     */
}

function setFavicon() {
    let favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.href = icon;
    document.querySelector('head').appendChild(favicon);
}

function createAllThumbnails() {
    setFavicon();
    thumbs.forEach(function (i) {
        createThumbnail(i);
    })
    checks.thumbnails = true;
    console.log("Loaded thumbnails")
}

function clickThumbnail(which, e) {
    if(lastClicked[1]) {lastClicked[1].classList.remove("clicked")}
    e.classList.add("clicked");
    if(lastClicked[0] === which) {
        let xhr = new XMLHttpRequest();
        xhr.open("post", "open", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.send(JSON.stringify({path: which}));
        lastClicked[0] = "";
        e.classList.remove("clicked");
        return;
    }
    lastClicked[0] = which;
    lastClicked[1] = e;
}

function getJsons() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "jsons", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processJsons(this.responseText);
        }
    }
    xhr.send();
}

function processJsons(res) {
    jsons = JSON.parse(res);
    checks.jsons = true;
    console.log("Loaded jsons")
}

function getDurations() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "durations", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processDurations(this.responseText);
        }
    }
    xhr.send();
}

function processDurations(res) {
    durations = JSON.parse(res);
    checks.durations = true;
    console.log("Loaded durations")
}

function updateDurations() {
    let texts = document.querySelectorAll('.duration-text');
    if(checks.thumbnails & checks.jsons && checks.durations) {
        for(let i in texts) {
            texts[i].textContent = durations[jsons[i]];
        }
    } else {
        for(let i in checks) {
            if(!checks[i]) {
                console.log("Still missing "+i);
            }
        }
        console.log("Retrying in "+timeoutInterval+"ms");
        setTimeout(function(){updateDurations()}, timeoutInterval);
        timeoutInterval += 500;
    }
}

function getChannel() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "channel", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processChannel(this.responseText);
        }
    }
    xhr.send();
}

function processChannel(res) {
    channel = JSON.parse(res);
    document.title = channel.title;
    checks.channel = true;
    console.log("Loaded channel")
}

getThumbs();
getJsons();
getDurations();
getChannel();
setTimeout(function(){updateDurations()}, 50); //tiny timeout because all the data can't ever arrive in 0 milliseconds