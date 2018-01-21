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

function onUpdate(state){
    //ctx.drawImage(loadedImages['kenobi.png'], 10, 10);
    //console.log(state);
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = 'green';
    for (let id in state) {
        let player = state[id];
        console.log(`${player.x}, ${player.y}, ${player.name}`);
        ctx.beginPath();
        ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function onNews(data){
    document.getElementById("news").innerHTML = data;
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
        }, 1000 / 60);
    });

    socket.on('state', function(players) {
        onUpdate(players);
    });

    socket.on('news', function(data) {
        onNews(data);
    });
}