/*
   spawn at collsion;
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 40,
    debug: true,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'sketch_spawnatcollision.js',
    maxCount: 20,
    minSize: 20,
    maxSize: 30,
    lifetime: 20000,
    color1: [255, 0, 0],
    color1Opacity: 0.1,
    color2: [0, 255, 0],
    color2Opacity: 0.1,
    pendown: false
}



class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setPenDown();
        this.setType(MachineType.CIRCLE);
        this.setLifetime(100000); // life long
        this.setSize(0); // make me invisible small
        this.collision = false;
        this.collison_id1 = 0;
        this.collison_id2 = 0;
        this.setPosition(0, 0); // stay in the center
    }
    move() {
        // look out for collisions!
        if (this.collision == false) {
            for (var rm1 in flatland.machinesRemote) {
                for (var rm2 in flatland.machinesRemote) {
                    if (rm1 != rm2) {
                        let distance = dist(flatland.machinesRemote[rm1].pos.x, flatland.machinesRemote[rm1].pos.y, flatland.machinesRemote[rm2].pos.x, flatland.machinesRemote[rm2].pos.y);
                        let minimale_distance = 1.3 * ((flatland.machinesRemote[rm1].size / 2) + (flatland.machinesRemote[rm2].size / 2));
                        //console.log(distance);
                        if (distance <= minimale_distance) {
                            console.log("remote BANG " + rm1 + " " + rm2);
                            this.collision = true;
                            this.collison_id1 = rm1;
                            this.collison_id2 = rm2;
                            this.setPosition((flatland.machinesRemote[rm1].pos.x + flatland.machinesRemote[rm2].pos.x) / 2,
                                (flatland.machinesRemote[rm1].pos.y + flatland.machinesRemote[rm2].pos.y) / 2
                            );
                            this.setSize(100); // make me visible again
                            this.setLifetime(3000); // shorten my life
                            this.setFill(0, 0, 255); // make me blue
                            continue;
                        }
                    }
                }

            }

        } else {
            this.setSize(map(this.getLifetime(), 0, 1.0, 100, 0)); // shrink over time
            this.setPosition(this.pos.x+random(-2,2),this.pos.y+random(-2,2)); // borwnian 
        }
    }
}
// --------------------------------------------------------------
let gui;
let flatland;
let gravitation;
let friction = 0.7;
let lastspawn = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
    gravitation = createVector(0, -0);

}


function draw() {
    flatland.update(); // update + draw flatland
}
