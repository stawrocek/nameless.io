function Player(name){
    this.name = name;
    this.x = 300;
    this.y = 200;
    this.speedX = 10;
    this.speedY = 10;

    this.print = function(str){
        console.log(`${str} ${this.x}, ${this.y}, ${this.name}`);
    }

    this.act = function(mov){
        let res="";
        if(mov.up)res+="w"
        if(mov.right)res+="d";
        if(mov.down)res+="s";
        if(mov.left){res+="a";}
        if(res.length !== 0)
            console.log(`${name}: ${res}`);
    }
} 


module.exports = {
    Player: Player
};