function main(){
    var socket = io();
    socket.on('connect_error', function (m) { log("connect_error "); });
    socket.on('connect', function (m) { console.log("socket.io connection open"); });
    socket.on('message', function(data) {
        console.log(data);
    });
}