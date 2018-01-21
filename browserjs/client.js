
function main(){
    //var myGamePiece = new component(789, 487, "kenobi.png", 10, 120, "image");
    // var kenobi = new Image();
    // kenobi.src = "kenobi.gif";
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    //ctx.font = "30px Comic Sans MS";
    //ctx.fillStyle = "red";
    //ctx.textAlign = "center";
    //ctx.fillText("Hello there", canvas.width / 2, canvas.height / 2); 
    var kenobi = document.getElementById("kenobi");
    ctx.drawImage(kenobi, 10, 10);
    var socket = io();
    socket.on('connect_error', function (m) { log("connect_error "); });
    socket.on('connect', function (m) { 
        console.log("socket.io connection open"); 
        socket.emit('new_player', { "user": "ben_kebobi" });
    });
    socket.on('message', function(data) {
        console.log(data);
    });
}