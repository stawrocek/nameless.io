const loadedImages = {};
let canvas;
let ctx;
let socket;
let username;
let bullets = [];

const planeScale = 0.1;
const bulletScale = 0.12;
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
    let images = ['kenobi.png', 'background.jpg', 'plane1.png', 'plane2.png', 'bullet.png', 'bullet2.png', 'bullet3.png'];
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
    console.log(bullets.length);
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
    for (let id in bullets) {
        let bullet = bullets[id];
        drawImage(loadedImages['bullet3.png'],
                  bullet.x - viewPosX,
                  bullet.y - viewPosY,
                  bulletScale,
                  bullet.angle);
    }
    for (let id in state) {
        let player = state[id];
        if (Math.abs(player.angle + Math.PI / 2) % (Math.PI * 2) > Math.PI)
            if (player.angle < -Math.PI / 2)
                img = loadedImages['plane1.png'];
            else
                img = loadedImages['plane2.png'];
        else
            if (player.angle < -Math.PI / 2)
                img = loadedImages['plane2.png'];
            else
                img = loadedImages['plane1.png'];
        drawImage(img,
                player.x - viewPosX,
                player.y - viewPosY,
                planeScale,
                player.angle);

        ctx.font = "15px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText('[' + player.name + ']', player.x - viewPosX, player.y - viewPosY + nickOffset); 

        // to draw center
        // ctx.fillStyle = 'green';
        // ctx.beginPath();
        // ctx.arc(player.x - viewPosX, player.y - viewPosY, 5, 0, 2 * Math.PI);
        // ctx.fill();
    }
}

function drawImage(image, x, y, scale, rotation) {
    ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    ctx.rotate(rotation);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
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

    socket.on('chat', receiveChat);
    document.getElementById('chat-input').
        addEventListener('keyup', function(event) {
            if (event.keyCode === 13) {
                document.getElementById('chat-submit').click();
            }
        });
}

function submitChat() {
    data = document.getElementById('chat-input').value;
    socket.emit('chat', data);
    document.getElementById('chat-input').value = '';
}

function receiveChat(data) {
    document.getElementById('chat').innerHTML +=
        '<b>'+data.name+'</b>: ' + data.message + '<br>';
}
