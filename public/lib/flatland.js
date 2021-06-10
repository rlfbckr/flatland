const _VERSION = "v0.04";

const MachineType = {
    NONE: 0,
    CIRCLE: 1,
    RECT: 2,
    TRI: 3,
    POINT: 4,
    LINE: 5,
    CUSTOM: 6
};

function keyPressed() {
    if (key == 'd') {
        if (flatlandConfig.debug == false) {
            flatlandConfig.debug = true;
            gui.show();
        } else {

            flatlandConfig.debug = false;
            gui.hide();
        }
    }
    if (key == 'c') {
        if (flatlandConfig.clearscreen == false) {
            flatlandConfig.clearscreen = true;
        } else {
            flatlandConfig.clearscreen = false;
        }
    }
}

function initSocketIO(_server) {
    //establish a connection to the central flatland server
    socket = io.connect(_server);
    socket.on('updateremotemachines', updateRemoteMachines);
    socket.on('removemachine', removeMachine);
    console.log('socket.id = ' + socket.id);
}

function removeClient(data) {
    flatland.removeClient(data);
}

function removeMachine(data) {
    flatland.removeMachine(data);
}

function updateRemoteMachines(data) {
    flatland.updateRemoteMachines(data);
}



class Flatland {
    constructor() {
        // this.socket = io.connect(flatlandConfig.server);
        // this.socket.on('updateremotemachines', updateRemoteMachines);
        // this.socket.on('removemachine', removeMachine);
        this.machinesLocal = [];
        this.machinesRemote = [];
        this.monofont = loadFont('/assets//fonts/RobotoMono-Regular.otf');

        textFont(this.monofont);
        textSize(12);

        this.overlayCanvas;
        this.overlayCanvas = createGraphics(windowWidth, windowHeight);
        this.overlayCanvas.textFont(this.monofont);
        this.overlayCanvas.textSize(13);

        this.drawingCanvas;
        this.drawingCanvas = createGraphics(windowWidth, windowHeight);
        this.drawingCanvas.background(flatlandConfig.backgroundcolor[0], flatlandConfig.backgroundcolor[1], flatlandConfig.backgroundcolor[2]);
        this.spawn();

    }

    spawn() {
        if (!flatlandConfig.presenter) {
            this.machinesLocal.push(new Machine(this.genRandomMachineID(), random(-width / 2, width / 2), random(-height / 2, height / 2), 100, true));
        }
    }

    clearScreen() {
        background(0, 0, 0);
        if (flatlandConfig.clearscreen) {
            //   background(flatlandConfig.backgroundcolor[0], flatlandConfig.backgroundcolor[1], flatlandConfig.backgroundcolor[2]);
            this.drawingCanvas.background(flatlandConfig.backgroundcolor[0], flatlandConfig.backgroundcolor[1], flatlandConfig.backgroundcolor[2], flatlandConfig.backgroundblend * 255);
        }

    }

    drawDebugInformation() {
        if (flatlandConfig.debug) {
            var _debugmessage_ = 'debug\n' +
                '-------------------------------------\n' +
                'version  : ' + _VERSION + '\n' +
                'fps      : ' + frameRate() + '\n' +
                'myID     : ' + socket.id + '\n' +
                '#local   : ' + this.machineCountLocal() + "\n" +
                '#remote  : ' + this.machineCountRemote() + "\n"+
                'pendown  : ' + machineConfig.pendown+ "\n"+
                '\n'+
                'press <d> to toggle debug mode';
            this.overlayCanvas.clear();
            this.overlayCanvas.fill(0);
            this.overlayCanvas.noStroke();
            this.overlayCanvas.rect(4, 5, 280, 180);
            this.overlayCanvas.fill(255, 255, 255);
            this.overlayCanvas.text(_debugmessage_, 10, 20);
            image(this.overlayCanvas, -width / 2, -height / 2);
        }

    }

    removeMachine(data) {
        if (this.machinesRemote[data.machineid]) {
            this.machinesRemote[data.machineid].setAlive(false);
        }
    }

