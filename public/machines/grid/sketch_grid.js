/*
   global grid example
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 30,
    debug: false,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'grid',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 1000000, // forever...!
    color1: [255, 0, 255],
    color1Opacity: 0.1,
    color2: [0, 255, 255],
    color2Opacity: 0.1,
    pendown: false
}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.type = MachineType.POINT;
        this.size = random(30, 100);
        // this.rad = random(10, 300);
        this.color2 = color(random(255), random(255), random(255));
        //this.penDown();
        this.myown_rotationspeed = random(-0.001,0.001);
        this.myownrandomradius = random(20, 60);
        this.myownvariable_centerx = grid[order].x;
        this.myownvariable_centery = grid[order].y;
        order = (order + 1) % grid.length;
    }
    move() {
        // how does your machine move 
        this.pos.x = this.myownvariable_centerx + cos(millis() * this.myown_rotationspeed) * this.myownrandomradius;
        this.pos.y = this.myownvariable_centery + sin(millis() * this.myown_rotationspeed) * this.myownrandomradius;
    }
}
// --------------------------------------------------------------



let gui;
let flatland;

// my own  gloabal variables
let order = 0;
let grid = [];
let maxpoints = 8; // wieviele punkte
let margin = 200; // wieviel rand (open, unten, rechts, links)

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    for (var y = 0; y < maxpoints; y++) { // für jede zeile
        for (var x = 0; x < maxpoints; x++) { // für jede spalte
            var v = createVector(
                map(x, 0, maxpoints - 1, -(width / 2) + margin, (width / 2) - margin),
                map(y, 0, maxpoints - 1, -(height / 2) + margin, (height / 2) - margin)
            );
            console.log(v.x + ' ' + v.y);
            grid.push(v);
        }
    }
    machineConfig.maxCount = grid.length;

    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
}

function draw() {
    flatland.update(); // update + draw flatland
}

