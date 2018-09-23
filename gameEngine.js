let canvasWidth = 640;
let canvasHeight = 480;

let xBaseA = 10;
let yBaseA = 10;
let baseAWidth = 50;

let xBaseB = 580;
let yBaseB = 420;
let baseBWidth = 50;

let xMountain = 150;
let yMountain = 100;
let mountainWidth = 100;
let mountainHeight = 50;

let tankWidth = 20;

let gameWindow = function(game){
    let b1, b2, m1, m2, m3, m4, t11, t21;
    game.preload = function(){};

    game.setup = function(){
        canvas = game.createCanvas(canvasWidth, canvasHeight);
        canvas.class("box-shadow");
        // game.frameRate(15);
        game.strokeWeight(2);
        game.stroke(84, 56, 71);
        game.angleMode(game.DEGREES);

        // BlockHouses
        b1 = new Base(game, xBaseA, yBaseA, baseAWidth, baseAWidth);
        b2 = new Base(game, xBaseB, yBaseB, baseBWidth, baseBWidth);

        // Obstacles
        m1 = new Mountain(game, xMountain, yMountain, mountainWidth, mountainHeight);
        m2 = new Mountain(game, xMountain+300, yMountain, mountainWidth/2, mountainHeight*2);
        m3 = new Mountain(game, xMountain, yMountain+200, mountainWidth, mountainHeight);
        m4 = new Mountain(game, xMountain+250, yMountain+180, mountainWidth, mountainHeight);

        // Tanks
        t11 = new Tank(game, xBaseA+55, yBaseA, tankWidth);
        t21 = new Tank(game, xBaseB-25, yBaseB+tankWidth, tankWidth);
    };

    game.draw = function(){
        game.background(242, 230, 193);
        game.fill(249, 67, 54);
        b1.display();
        game.fill(66, 80, 244);
        b2.display();
        
        game.fill(183, 154, 97);
        m1.display();
        m2.display();
        m3.display();
        m4.display();

        game.fill(0);
        t11.display(viewAngle=0);
        // t11.x += 1;
        if(t11.x >= canvasWidth-tankWidth){t11.x = xBaseA+55;}
        let hit = t11.collide(m1);
        if (hit==true){
            console.log(hit);
        }
        // test code to move the tank around
        if (game.keyIsDown(game.LEFT_ARROW)){
            t11.x -= 1;
            t11.rotateTurret(180);
            console.log('LEFT');
        }
        if (game.keyIsDown(game.RIGHT_ARROW)){
            t11.x += 1;
            t11.rotateTurret(0);
            console.log('RIGHT');
        }
        if (game.keyIsDown(game.UP_ARROW)){
            t11.y -= 1;
            t11.rotateTurret(270);
            console.log('UP');
        }
        if (game.keyIsDown(game.DOWN_ARROW)){
            t11.y += 1;
            t11.rotateTurret(90);
            console.log('DOWN');
        }
        // t21.display(game.random(360));
        // t21.x -= 1;
        // if(t21.x <= 0){t21.x = xBaseB-25;}
    };

    game.mousePressed = function(){
        t11.fire();
    }
};
let cnv = new p5(gameWindow, 'gameWindow');