    removeClient(data) {
        // remove all machines from client
    }

    updateRemoteMachines(data) {
        if (data.socketid == socket.id) return; // my own machines
        if (this.machinesRemote[data.machineid] && this.machinesRemote[data.machineid].isAlive()) {
            this.machinesRemote[data.machineid].set(data.pos.x, data.pos.y, data.size);
            this.machinesRemote[data.machineid].setColor1(data.color1);
            this.machinesRemote[data.machineid].setColor2(data.color2);
            this.machinesRemote[data.machineid].setRotation(data.rotation);
            this.machinesRemote[data.machineid].setPen(data.pendown);
            this.machinesRemote[data.machineid].setType(data.type);

        } else {
            //console.log("new");
            this.machinesRemote[data.machineid] = new Machine(data.machineid, data.pos.x, data.pos.y, data.size, false);
            this.machinesRemote[data.machineid].setSocketID(data.socketid);
            this.machinesRemote[data.machineid].setMachineID(data.machineid);
            //this.machinesRemote[data.machineid].set(data.pos.x, data.pos.y, data.size);
            this.machinesRemote[data.machineid].setColor1(data.color1);
            this.machinesRemote[data.machineid].setColor2(data.color2);
            this.machinesRemote[data.machineid].setRotation(data.rotation);
            this.machinesRemote[data.machineid].setPen(data.pendown);

        }
    }

    update() {
        this.clearScreen();
        image(this.drawingCanvas, -width / 2, -height / 2);
        if (!flatlandConfig.presenter) {
            if (this.machinesLocal.length < machineConfig.maxCount) {
                this.spawn();

            }

            for (let i = 0; i < this.machinesLocal.length; i++) {
                if (!this.machinesLocal[i].isAlive()) {
                    if (this.machinesLocal[i].audio == true) {
                        this.machinesLocal[i].stop();
                    }
                    this.machinesLocal.splice(i, 1);
                } else {
                    this.machinesLocal[i].premove();
                    this.machinesLocal[i].move();
                    this.machinesLocal[i].update(i);
                    this.machinesLocal[i].display();
                }
            }
        }
        for (var key in this.machinesRemote) {
            if (!this.machinesRemote[key].isAlive() || this.machinesRemote[key].lastupdated() > 2000) {
                delete this.machinesRemote[key];
            } else {
                this.machinesRemote[key]._drawOnCanvas();
                this.machinesRemote[key].display();
            }
        }
        /*
                for (var key in this.machinesRemote) {
                    this.machinesRemote[key].display();
                }
                */
        this.drawDebugInformation();
    }

    machineCountRemote() {
        return Object.keys(this.machinesRemote).length;
    }


    machineCountLocal() {
        return this.machinesLocal.length;
    }

    genRandomMachineID() {
        return Math.floor((1 + Math.random()) * 0x10000000000).toString(16).substring(1);
    };
}


class defaultMachine {
    constructor(_machineid, _x, _y, _size, _isLocal) {
        this.t = 0;
        this.id = 0;
        this.alive = true;
        this.type = MachineType.RECT;
        this.pos = createVector(_x, _y);
        this.posPrevious = createVector(this.pos.x, this.pos.y);
        this.size = _size;
        this.rotation = random(PI);
        this.lastupdate = millis();
        this.audio = false;

        this.osc, this.playing, this.freq, this.amp;
        this.freq = 440;
        this.amp = 0.2;
        this.pan = 0;
        this.phase = 0;
        // this.pendown = false;
        this.type = MachineType.CIRCLE;
        this.color1 = color(machineConfig.color1[0], machineConfig.color1[1], machineConfig.color1[2], machineConfig.color1Opacity * 255);
        this.color2 = color(machineConfig.color2[0], machineConfig.color2[1], machineConfig.color2[2], machineConfig.color2Opacity * 255);
        this.speed = 1;
        this.socketid = -1;
        this.machineid = _machineid;
        this.local = _isLocal;
        this.born = millis();
        this.lastsend = millis();
        this.setup();
    }

