/*
   global grid example
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 30,
    spawnIntervall: 100,
    debug: false,
    clearscreen: false,
    backgroundcolor: [0, 0, 0],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'textdemo',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 10000, // forever...!
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
        this.setType(MachineType.TEXT);
        this.setLifetime(10000000); //forever
        this.setSize(random(60, 150));
        this.setStroke(255, 255, 255, 0);
        this.setFill(255, 255, 255, 200);
        this.setText(grid[index].text); // letter
        this.setPosition(grid[index].position.x, grid[index].position.y);
        index = (index + 1) % grid.length;
        this.randomrotation = random(-0.01,0.01);
    }
    move() {
        // how does your machine move 
        this.rotation +=this.randomrotation;
    }
}
// --------------------------------------------------------------



let gui;
let flatland;

// my own  gloabal variables
let index = 0;
let maxpoints = 4;
let margin = 200;
let grid = [];
let textgrid = [
    'H', 'E', 'L', 'L',
    'O', ' ', 'F', 'L',
    'A', 'T', 'L', 'A',
    'N', 'D', '.', '.'
];
// local stuff
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // create a global grid 
    for (var y = 0; y < maxpoints; y++) { // für jede zeile
        for (var x = 0; x < maxpoints; x++) { // für jede spalte
            var position = createVector(
                map(x, 0, maxpoints - 1, -(width / 2) + margin, (width / 2) - margin),
                map(y, 0, maxpoints - 1, -(height / 2) + margin, (height / 2) - margin)
            );
            var data = {
                'position': position,
                'text': textgrid[x + (y * maxpoints)]
            };
            grid.push(data);
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

