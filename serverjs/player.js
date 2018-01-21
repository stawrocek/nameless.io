
const process = require('process');

function Player(name){
    this.name = name;
    this.x = 300;
    this.y = 200;
    this.speedX = 100;
    this.speedY = 100;
    this.lastTime = 0;

    this.print = function(str){
        console.log(`${str} ${this.x}, ${this.y}, ${this.name}`);
    }

    this.act = function(mov){
        let dt = (Date.now() - this.lastTime)/1000.0;
        this.lastTime = Date.now();
        //console.log(dt);
        if(mov.up){
            this.y += -this.speedY*dt;
        }
        if(mov.right){
            this.x += this.speedX*dt;
        }
        if(mov.down){
            this.y += +this.speedY*dt;
        }
        if(mov.left){
            this.x -= this.speedX*dt;
        }
    }
} 


module.exports = {
    Player: Player
};