    stop() {
        this.osc.amp(0, 1.0);

        this.osc.stop(1.0);
    }
    setPhase(_phase) {
        this.osc.phase(_phase);
        this.phase = _phase;
    }
    setPan(_pan) {
        this.osc.pan(_pan, 0.9);
        this.pan = _pan;
    }
    enableAudio() {
        this.osc = new p5.Oscillator('sine');
        this.audio = true;
        this.osc.freq(1, 0);
        this.osc.amp(0, 0);
        this.osc.start();

    }

    updateSound(_freq, _amp) {
        this.freq = _freq;
        this.amp = _amp;
        this.osc.freq(this.freq, 0.8);
        this.osc.amp(this.amp, 0.8);

    }
    setup() {
        // can be overwritten
    }
    setAlive(_set) {
        this.alive = _set;
    }
    isAlive() {
        return this.alive;
    }
    setColor1(_c) {
        this.color1 = color(_c.r, _c.g, _c.b, _c.a);
    }
    setColor2(_c) {
        this.color2 = color(_c.r, _c.g, _c.b, _c.a);
    }
    setRotation(_r) {
        this.rotation = _r;
    }
    setSocketID(_socketid) {
        this.socketid = _socketid;
    }
    setMachineID(_machineid) {
        this.machineid = _machineid;
    }
    setPen(_pendown) {
        this.pendown = _pendown;
    }
    setType(_type) {
        this.type = _type;
    }
    set(_x, _y, _size) {
        this.lastupdate = millis();
        if (!this.local) {
            this.posPrevious.x = this.pos.x;
            this.posPrevious.y = this.pos.y;
            this.pos.x = _x;
            this.pos.y = _y;
        }
        this.size = _size;
    }

