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
	lineWidth: 2,
	width: 640,
	height: 600,
	multiColor: true,
	checkRetina: true,
	// debug: true,
	// stats: true,
	suspend: true,
	events: isMobile ? ['touch'] : ['keyboard', 'mouse'],
	scenes: ['start', 'game', 'mobile'],
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
	jar: { next: ['skeleton', 'quorum'],
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
		label: ['oyster', 'progress', 'an explosion', 'the oyster of discord', 'they wanted the world']
	},
	pig: { next: ['flower', 'fruit'],
		label: ['pig', 'emergence', 'they ran from their kin the squealer', 'they found love in the forest', 'they found love in the soil']
	},
	skeleton: { next: ['garbage', 'hole'],
		label: ['skeleton', 'they had a problem', 'the skeleton told them to seek the creature the body of a lion', 'was it a metaphor']
	},
	plunger: { next: ['iced_coffee', 'kill'],
		label: ['plunger', 'choice', 'they were filled with envy', 'they could not remove the obstacle', 'many years later they wondered who was really the envious one']
	},
	premise: { next: ['leaf', 'mailbox'],
		label: ['premise', 'doom', 'just murder', 'and adultery', 'and conspiracy']
	},
	quicksand: { next: ['moon', 'nacho'],
		label: ['quicksand', 'intent', 'they could not erase the memory', 'and they were driven mad', 'and they descended further']
	},
	quorum: { next: ['nail', 'plunger'],
		label: ['quorum', 'intervention', 'they did not wait for quorum', 'the body was stripped bare', 'the public gathering was minimal']
	},
	rabbit: { next: ['premise', 'quorum'],
		label: ['rabbit', 'autonomy', 'they did not know', 'their love was forbidden', 'the messenger was lost in the wind', ]
	},
	rubric: { next: ['napkin', 'oyster'],
		label: ['rubric', 'agent', 'was it ideology or idealism', 'carnal or bodily', 'a sacrifice']
	},
	serpent: { next: ['pig', 'quicksand'],
		label: ['serpent', 'theme', 'the self without the other', 'like a stream', 'the hero']
	},
	shirt: { next: ['rabbit', 'tree'],
		label: ['shirt', 'model', 'a secret passion', 'or a lover', 'lost forever']
	},
	tofu: { next: ['valley', 'underpants'],
		label: ['tofu', 'resolution', 'the days were full of monotony', 'they searched for a way out']
	},
	underpants: { next: ['vacuum', 'window'],
		label: ['underpants', 'recognition', 'one day they said enough', 'they emerged from darkness', 'and nothing could stop them']
	},
	vacuum: { next: ['serpent', 'shirt'],
		label: ['vacuum', 'reversal', 'the deception was right in front of them', 'they chose not to see it', 'until it was too late']
	},
	valley: { next: ['rubric', 'window'],
		label: ['valley', 'obstacles', 'the depression was deep and long', 'their love was a crime', 'they walked slowly toward exile']
	},
	worm: { next: ['tofu', 'door'],
		label: ['worm', 'turning point', 'they would not give up on their love', 'the world tried to keep them apart', 'but it could not']
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

			ui.onClick = function(x, y) {

				if (!clickOne.clickedOnce) clickOne.clickedOnce = true;
				ui.animation.cancelOverride();

				if (data[ui.item]) {
					newScene(...data[ui.item].next);
					data[ui.item].index++;
				}
				// simulate mouse move for changing scene ...
				gme.scenes.current.mouseMoved(x, y);
			};
		});
	}
}

gme.start = function() {

	clearInterval(loadingInterval);
	document.getElementById('splash').remove();
	if (isMobile && window.innerWidth < 640) {
		let w = window.innerWidth / 2,
		 	h = window.innerHeight / 2;
		let o = 24;

		let win = new Sprite(w + o, h + o + 10, gme.anims.items.window);
		gme.scenes.mobile.addToDisplay(win);

		let door = new Sprite(w - o, h - o + 10, gme.anims.items.door);
		// gme.scenes.mobile.addToDisplay(door);

		[win, door].forEach(s => {
			s.center = true;
			gme.scenes.mobile.addToDisplay(s);
			s.animation.play();
			s.animation.overrideProperty('wiggleRange', 2);
			s.animation.overrideProperty('wiggleSpeed', 1);

			let speed = [0.05, 0.005];
			let max = [20, 20];
			s.animation.onUpdate = function() {
				if (s.animation.override.wiggleRange < max[0]) {
					s.animation.override.wiggleRange += speed[0];
				}
				if (s.animation.override.wiggleSpeed < max[1]) {
					s.animation.override.wiggleSpeed += speed[1];
				}
			};
		})

		let m = 'window door should be played on a computer';
		let label = new Text(32, 0, m, 12, gme.anims.ui.alphabet, alphaString);
		gme.scenes.mobile.addToDisplay(label);

		gme.draw = function() {
			gme.scenes.current.display();
		};

		gme.scenes.current = 'mobile';
		return;
	}
	
	
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
