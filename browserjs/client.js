const loadedImages = {};
let canvas;
let ctx;
let socket;

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

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
    }
});

function prepareImages(imagesLoadedCB){
    let images = ['kenobi.png'];
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

function onResourcesLoaded(){
    let username = prompt("Please enter your name", "Ben Kebobi");
    socket = io();
    socket.on('connect_error', function (m) { log("connect_error "); });
    socket.on('connect', function (m) { 
        console.log("socket.io connection open"); 
        socket.emit('new_player', { "user": username });
        setInterval(function() {
            socket.emit('movement', movement);
            console.log(movement);
        }, 1000 / 60);
    });

    ctx.drawImage(loadedImages['kenobi.png'], 10, 10);
}