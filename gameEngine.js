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

let nn1, nn2;

let gameWindow = function(game){
    let b1, b2, m1, m2, m3, m4, t11, t21;
    let t = 0;
    game.preload = function(){
        nn1 = new NeuralNetwork(2, 6, 2, 4, 0.1);
        nn2 = new NeuralNetwork(2, 6, 2, 1, 0.1);
    };

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
        t += 1;
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
        
        if(t11.x >= canvasWidth-tankWidth){t11.x = xBaseA+55;}
        let hit = t11.collide(m1);
        if (hit==true){
            console.log("hit");
        }

        t11.train();
        t21.train();

        t11.move();
        t21.move();
       
        //turret movement
        if (t % 60 == 0){
            t11.moveTurret();
            t21.moveTurret();
            t=0;
        }

        t11.display();  
        t21.display();

        // if(game.keyIsDown(game.LEFT_ARROW)){
        //     t11.x -= 1;
        // } else
        // if (game.keyIsDown(game.RIGHT_ARROW)){
        //     t11.x += 1;
        // } else
        // if (game.keyIsDown(game.UP_ARROW)){
        //     t11.y -= 1;
        // } else
        // if (game.keyIsDown(game.DOWN_ARROW)){
        //     t11.y += 1;
        // }

        // t21.display(game.random(360));
        // t21.x -= 1;
        // if(t21.x <= 0){t21.x = xBaseB-25;}
    };

    game.mousePressed = function(){
        t11.fire();
    }

    // game.keyPressed = function(){
        // if (game.keyCode == 65){
        //     angle -= 45;
        // } else
        // if (game.keyCode == 68){
        //     angle += 45;
        // }
    // }
};
let cnv = new p5(gameWindow, 'gameWindow');