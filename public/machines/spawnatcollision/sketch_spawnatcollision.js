/*
   spawn at collsion;
*/

var flatlandConfig = {
    server: "https://flatland.hfk-bremen.de",
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 100,
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
        this.setLifetime(1000000); // life long
        this.setSize(0); // make me invisible small
        this.collision = false;
      //  this.collison_id1 = 0;
     //   this.collison_id2 = 0;
        this.setPosition(0, 0); // stay in the center
    }
    move() {
        // look out for collisions!
        if (this.collision == false) {
            for (var rm1 in flatland.machinesRemote) {
                for (var rm2 in flatland.machinesRemote) {
                    var colission_pair_id = join(sort([rm1, rm2]), ""); // a unique id fpr the collision
                    var collision_lock = false; // lock this collision for checking 
                    if (collision_list.hasOwnProperty(colission_pair_id)) { // did this collison happend already a few ms before?
                   //     console.log("jh = " + colission_pair_id);
                        collision_lock = true;
                    }
                    if ((rm1 != rm2) && (!collision_lock)) {
                        let distance = dist(flatland.machinesRemote[rm1].pos.x, flatland.machinesRemote[rm1].pos.y, flatland.machinesRemote[rm2].pos.x, flatland.machinesRemote[rm2].pos.y);
                        let minimale_distance = 1.1 * ((flatland.machinesRemote[rm1].size / 2) + (flatland.machinesRemote[rm2].size / 2));
                        //console.log(distance);
                        if (distance <= minimale_distance) {
                            // console.log("remote BANG " + rm1 + " " + rm2);
                            this.collision = true;

                            this.setPosition((flatland.machinesRemote[rm1].pos.x + flatland.machinesRemote[rm2].pos.x) / 2,
                                (flatland.machinesRemote[rm1].pos.y + flatland.machinesRemote[rm2].pos.y) / 2
                            );
                            this.setSize(100); // make me visible again
                            this.setLifetime(2000); // shorten my life
                            this.setFill(0, 0, 255); // make me blue
                            console.log("add " + colission_pair_id);

                            collision_list[colission_pair_id] = millis();
                            break; // leave loop now!
                        }
                    }
                }

            }

        } else {
            this.setSize(map(this.getLifetime(), 0, 1.0, 100, 0)); // shrink over time
            this.setPosition(this.pos.x + random(-1, 1), this.pos.y + random(-1, 1)); // borwnian 
        }
    }
}

// --------------------------------------------------------------
let gui;
let flatland;
let gravitation;

//let collision_list =  new Map(); // log all collisions here
let collision_list = {}; // log all collisions here

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
    //var vv = "10f3242fdsf";
    //collision_list[vv] = millis();



}


function draw() {
    flatland.update(); // update + draw flatland
    fill(0, 0, 255,128);
    textSize(30);
    var out = "";
    for (var k in collision_list) {
        out += k + " = " + collision_list[k] + "\n";
        if ((millis() - collision_list[k]) > 100) {
            delete collision_list[k];
        }
    }
    text("collisions: "+Object.keys(collision_list).length + "\n" + out, -300, -100);
}