    move() {
        this.updatePos()
        this.pos.x += random(-this.speed, this.speed);
        this.pos.y += random(-this.speed, this.speed);
        this.size = map(this.age(), 0, machineConfig.lifetime, machineConfig.maxSize, machineConfig.minSize);
    }
    getLifetime() {
        return map(this.age(), 0, machineConfig.lifetime, 0.0, 1.0);
    }
    penUp() {
        this.pendown = false;
    }
    penDown() {
        this.pendown = true;
    }
    age() {
        return millis() - this.born;
    }
    lastupdated() {
        return millis() - this.lastupdate;
    }
    premove() {
        if (this.local) {
            this.posPrevious.x = this.pos.x;
            this.posPrevious.y = this.pos.y;

        }
    }
    update(_id) {
        this.id = _id;
        if (this.local == true && socket.id != undefined) {
            this.socketid = socket.id;
        }
        if (this.age() > machineConfig.lifetime) {
            this.setAlive(false);
            socket.emit('removemachine', {
                machineid: this.machineid
            });

        } else {
            if ((millis() - this.lastsend) > flatlandConfig.updateIntervall) {
                this.lastsend = millis();
                //send my machine data to server
                var data = {
                    pos: {
                        'x': this.pos.x,
                        'y': this.pos.y
                    },
                    size: this.size,
                    type: this.type,
                    color1: {
                        'r': this.color1.levels[0],
                        'g': this.color1.levels[1],
                        'b': this.color1.levels[2],
                        'a': this.color1.levels[3]
                    },
                    color2: {
                        'r': this.color2.levels[0],
                        'g': this.color2.levels[1],
                        'b': this.color2.levels[2],
                        'a': this.color2.levels[3]
                    },
                    socketid: this.socketid,
                    age: this.age(),
                    rotation: this.rotation,
                    machineid: this.machineid,
                    pendown: this.pendown,
                }
                socket.emit('machine', data);
            }
        }
        this.t++;
        if (this.pos.x < -width / 2) this.pos.x = -width / 2;
        if (this.pos.y < -height / 2) this.pos.y = -height / 2;
        if (this.pos.x > width / 2) this.pos.x = width / 2;
        if (this.pos.y > height / 2) this.pos.y = height / 2;
        //        this.color1 = color(machineConfig.color1[0], machineConfig.color1[1], machineConfig.color1[2], machineConfig.color1Opacity * 255);
        //        this.color2 = color(machineConfig.color2[0], machineConfig.color2[1], machineConfig.color2[2], machineConfig.color2Opacity * 255);
        this.pendown = machineConfig.pendown;
        this.lastupdate = millis();

        this._drawOnCanvas();

    }
    _drawOnCanvas() {
        //        this.pendown = true;
        if (this.pendown && (this.posPrevious.x != this.pos.x || this.posPrevious.y != this.pos.x)) {
            //   flatland.drawingCanvas.stroke(this.pencolor);
            //  flatland.drawingCanvas.strokeWeight(this.pensize);
            // flatland.drawingCanvas.line(this.posPrevious.x + width / 2, this.posPrevious.y + height / 2, this.pos.x + width / 2, this.pos.y + height / 2);
            flatland.drawingCanvas.fill(this.color1);
            flatland.drawingCanvas.stroke(this.color2)
            if (this.type == MachineType.LINE) {
                flatland.drawingCanvas.strokeWeight(this.size);
                //                flatland.drawingCanvas.point(this.pos.x + width / 2, this.pos.y + height / 2)
                flatland.drawingCanvas.line(this.posPrevious.x + width / 2, this.posPrevious.y + height / 2, this.pos.x + width / 2, this.pos.y + height / 2);
            }
            if (this.type == MachineType.POINT) {
                flatland.drawingCanvas.strokeWeight(this.size);
                flatland.drawingCanvas.point(this.pos.x + width / 2, this.pos.y + height / 2)
            }
            if (this.type == MachineType.CIRCLE) {
                flatland.drawingCanvas.strokeWeight(1);
                flatland.drawingCanvas.push();
                flatland.drawingCanvas.translate(this.pos.x + width / 2, this.pos.y + height / 2);
                flatland.drawingCanvas.ellipse(0, 0, this.size, this.size);
                flatland.drawingCanvas.pop();
            }
            if (this.type == MachineType.RECT) {
                flatland.drawingCanvas.strokeWeight(1);
                flatland.drawingCanvas.rectMode(CENTER)
                flatland.drawingCanvas.push();
                flatland.drawingCanvas.translate(this.pos.x + width / 2, this.pos.y + height / 2);
                flatland.drawingCanvas.rotate(this.rotation);
                flatland.drawingCanvas.rect(0, 0, this.size, this.size);

                flatland.drawingCanvas.pop();
            }

        }

    }
    _displayMachine() {
        // fill(128, 255, 128);
        fill(this.color1);
        stroke(this.color2)
            //console.log(this.type);
        if (this.type == MachineType.LINE) {
            strokeWeight(this.size);
            point(this.pos.x, this.pos.y)
        }

        if (this.type == MachineType.POINT) {
            stroke(this.color2)
            point(this.pos.x, this.pos.y)
        }
        if (this.type == MachineType.CIRCLE) {
            strokeWeight(1);
            push();
            translate(this.pos.x, this.pos.y);
            ellipse(0, 0, this.size, this.size);
            pop();
        }
        if (this.type == MachineType.RECT) {
            strokeWeight(1);
            rectMode(CENTER)
            push();
            translate(this.pos.x, this.pos.y);
            rotateZ(this.rotation);
            rect(0, 0, this.size, this.size);
            pop();
        }
    }

    display() {
        if (this.isAlive()) {
            this._displayMachine();
            fill(127, 127, 127);
            if (this.local == true) {
                if (flatlandConfig.debug) {
                    text("LOCAL:\n" + socket.id + "\n" + this.machineid + "\n" + this.pos.x + " " + this.pos.y, this.pos.x, this.pos.y);
                }

            } else {


                if (flatlandConfig.debug) {
                    text("REMOTE\n: " + this.socketid + "\n" + this.machineid, this.pos.x, this.pos.y);
                }

            }
        }
    }

}