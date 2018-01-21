const loadedImages = {};
let canvas;
let ctx;
let socket;

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
    socket = io();
    socket.on('connect_error', function (m) { log("connect_error "); });
    socket.on('connect', function (m) { 
        console.log("socket.io connection open"); 
        socket.emit('new_player', { "user": "ben_kebobi" });
    });
    socket.on('message', function(data) {
        console.log(data);
    });


    ctx.drawImage(loadedImages['kenobi.png'], 10, 10);
}