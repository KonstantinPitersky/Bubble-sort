
class Chat {

	constructor(options) {
		this.name = options.name;									//имя чата
		this.num = 0;												//каунтер для вывода сообщений
		this.node = document.querySelector(options.node);			//нода чата в DOM
		this.textNode = document.querySelector(options.textNode);	//текстовая нода чата в DOM
	}

	say(phrases) {
		this.textNode.textContent = phrases[this.num].text;
	}

	hideAllForms() {
		for (let child of this.node.children) {
			if (child.classList.contains('text')) {
				continue;
			}
			child.classList.add('hide');
		}
	}

	//создаем массив автоматически и передаём главному пузырю
	autoArray(bubble) {
		let value = this.node.children[3].querySelector('input').value;
		if (Number.isInteger(+value) && value > 1 && value <= 100) {
			for (let i = 0; i < +value; i++) {
				bubble.array.push(Math.floor(Math.random()*1001));
			}
			this.num = 6;
		} else {
			this.num = 4;
		}
	}

	//принимаем введенный вручную массив и передаём главному пузырю
	manuallyArray(bubble) {
		bubble.array = this.node.children[2].querySelector('input').value
			.split(',')
			.map(item => Number(item));
		for (let num of bubble.array) {
			if (isNaN(num) || bubble.array.length < 2 || bubble.array.length >= 100) {
				this.num = 2;
				return;
			}
		}
		this.num = 6;
	}
}
class MainBubble {

	constructor(options) {
		this.name = options.name;									//имя пузырька
		this.node = document.querySelector(options.node);			//элемент в DOM
		this.array = [];											//массив значений, созданный на основе данных полученных от пользователя
	}

	changeEmotion(num,phrases) {
		this.node.children[0].src = `img/${phrases[num].emotion}.png`;
	}

	createArray() {
		for (let i = 0; i < this.array.length; i++) {
			let bubble = new Bubble(`bubble${i}`, this.array[i]);

			this._visualizeBubble(bubble);

			bubbles.push(bubble);
		}
	}

	_visualizeBubble(bubble) {
		let bubleContainer = document.createElement('div');
		let img = document.createElement('img');
		let text = document.createElement('div');
		
		document.querySelector('.container-array').append(bubleContainer);
		bubleContainer.append(bubble.node);
		bubble.node.append(img);
		bubble.node.append(text);

		bubleContainer.classList.add('bubbles-array');
		bubble.node.classList.add('bubbles-array__body');

		img.src = "img/bubble.png";
		img.classList.add("bubbles-array__image");
		img.alt = 'Пузырик лопнул :(';

		text.classList.add('bubbles-array__text');
		text.textContent = bubble.value;
	}

	sortArray() {
		for (let i = 0; i < bubbles.length - 1; i++) {
			for (let j = 0; j < bubbles.length - 1 - i; j++) {
				if (bubbles[j].value > bubbles[j+1].value) {
					this._addToAnimationQueue(bubbles[j], bubbles[j+1]);
					[bubbles[j].value, bubbles[j+1].value] = [bubbles[j+1].value, bubbles[j].value];
				}
			}
		}
	}

	//добавляем в очередь пузыри, которые в последствии будут меняться местами с заданной анимацией
	_addToAnimationQueue(firstBubble, secondBubble) {
		animationQueue.push([firstBubble.node,secondBubble.node]);
	}

	animateArray(scene) {

		if (animationQueue.length === 0) {
			scene.showScroll();
			return;
		}

		scene.scrollToBubble();

		setTimeout(() => {
			animationQueue[0][0].classList.add('animate-first-bubble');
			animationQueue[0][1].classList.add('animate-second-bubble');
			setTimeout(() => {
				let x = animationQueue[0][1].lastChild.textContent;
				animationQueue[0][1].lastChild.textContent = animationQueue[0][0].lastChild.textContent;
				setTimeout(() => {
					animationQueue[0][1].classList.add('hide-under');
					animationQueue[0][0].lastChild.textContent = x;
					setTimeout(() => {
						animationQueue[0][0].classList.remove('animate-first-bubble');
						animationQueue[0][1].classList.remove('animate-second-bubble');
						animationQueue[0][1].classList.remove('hide-under');
						animationQueue.splice(0, 1);
						this.animateArray(scene);
					},1050)
				}, 150)
			}, 900)
		}, 500)
	}
}
class Bubble {
	constructor(name, value) {
		this.name = name;
		this.value = value;
		this.node = document.createElement('div');
	}
}
class Scene {
	constructor(name, bg, overlay) {
		this.name = name;
		this.bg = bg;
		this.overlay = overlay;
	}

