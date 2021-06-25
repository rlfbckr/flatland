/*
   typo swarm
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'growth',
    updateIntervall: 40,
    spawnIntervall: 1,
    debug: false,
    clearscreen: true,
    backgroundcolor: [0,0,0],
    backgroundblend: 0.01,
}

var machineConfig = {
    name: 'empty-machine-example',
    maxCount: 1,
    minSize: 20,
    maxSize: 30,
    lifetime: 6000,
    color1: [0, 0, 0],
    color1Opacity: 1,
    color2: [0, 0, 0],
    color2Opacity: 1,
    pendown: true
}



// ---------------------------------------------------------------

class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setPenDown();
        this.setLifetime(10000000);
        this.setType(MachineType.LINE);
        this.startpoint = createVector(this.pos.x, this.pos.y)
        this.setStroke( noise((this.size * 0.001) * 1)    *255, 
                        noise((this.size * 0.001) * 100)  * 255, 
                        noise((this.size * 0.001) * 1000) * 255, 
                        map(this.size,max_depth,1,5,255),);
        this.angle = random(2 * PI); // random richtung
        this.drift =  random(-0.01, 0.01);
    }
    move() {
        // how does your machine move 
        this.angle += this.drift;
        this.direction = createVector(cos(this.angle) * 1.1, sin(this.angle) * 1.1);
        this.pos.x += this.direction.x;
        this.pos.y += this.direction.y;
        var newsize = constrain(this.size - 0.5, 1,1000);
        //  if (newsize < current_depth) { current_depth = newsize; }
        var maxdist = constrain(map(newsize, 0, max_depth, 1, 70), 1, 80);
        var current_dist = dist(this.startpoint.x, this.startpoint.y, this.pos.x, this.pos.y);
        fill(255, 0, 0);
        textSize(10);
        //text(newsize+ " ( "+ int(current_dist) + " > " + int(maxdist) +")",this.pos.x,this.pos.y);
        if (current_dist >= maxdist) {
            this.setAlive(false);  // kill myselfd
            if ((flatland.machineCountLocal() < 50) && (newsize >= 1)) {
                flatland.spawn(this.pos.x, this.pos.y, newsize); // spawn new 
                flatland.spawn(this.pos.x, this.pos.y, newsize); // spawn new 
                flatland.spawn(this.pos.x, this.pos.y, newsize); // spawn new 
            }
        }
    }
}
// --------------------------------------------------------------




// global p5 stuff
let gui;
let flatland;
let max_depth = 20;
//let current_depth = max_depth;

function setup() {
    noiseSeed(10);
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(0); // disables autospawn function
    initSocketIO(flatlandConfig.server);
    initGui();
    flatland.spawn(0, 0, max_depth); // spawn first at pos
//    flatland.drawingCanvas.blendMode(SCREEN);
    flatland.drawingCanvas.blendMode(SCREEN );

}


function draw() {
    flatland.update(); // update + draw flatland
}
