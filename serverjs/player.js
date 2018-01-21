const process = require('process');

function Player(name){
    this.name = name;
    this.x = 300;
    this.y = 200;
    //this.speedX = 100;
    //this.speedY = 100;
    this.speed = 100;
    this.angle = 0;
    this.lastTime = Date.now();
    this.rotSpeed = 1;

    this.print = function(str){
        console.log(`${str} ${this.x}, ${this.y}, ${this.name}`);
    }

    this.act = function(mov){
        let dt = (Date.now() - this.lastTime)/1000.0;
        this.lastTime = Date.now();
        //console.log(dt);
        if(mov.up){
            //this.y += -this.speedY*dt;
            this.angle -= this.rotSpeed*dt;
        }
        if(mov.right){
            //this.x += this.speedX*dt;
            
        }
        if(mov.down){
            //this.y += +this.speedY*dt;
            this.angle += this.rotSpeed*dt;
        }
        if(mov.left){
            //this.x -= this.speedX*dt;
        }
        //this.x += this.speed*dt*Math.cos(this.angle);
        //this.y += this.speed*dt*Math.sin(this.angle);
        this.x += this.speed*dt*Math.cos(this.angle);
        this.y += this.speed*dt*Math.sin(this.angle);
    }
} 


module.exports = {
    Player: Player
};