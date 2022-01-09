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

let clickOne, leftLabel, rightLabel, textY;
let wrap = 10, alphaString = 'abcdefghijklmnopqrstuvwxyz';

let data = {
	window: { next: ['tree', 'bird'],
		label: ['window', 'setting',  'in the beginning', 'the trouble', 'back to the beginning']
	},
	door: { next: ['cat', 'dog'],
		label: ['door', 'exposition', 'it was a dark room', 'they heard a sound', 'their popularity had passed', 'the entrance closed behind them']
	},
	bird: { next: ['flower', 'rabbit'],
		label: ['bird', 'inciting incident', 'a bantam chicken', 'the humble proletarian', 'the fowl']
	},
	cat: { next: ['jar', 'plunger'],
		label: ['cat', 'protagonist', 'they were lost', 'they smelled', 'they were in hell', 'they came with tooth, bone and pearl']
	},
	dog: { next: ['hole', 'mailbox'],
		label: ['dog', 'character', 'they must fetch', 'fetch a fellow', 'an associate', 'they found the fellow']
	},
	tree: { next: ['serpent', 'fruit'],
		label: ['tree', 'climax', 'the hunt began', 'they are the player', 'they found the seed']
	},
	jar: { next: ['piss_christ', 'quorum'],
		label: ['jar', 'resolution', 'they were a thinker', 'they find a jar of memories', 'they were lying', ]
	},
	employer: { next: ['nail', 'tofu'],
		label: ['employer', 'gauntlet', 'a true leader', 'a piece of shit', 'make more money', 'die alone']
	},
	flower: { next: ['garbage', 'valley'],
		label: ['flower', 'time cave', 'periodic', 'they fall in love', 'they smell in love', 'they grow together', 'they wilt away']
	},
	fruit: { next: ['pig', 'premise'],
		label: ['fruit', 'branch', 'they did not understand the consequence', 'the taste was unforgettable', ]
	},
	garbage: { next: ['napkin', 'employer'],
		label: ['garbage', 'bottleneck', 'they lived in a wasteland', 'they survived on scraps', 'it all turned out okay']
	},
	hole: { next: ['iced_coffee', 'oyster'],
		label: ['hole', 'quest', 'they thought it could be fixed', 'they appealed to their persecutor', 'they were in a hole' ]
	},
	iced_coffee: { next: ['vacuum', 'moon'],
		label: ['iced coffee', 'conflict', 'they could not find an iced coffee anywhere', 'a savior came', 'their blood flowed from their veins', ] 
	},
	kill: { next: ['leaf', 'shirt'],
		label: ['kill', 'turning point', 'they did a crime', 'they pursed the criminal', 'vengeance']
	},
	leaf: { next: ['worm', 'rubric'],
		label: ['leaf', 'floating', 'the garment was a clue', 'it had to be their family', 'but it could not be their family']
	},
	mailbox: { next: ['nacho', 'quicksand'],
		label: ['mailbox', 'loop and grow', 'the letter arrived in the mailbox', 'they saw through the foliage', 'the letter foretold a disaster']
	},
	moon: { next: ['kill', 'window'],
		label: ['moon', 'flashback', 'mindless cruelty', 'why', 'why did they do it']
	},
	nacho: { next: ['door', 'underpants'],
		label: ['nacho', 'fishbone', 'there was a tyrant', 'and a conspiracy', 'but the plot failed']
	},
	nail: { next: ['jar', 'bird'],
		label: ['nail', 'parallel', 'they were tagged in the code', 'the enemy was at the grocery store', 'the object was their to take']
	},
	napkin: { next: ['cat', 'door'],
		label: ['napkin', 'frame', 'an abduction', 'they could not be found']
	},

	oyster: { next: ['dog', 'employer'],
		label: ['oyster', 'progress', 'an explosion']
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
};

function newScene(a, b) {
	// console.log(...arguments);

	let left = Cool.choice(...arguments);
	let right = left == a ? b : a;
	let sceneName = `${left}-${right}`;
	gme.scenes.current = sceneName;

	let [leftLabelText, rightLabelText] = [left, right].map(side => {
		return data[side].index < data[side].label.length - 1 ?
			data[side].label[data[side].index]:
			'the end';
	});

	leftLabel.setMsg(leftLabelText);
	rightLabel.setMsg(rightLabelText);

	leftLabel.x = Math.round(gme.view.width * 0.25);
	rightLabel.x = Math.round(gme.view.width * 0.75);

	leftLabel.y = textY;
	rightLabel.y = textY;

	leftLabel.center();
	rightLabel.center();

	if (!gme.scenes[sceneName]) {
		gme.scenes[sceneName] = new Scene();

		let leftUI = new UI({ x: 0.25, y: 0.5, animation: gme.anims.items[left]});
		let rightUI = new UI({ x: 0.75, y: 0.5, animation: gme.anims.items[right]});

		leftUI.item = left;
		rightUI.item = right;

		gme.scenes.current.addUI(leftUI);
		gme.scenes.current.addUI(rightUI);

		[leftUI, rightUI].forEach(ui => {
			ui.onOver = function() {
				ui.animation.overrideProperty('wiggleRange', 2);
				ui.animation.overrideProperty('wiggleSpeed', 1);

				let speed = [0.2, 0.02];
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

				if (!clickOne.clickedOnce) clickOne.clickedOnce = true;
				ui.animation.cancelOverride();
				if (data[ui.item]) {
					newScene(...data[ui.item].next);
					data[ui.item].index++;
				}
			};
		});
	}
}

gme.start = function() {
	document.getElementById('splash').remove();
	gme.scenes.current = 'game';

	clickOne = new Sprite(gme.view.halfWidth, gme.anims.ui.click_one.halfHeight, gme.anims.ui.click_one);
	clickOne.center = true;
	clickOne.clickedOnce = false;
	gme.scenes.start.addToDisplay(clickOne);

	textY = 0.8 * gme.view.height;
	let letters = gme.anims.ui.alphabet;
	
	leftLabel = new Text(gme.view.halfWidth / 2, textY, '', wrap, letters, alphaString);
	rightLabel = new Text(0.75 * gme.view.width, textY, '', wrap, letters, alphaString);
	leftLabel.center();
	rightLabel.center();

	for (const k in data) {
		data[k].index = 0;
	}

	test = new Text(gme.view.halfWidth, gme.view.halfHeight, 'they find a jar of memories', wrap, letters, alphaString);

	newScene('window', 'door');
};

gme.draw = function() {
	// test.display();
	if (!clickOne.clickedOnce) clickOne.display();
	gme.scenes.current.display();
	leftLabel.display(false, false, 0, 0, true);
	rightLabel.display(false, false, 0, 0, true);
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

/* css stuff */

const darkStyleCheckbox = document.getElementById('dark-style');
const styleLabel = document.getElementById('style-label');

darkStyleCheckbox.onchange = function() {
	if (darkStyleCheckbox.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}

	let [c1, c2] = darkStyleCheckbox.checked ?
		['#000000', '#ffffff'] :
		['#ffffff', '#000000'];

	for (const k in gme.anims.items) {
		let a = gme.anims.items[k];
		a.layers.forEach(l => {
			if (l.color === c1) l.color = c2;
		});
	}

	for (const k in gme.anims.ui) {
		let a = gme.anims.ui[k];
		a.layers.forEach(l => {
			if (l.color === c1) l.color = c2;
		});
	}
};
