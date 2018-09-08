let canvasWidth = 640;
let canvasHeight = 480;

let xBaseA = 10;
let yBaseA = 10;
let baseAWidth = 50;

let xBaseB = 575;
let yBaseB = 420;
let baseBWidth = 50;

let xMountain = 150;
let yMountain = 100;
let mountainWidth = 100;
let mountainHeight = 50;
let z;

let gameWindow = function(game){
    let b1, b2, m1, m2, m3, m4;
    game.preload = function(){};

    game.setup = function(){
        canvas = game.createCanvas(canvasWidth, canvasHeight);
        canvas.class("box-shadow");
        game.strokeWeight(2);
        game.stroke(84, 56, 71);

        // BlockHouses
        b1 = new Base(game, xBaseA, yBaseA, baseAWidth, baseAWidth);
        b2 = new Base(game, xBaseB, yBaseB, baseBWidth, baseBWidth);

        // Obstacles
        m1 = new Mountain(game, xMountain, yMountain, mountainWidth, mountainHeight);
        m2 = new Mountain(game, xMountain+300, yMountain, mountainWidth/2, mountainHeight*2);
        m3 = new Mountain(game, xMountain, yMountain+200, mountainWidth, mountainHeight);
        m4 = new Mountain(game, xMountain+250, yMountain+180, mountainWidth, mountainHeight);
    };

    game.draw = function(){
        game.background(242, 230, 193);
        game.fill(51);
        b1.display();
        b2.display();
        
        game.fill(183, 154, 97);
        m1.display();
        m2.display();
        m3.display();
        m4.display();
        
        game.rectMode(game.CENTER);
        game.translate(game.width / 2, game.height / 2);
        game.translate(p5.Vector.fromAngle(game.millis() / 1000, 180));
        game.rect(0, 0, 20, 20);
    };
};
let cnv = new p5(gameWindow, 'gameWindow');