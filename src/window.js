// loading animation pre lines render
const title = document.getElementById('title');
function loadingAnimation() {
	let t = '~' + title.textContent + '~';
	title.textContent = t;
}
let loadingInterval = setInterval(loadingAnimation, 1000 / 12);

const isMobile = Cool.mobilecheck();
if (isMobile) document.body.classList.add('mobile');

/* this is the game part */
const gme = new Game({
	dps: 30,
	lineWidth: 1,
	width: 640,
	height: 600,
	multiColor: true,
	checkRetina: true,
	// debug: true,
	// stats: true,
	suspend: true,
	events: isMobile ? ['touch'] : ['keyboard', 'mouse'],
	scenes: ['start', 'game'],
	bounds: {
		left: -1024,
		top: 1024,
		right: 1024,
		bottom: 1024,
	}
});

gme.load({ 
	ui: './data/ui.json',
	items: './data/items.json'
}, false);

let clickOne;

let data = {
	'window': {
		next: ['tree', 'bird']
	},
	'door': {
		next: ['cat', 'dog']
	}
}

function newScene(a, b) {
	let left = Cool.choice(...arguments);
	let right = left == a ? b : a;

	let leftUI = new UI({ x: 0.25, y: 0.5, animation: gme.anims.items[left]});
	leftUI.label = left;
	let rightUI = new UI({ x: 0.75, y: 0.5, animation: gme.anims.items[right]});
	rightUI.label = right;


	let y = 0.9 * gme.view.height
	let letters = gme.anims.ui.alphabet;
	let alphaString = 'abcdefghijklmnopqrstuvwxyz';
	let leftLabel = new Text(gme.view.halfWidth / 2, y, left, 10, letters, alphaString);
	let rightLabel = new Text(0.75 * gme.view.width, y, right, 10, letters, alphaString);

	leftLabel.center();
	rightLabel.center();


	gme.scenes.current.addUI(leftUI);
	gme.scenes.current.addUI(rightUI);

	gme.scenes.current.addToDisplay(leftLabel);
	gme.scenes.current.addToDisplay(rightLabel);

	[leftUI, rightUI].forEach(ui => {
		ui.onOver = function() {
			ui.animation.overrideProperty('wiggleRange', 2);
			ui.animation.overrideProperty('wiggleSpeed', 1);

			let speed = [0.1, 0.01];
			let max = [6, 4];
			ui.animation.onUpdate = function() {
				if (ui.animation.override.wiggleRange < max[0]) {
					ui.animation.override.wiggleRange += speed[0];
				}
				if (ui.animation.override.wiggleSpeed < max[1]) {
					ui.animation.override.wiggleSpeed += speed[1];
				}
			};
		};

		ui.onOut = function() {
			ui.animation.cancelOverride();
		};

		ui.onClick = function() {
			if (!gme.scenes[ui.label]) {
				gme.scenes[ui.label] = new Scene();
				gme.scenes.current = ui.label; // do this first to assign right sprites
				if (data[ui.label]) newScene(...data[ui.label].next);
			} else {
				gme.scenes.current = ui.label;
			}
			
			
		};
	});

}

gme.start = function() {
	document.getElementById('splash').remove();
	gme.scenes.current = 'game';

	clickOne = new Sprite(gme.view.halfWidth, gme.anims.ui.click_one.halfHeight, gme.anims.ui.click_one);
	clickOne.center = true;
	gme.scenes.start.addToDisplay(clickOne);

	gme.scenes.current = 'start';
	newScene('window', 'door');
};

// gme.update = function(timeElapsed) {
	
// };

gme.draw = function() {
	gme.scenes.current.display();
};

gme.mouseMoved = function(x, y) {
	gme.scenes.current.mouseMoved(x, y);
};

gme.mouseDown = function(x, y) {
	gme.scenes.current.mouseDown(x, y);
};

gme.mouseUp = function(x, y) {
	gme.scenes.current.mouseUp(x, y);
};