	createLiveBG() {
		for (let i = 1; i <= 11; i++) {
			let bgBubble = document.createElement('div');
			bgBubble.classList.add(`bg__bubble${i}`, `bubbles`);
			this.bg.append(bgBubble);
		}
	}

	overlayHideArray() {
		this.overlay.classList.add('overlay-array-only');
	}

	overlayShowArray()  {
		document.querySelector('.container-title').classList.add('hide');
		this.overlay.classList.add('hide');
	}

	showScroll() {
		document.body.classList.remove('hide-overflow');
	}

	scrollToBubble() {
		window.scrollTo({
				top: animationQueue[0][0].offsetTop - document.documentElement.clientHeight/2,
				behavior: "smooth"
		});
	}
}
'use strict'

function basic() {
	document.removeEventListener('click', phrases[titleChat.num].handler);
	titleChat.hideAllForms();
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	if (phrases[titleChat.num].action) {
		titleChat.node.children[phrases[titleChat.num].action].classList.remove('hide');
		return;
	}
	titleChat.num++;
	document.addEventListener('click', phrases[titleChat.num].handler);
}

function auto() {
	titleChat.hideAllForms();
	titleChat.num = 5;
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	document.addEventListener('click', phrases[titleChat.num].handler);
}

function manually() {
	titleChat.hideAllForms();
	titleChat.num = 3;
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	document.addEventListener('click', phrases[titleChat.num].handler);
}

function arrayByUser() {
	titleChat.hideAllForms();
	titleChat.manuallyArray(titleBubble);
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	document.addEventListener('click', phrases[titleChat.num].handler);
}

function arrayByScript() {
	titleChat.hideAllForms();
	titleChat.autoArray(titleBubble);
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	document.addEventListener('click', phrases[titleChat.num].handler);
}

function startArrayForm() {
	document.removeEventListener('click', phrases[titleChat.num].handler);
	setTimeout(() => {
		titleBubble.createArray();
		titleBubble.sortArray();
		titleChat.say(phrases);
		titleBubble.changeEmotion(titleChat.num, phrases);
		document.addEventListener('click', phrases[titleChat.num].handler);
	}, 1000);
	titleChat.num++;
}

function showArray() {
	document.removeEventListener('click', phrases[titleChat.num].handler);
	titleBubble.animateArray(scene);
	scene.overlayShowArray();
	document.querySelector('.reset').classList.remove('hide');
}

const scene = new Scene('scene', document.querySelector('.bg'), document.querySelector('.overlay'))		//фон, оверлей и управление сценой
const titleBubble = new MainBubble({name:'titleBubble', node: '.bubble__body'});						//главный титульный пузырек
const titleChat = new Chat({name:'titleChat', node:'.chat-box__body', textNode: '.chat-box__text'});	//диалоговое окно главного пузырька
const bubbles = [];																						//массив для формирования пузырей
const animationQueue = [];																				//массив очереди смены пузырей для анимации

//массив [фраза, эмоция, флаг наличия определенной кнопки по номеру ноды в html, обработчик на страницу]
const phrases = [
	{text: 'Привет! Добро пожаловать в пузырьковую сортировку', emotion: 'hi', action: null, handler: basic},
	{text: 'Желаете сгенерировать числа автоматически или ввести вручную?', emotion: 'question', action: 1, handler: basic},
	{text: 'Вы точно правильно ввели массив? Попробуйте снова!', emotion: 'question', action: null, handler: basic},
	{text: 'Введите от 2 до 100 чисел. Например: 1, 3.44, 5, -10', emotion: 'hi', action: 2, handler: basic},
	{text: 'Вы точно ввели целое число от 2 до 100? Попробуйте снова!', emotion: 'question', action: null, handler: basic},
	{text: 'Сколько значений сгенерировать? (Целое число от 2 до 100)', emotion: 'question', action: 3, handler: basic},
	{text: 'Идёт загрузка пузырьков...', emotion: 'meditation', action: null, handler: startArrayForm},
	{text: 'Готово! Идем смотреть!', emotion: 'joy', action: null, handler: showArray}
];

scene.createLiveBG();
scene.overlayHideArray();
document.body.classList.add('hide-overflow');

document.querySelector('.chat-box__auto').addEventListener('click', auto);
document.querySelector('.chat-box__manually').addEventListener('click', manually);
document.querySelector('.chat-box__array-submit').addEventListener('click', arrayByUser);
document.querySelector('.chat-box__amount-submit').addEventListener('click', arrayByScript);

//выводим первое сообщение
setTimeout(() => {
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	titleChat.num++;
	setTimeout(() => {
		document.addEventListener('click', phrases[titleChat.num].handler);
	}, 1000)
}, 2000)