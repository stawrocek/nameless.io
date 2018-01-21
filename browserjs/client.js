const loadedImages = {};
let canvas;
let ctx;
let socket;
let username;
let bullets = [];

const planeScale = 10;
const cSizeX = 800;
const cSizeY = 600;
const cMarginX = 200;
const cMarginY = 150;
const bSizeX = 1920;
const bSizeY = 1200;
const nickOffset = 32;
let viewPosX = 0;
let viewPosY = 0;


var movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
        case 32: // S
            movement.space = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
        case 32: // S
            movement.space = false;
            break;
    }
});

function prepareImages(imagesLoadedCB){
    let images = ['kenobi.png', 'background.jpg', 'plane1.png', 'bullet.png'];
    let promiseArray = images.map(function(imgurl){
    let prom = new Promise(function(resolve,reject){
        let img = new Image();
        img.onload = function(){
            loadedImages[imgurl] = img;
            resolve();
        };
        img.src = imgurl;
    });
    return prom;
    });
    Promise.all(promiseArray).then(imagesLoadedCB);
}

function main(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    prepareImages(onResourcesLoaded);
}

function onUpdate(state, bullets){
    if(state === undefined || state === null)
        return;
    let myPlane;
    for (let id in state) {
        if(username === undefined)
            myPlane = state[0];
        else{
            if(state[id].name == username)
                myPlane = state[id];
        }
    }
    if(myPlane === undefined)
        return;

    // change viewPos
    viewPosX, cSizeX, cMarginX, myPlane.x;
    if(myPlane.x - viewPosX > cSizeX - cMarginX)
        viewPosX = myPlane.x + cMarginX - cSizeX;
    if (myPlane.x - viewPosX < cMarginX)
        viewPosX = myPlane.x - cMarginX;
    if (myPlane.y - viewPosY > cSizeY - cMarginY)
        viewPosY = myPlane.y + cMarginY - cSizeY;
    if (myPlane.y - viewPosY < cMarginY)
        viewPosY = myPlane.y - cMarginY;

    // check borders
    if (viewPosX < 0)
        viewPosX = 0;
    if (viewPosX > bSizeX - cSizeX)
        viewPosX = bSizeX - cSizeX;
    if (viewPosY < 0)
        viewPosY = 0;
    if (viewPosY > bSizeY - cSizeY)
        viewPosY = bSizeY - cSizeY;
    
    ctx.drawImage(loadedImages['background.jpg'], -viewPosX, -viewPosY);
    for (let id in state) {
        let player = state[id];
        console.log(`${player.x}, ${player.y}, ${player.name}`);
        ctx.drawImage(loadedImages['plane1.png'], player.x - viewPosX - loadedImages['plane1.png'].width / planeScale, player.y - viewPosY - loadedImages['plane1.png'].height / planeScale, loadedImages['plane1.png'].width / planeScale, loadedImages['plane1.png'].height / planeScale);
        console.log(loadedImages['plane1.png'].width);
        ctx.font = "15px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText('['+player.name+']', player.x - viewPosX - loadedImages['plane1.png'].width / (2 * planeScale), player.y - viewPosY - (loadedImages['plane1.png'].height) / (2 * planeScale) + nickOffset); 
    }
}

function onNews(data){
    document.getElementById("news").innerHTML += "\n" + data;
}

function onResourcesLoaded(){
    socket = io();
    socket.on('connect_error', function (m) { log("connect_error "); });
    socket.on('connect', function (m) { 
        console.log("socket.io connection open"); 
        socket.emit('new_player', {});
        setInterval(function() {
            socket.emit('movement', movement);
        }, 1000 / 60);
    });

    socket.on('state', function(data) {
        onUpdate(data.players, data.bullets);
    });

    socket.on('news', function(data) {
        onNews(data);
    });

    socket.on('playername', function(data) {
       username = data;
    });
}