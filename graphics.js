class Posn {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    copy () {
        return new Posn(this.x, this.y);
    }

    add (other) {
        this.x += other.x;
        this.y += other.y;
        return this.copy();
    }

    mul (num) {
        this.x *= num;
        this.y *= num;
        return this.copy();
    }

    offset (other) {
		return new Posn(this.x - other.x, this.y - other.y);
	}
	
    dist (other) {
		return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
	}
}

function random (from, to) {
    return Math.random()*(to-from) + from;
}

var textBank = `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.

Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled “ORANGE MARMALADE”, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.

“Well!” thought Alice to herself, “after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!” (Which was very likely true.)

Down, down, down. Would the fall never come to an end? “I wonder how many miles I’ve fallen by this time?” she said aloud. “I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—” (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over).`;

var header = "HEADER";

const monospace = new PIXI.TextStyle({
    fontFamily: "\"Lucida Console\", Monaco, monospace",
});

var app;
var startTime;

$(() => {
startTime = performance.now();
console.log(startTime);

app = new PIXI.Application({resizeTo: window, transparent: true}); // Initialize the app
document.body.appendChild(app.view); // append it to the body
var graphics = new PIXI.Graphics(); // create a graphics object
var sprites = new PIXI.Container(200000, [false, true, false, false, false]); // create the container for the text sprites
app.stage.addChild(sprites);

var width = app.renderer.width; // get width & height
var height = app.renderer.height;

console.log(`${width} x ${height}`);

app.stage.hitArea = app.screen;
app.stage.interactive = true; // make interactive

var circleGraphics = new PIXI.Graphics(); // draw a circle
circleGraphics.beginFill(0xe74c3c);
circleGraphics.drawCircle(0, 0, 40);
circleGraphics.endFill();

var texture = app.renderer.generateTexture(circleGraphics); // create a sprite from the circle
var circle = new PIXI.Sprite(texture);
circle.anchor.set(0.5);

// REAL SHi

var main = makeGrid(width, height, 16, 25); // populate an array with Beefy Text, whose position is in a grid pattern
var headerSprites = makeHeader(header);
addEnMasse(main, sprites); // add them as children to sprites arr
addEnMasse(headerSprites, sprites);

// console.log(main);

var lastX = 0; // last mouse pos (to tell if the mouse has moved)
var lastY = 0;

var dragging = false; // is the mouse dragging?

app.renderer.plugins.interaction.on("mousedown", () => {
    dragging = true;
});

app.renderer.plugins.interaction.on("mouseup", () => {
    dragging = false;
});

var timesTicked = 0;

app.ticker.add(function(delta) {

    if (timesTicked < 2) {
        timesTicked++;
    }

    if (timesTicked == 2) {
        console.log("loaded");
        loaded();
        timesTicked++;
    }

    const x = app.renderer.plugins.interaction.mouse.global.x;
    const y = app.renderer.plugins.interaction.mouse.global.y;

    // if (x != lastX || y != lastY) { // mouse movement burst mode
    //     burst (x, y, main, 0.04);
    //     lastX = x;
    //     lastY = y;
    // }

    if (dragging) {
        burst(x, y, main, 0.04);
    }

    // for (var letterSprite of headerSprites) {
    //     burst(letterSprite.x + letterSprite.width / 2, letterSprite.y + letterSprite.height / 2, main, 0.02);
    // }

    for (var i = 0; i < main.length; i++) {
        main[i].update(0.01); // update the text at each tick
    }
});

});

function makeGrid (w, h, xSpacing, ySpacing) {
    var arr = [];
    var position = 0;
    
	for (var i = 0; i < h; i += ySpacing) {
		for (var j = 0; j < w; j += xSpacing) {
            // var t = makeBeefyText(i, j, Math.random().toString(20)[3]); // make beefy text with a random string
            if (textBank[position] == " ") {
                j++;
                position++;
            } else {
                arr.push(makeBeefyText(j, i, textBank[position++], monospace)); // make beefy text with corresponding character from Alice in Wonderland
            }
		}
    }
    
    console.log(`Number of letters: ${arr.length}`);
	
	return arr;
}

function makeHeader (text) {
    var arr = [];

    for (var i = 0; i < text.length; i++) {

        var l = makeBeefyText(i * 200 + 150, 100, text[i], null, 20);
        l.scale.set(8);
        arr.push(l);
    }

    return arr;
}

function makeBeefyText (x, y, str, style, resolution) { // makes a PIXI.Text object with additional information to allow physics
    var original = style != null ? new PIXI.Text(str, style) : new PIXI.Text(str);

    if (resolution != null) {
        console.log("ok");
        original.resolution = resolution;
    }

    var t = original;
    t.supposed = new Posn(x, y); // the initial position (doesnt change)
    t.vel = new Posn(0, 0);
    t.acc = new Posn(0, 0);
    t.pos = new Posn(x, y);
    t.x = x;
    t.y = y;
    //t.resolution = 2;

    t.update = (jitterAmount) => { // update the position of the text according to basic physics
        t.applyForce(new Posn(random(-jitterAmount, jitterAmount), random(-jitterAmount, jitterAmount))); // apply a random force for jitter effect
		t.seek(t.supposed); // seek the original location
		t.vel.add(t.acc); // velocity += acceleration
		t.pos.add(t.vel); // position += velocity
		t.vel.mul(0.95); // friction
		t.acc.mul(0); //clear acc

        t.x = t.pos.x; // set the position for PIXI to render. We don't need to deal with any drawing/rendering, because every child of the container/stage will be rendered automatically.
        t.y = t.pos.y;
    }

    t.seek = (target) => { // go towards the target
        t.applyForce(t.pos.offset(target).mul(t.pos.dist(target)).mul(-0.01));
    }
    
    t.applyForce = (force) => {
        t.acc.add(force);
    }

    return t;
}

function addEnMasse (items, container) {
    for (var i = 0; i < items.length; i++) {
        container.addChild(items[i]);
    }
}

function burst (x, y, LoBText, multiplier) {
    var mouse = new Posn(x, y);
    LoBText.forEach(elem => {
        elem.applyForce(elem.pos.offset(mouse).mul(Math.pow(2, -(elem.pos.dist(mouse) * multiplier))));
    });
}

function loaded () {
    console.log(`Time elapsed to render: ${performance.now() - startTime}ms.`);
    $("#loading-tag").hide();
    $("#image").show();
}