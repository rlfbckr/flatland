# reference

### machine-configuration

```javascript
var flatlandConfig = {
    server: "https://flatland.earth",  // server to connect to
    land: 'default',                   // use default land or use your own "private" land to code together "lalaland"
    updateIntervall: 40,               // send date to the server every xx ms
    spawnIntervall: 10,                // intervall between to new machines!
    debug: true,                       // show debug information
    clearscreen: true,                 // clear the background or not
    backgroundcolor: [255, 255, 255],  // background color
    backgroundblend: 0.5               // background transpacency
}

var machineConfig = {
    name: 'example-machine',           // name your machines
    maxCount: 1,                       // how many machines do you want to spawn
    minSize: 20,                       // min size of your bots
    maxSize: 30,                       // max size of your bots
    lifetime: 1000,                    // how long will it stay alive
    pendown: false,                    // draw on background true / false
    color1: [255, 0, 255],             // default fill color
    color1Opacity: 1,                  // default fill transparency
    color2: [0, 0, 0],                 // default stroke color
    color2Opacity: 1                   // default stroke transparency
}
```
### machine-code-skeleton

```javascript
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setType(MachineType.RECT);                        // make bot a rectangle
        this.setFill(255,255,255);                             // change fill color to white
        this.setStroke(0,0,255);                               // change boder color blue
        this.setRotation(PI/4);                                // rotate bot 45 degree
        this.setPosition(random(-100,100),random(-100,100));   // "spawn" bot at random pos
    }
    move() {
        // how does your machine move 
        this.setPosition(this.pos.x+random(-2,2),this.pos.y+random(-2,2)); // update position
    }
}
```

### p5.js wrapper-code-skeleton
```javascript
let gui;
let flatland;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
}

function draw() {
    flatland.update(); // update + draw flatland
}

```


## drawing command

### setType
*change drawing/bot shape type*

#### CIRCLE
```javascript
this.setType(MachineType.CIRCLE);
// or
this.type = MachineType.CIRCLE;   // (deprecated) will be gone soon
```
#### RECT
```javascript
this.setType(MachineType.RECT);
// or
this.type = MachineType.RECT;     // (deprecated)
```
#### POINT
```javascript
this.setType(MachineType.POINT);
// or
this.type = MachineType.POINT;    // (deprecated)
```
#### LINE
```javascript
this.setType(MachineType.LINE);
// or
this.type = MachineType.LINE;     // (deprecated)
```

### setRotation
*rotate bot*
```javascript
this.setRotation( PI/4 ); // 45 degree
// or
this.rotation =  PI/4;    // 45 degree (deprecated)
```

### setPosition
*move bot around*
*coordinate systen 0,0 is in the screen center*
```javascript
this.setPosition( 100, -100 );
// or
this.pos.x = 100;
this.pos.y = -100; 
```

### setSize
*set bot size in pixel*
```javascript
this.setSize(100);
// or
this.size = 100; (deprecated)
```

### setFill / setColor1
*fill color*
```javascript
this.setFill(255,0,0,128);
// or
this.color1 = color(255,0,0,128); // transparent red
// or
var mycolor = color(255,0,0,128);
this.setColor1(mycolor);
// or
this.setColor1(255,0,0,128);
```

### setStroke / setColor2
*stroke*
```javascript
this.setStroke(255,0,0,128);
// or
this.color2 = color(255,0,0,128); // transparent red
// or
var mycolor = color(255,0,0,128);
this.setColor2(mycolor);
//or
this.setColor2(255,0,0,128);
// or
```

## audio commands
*mostly wrapper functions for (https://p5js.org/reference/#/libraries/p5.sound)*

#### enableAudio
*turn on audio for this machine*
```javascript
this.enableAudio();
```
#### setAudioFrequency
```javascript
this.setAudioFrequency(440); // set to 440 Hz
```
#### setAudioAmplitude
```javascript
this.setAudioAmplitude(0.5); // half
```
#### setAudioPan
*audio panning*
-1 = left,
 0  = center,
 1 = right*
```javascript
this.setAudioPan(0); // center
```
#### setAudioPhase
*set phase of oscillator between 0 - 1*
```javascript
this.setAudioPhase(0.5); 
```
###  this.connectReverb
*connects synthesis to reverb*
```javascript
this.connectReverb(3,2); // roomsize + decay
```
###  this.setReverbAmp
*set amplification*
```javascript
this.setReverbAmp(3.5); // reverb amplification
```
###  this.setReverbDrywet
*dry-wet 0-1*
```javascript
this.setReverbDrywet(1); // 
```
## lifetime
*machine initializes with machineConfig.lifetime*

#### setLifetime
*set lifetime in ms*
```javascript
this.setLifetime(10000); // 10000 ms =  10 seconds 
```
#### getLifetime
*returns lifetime in float between 0 - 1 (born - death)*
```javascript
var currentlifetime = this.getLiftime(); 
```
