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
	window: { next: ['tree', 'bird'],
		label: ['window', 'setting', ]
	},
	door: { next: ['cat', 'dog'],
		label: ['door', 'exposition', ]
	},
	bird: { next: ['flower', 'rabbit'],
		label: ['bird', 'inciting incident']
	},
	cat: { next: ['jar', 'plunger'],
		label: ['cat', 'protagonist']
	},
	dog: { next: ['hole', 'mailbox'],
		label: ['dog', 'character']
	},
	tree: { next: ['serpent', 'fruit'],
		label: ['tree', 'climax']
	},
	jar: { next: ['piss_christ', 'quorum'],
		label: ['jar', 'resolution',]
	},
	employer: { next: ['nail', 'tofu'],
		label: ['employer', 'gauntlet',]
	},
	flower: { next: ['garbage', 'valley'],
		label: ['flower', 'time cave',]
	},
	fruit: { next: ['pig', 'premise'],
		label: ['fruit', 'branch',]
	},
	garbage: { next: ['napkin', 'employer'],
		label: ['garbage', 'bottleneck',]
	},
	hole: { next: ['iced_coffee', 'oyster'],
		label: ['hole', 'quest',]
	},
	iced_coffee: { next: ['vacuum', 'moon'],
		label: ['iced_coffee', 'conflict'] 
	},
	kill: { next: ['leaf', 'shirt'],
		label: ['kill', 'sorting hat', ]
	},
	leaf: { next: ['worm', 'rubric'],
		label: ['leaf', 'floating', ]
	},
	mailbox: { next: ['nacho', 'quicksand'],
		label: ['mailbox', 'loop and grow', ]
	},
	moon: { next: ['kill', 'window'],
		label: ['moon', 'flashback', ]
	},
	nacho: { next: ['door', 'underpants'],
		label: ['nacho', 'fishbone', ]
	},
	nail: { next: ['jar', 'bird'],
		label: ['nail', 'parallel', ]
	},
	napkin: { next: ['cat', 'door'],
		label: ['napkin', 'frame', ]
	},
	oyster: { next: ['dog', 'employer'],
		label: ['oyster', 'progress',]
	},
	pig: { next: ['flower', 'fruit'],
		label: ['pig', 'emergence', ]
	},
	piss_christ: { next: ['garbage', 'hole'],
		label: ['piss_christ', 'object oriented', ]
	},
	plunger: { next: ['iced_coffee', 'kill'],
		label: ['plunger', 'choice', ]
	},
	premise: { next: ['leaf', 'mailbox'],
		label: ['premise', 'doom',]
	},
	quicksand: { next: ['moon', 'nacho'],
		label: ['quicksand', 'intent',]
	},
	quorum: { next: ['nail', 'plunger'],
		label: ['quorum', 'intervention', ]
	},
	rabbit: { next: ['premise', 'quorum'],
		label: ['rabbit', 'autonomy', ]
	},
	rubric: { next: ['napkin', 'oyster'],
		label: ['rubric', 'agent', ]
	},
	serpent: { next: ['pig', 'quicksand'],
		label: ['serpent', 'theme',]
	},
	shirt: { next: ['rabbit', 'tree'],
		label: ['shirt', 'model', ]
	},
	tofu: { next: ['valley', 'underpants'],
		label: ['tofu', 'resolution', ]
	},
	underpants: { next: ['vacuum', 'window'],
		label: ['underpants', 'recognition']
	},
	vacuum: { next: ['serpent', 'shirt'],
		label: ['vacuum', 'reversal',]
	},
	valley: { next: ['rubric', 'window'],
		label: ['valley', 'obstacles',]
	},
	worm: { next: ['tofu', 'door'],
		label: ['worm', 'turning point', ]
	},
}

function newScene(a, b) {
	console.log(...arguments);
	let left = Cool.choice(...arguments);
	let right = left == a ? b : a;
	let sceneName = `${left}-${right}`;

	let [leftLabel, rightLabel] = [left, right].map(side => {
		if (data[side].index === undefined) {
			data[side].index = 0;
			return data[side].label[side[side].index];
		} else if (data[side].index < data[side].label.length) {
			data[side].index++;
			return leftLabel = data[side].label[data[side].index];
		} else { 
			return 'the end';
		}
	});

	if (gme.scenes[sceneName]) {

	} else {

		let leftUI = new UI({ x: 0.25, y: 0.5, animation: gme.anims.items[left]});
		let rightUI = new UI({ x: 0.75, y: 0.5, animation: gme.anims.items[right]});

		leftUI.item = left;
		rightUI.item = right;

		let y = 0.8 * gme.view.height
		let letters = gme.anims.ui.alphabet;
		let alphaString = 'abcdefghijklmnopqrstuvwxyz';
		let leftLabel = new Text(gme.view.halfWidth / 2, y, leftLabel, 10, letters, alphaString);
		let rightLabel = new Text(0.75 * gme.view.width, y, rightLabel, 10, letters, alphaString);

		leftLabel.center();
		rightLabel.center();

		gme.scenes.current.addUI(leftUI);
		gme.scenes.current.addUI(rightUI);

		gme.scenes.current.addToDisplay(leftLabel, 'leftLabel');
		gme.scenes.current.addToDisplay(rightLabel, 'rightLabel');
	}

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
			if (!gme.scenes[sceneName]) {
				gme.scenes[sceneName] = new Scene();
				gme.scenes.current = ui.item; // do this first to assign right sprites
				if (data[ui.item]) newScene(...data[ui.item].next);
			} else {
				// fuck gotta change order and label ... 
				gme.scenes.current = ui.item;
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