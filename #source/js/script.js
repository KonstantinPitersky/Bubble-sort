'use strict'

class Chat {

	constructor(name) {
		this.name = name;					//имя чата
		this.num = 0;						//каунтер для вывода сообщений
		this.arrPhrases = [];				//массив чата с [[сообщениями][флажками для появления формы к сообщению]]
	}

	//изменяем сообщение в чате
	say() {
		this.textNode.textContent = this.arrPhrases[this.num][0];
	}

	//добавляем фразу и флажок формы из массива фраз в массив фраз чата
	addPhrases(items) {
		for (let item of items) {
			this.arrPhrases.push([item[0], item[2]]);
		}
	}

	//прячем все формы для кнопок
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
			titleChat.num = 6;
		} else {
			titleChat.num = 4;
		}
	}

	//принимаем введенный вручную массив и передаём главному пузырю
	manuallyArray(bubble) {
		bubble.array = this.node.children[2].querySelector('input').value
			.split(',')
			.map(item => Number(item));
		for (let num of bubble.array) {
			if (isNaN(num) || bubble.array.length < 2 || bubble.array.length >= 100) {
				titleChat.num = 2;
				return;
			} else {
				titleChat.num = 6;
				break;
			}
		}
	}
}

class MainBubble {

	constructor(name) {
		this.name = name;					//имя пузырька
		this.arrEmotions = [];				//массив эмоций пузырька
		this.array = [];					//массив значений, созданный на основе данных полученных от пользователя
	}

	//добавляем эмоции из массива фраз в массив эмоций главного пузырька
	addEmotions(items) {
		for (let item of items) {
			this.arrEmotions.push([item[1]]);
		}
	}

	//меняем эмоцию главного пузырька
	changeEmotion(num) {
		this.node.children[0].src = `img/${this.arrEmotions[num]}.png`;
	}

	//создаем массив пузырей на основе полученных от пользователя данных
	createArray() {
		for (let i = 0; i < this.array.length; i++) {

			let bubble = new Bubble(`bubble${i}`, this.array[i]);

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

			bubbles.push(bubble);
		}
	}

	//сортируем массив значений и запоминаем смену пузырей для анимации
	sortArray() {
		for (let i = 0; i < bubbles.length - 1; i++) {
			for (let j = 0; j < bubbles.length - 1 - i; j++) {
				if (bubbles[j].value > bubbles[j+1].value) {
					animationQueue.push([bubbles[j].node, bubbles[j+1].node]);
					[bubbles[j].value, bubbles[j+1].value] = [bubbles[j+1].value, bubbles[j].value];
				}
			}
		}
	}

	//анимируем пузыри
	animateArray() {
		if (animationQueue.length === 0) {
			document.body.classList.remove('hide-overflow');
			return;
		}
		window.scrollTo({
				top: animationQueue[0][0].offsetTop - document.documentElement.clientHeight/2,
				behavior: "smooth"
		});
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
						this.animateArray();
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

	//создаем всплывающие пузырьки в html
	create() {
		for (let i = 1; i <= 11; i++) {
			let bgBubble = document.createElement('div');
			bgBubble.classList.add(`bg__bubble${i}`, `bubbles`);
			this.bg.append(bgBubble);
		}
	}

	//прячем за оверлеем сцену с будущим массивом пузырей
	overlayHideArray() {
		this.overlay.classList.add('overlay-array-only');
	}

	//прячем контейнер главным пузырем, показываем массив пузырей
	overlayShowArray()  {
		document.querySelector('.container-title').classList.add('hide');
		this.overlay.classList.add('hide');
	}
}

function handler() {

	titleChat.hideAllForms();

	// на последнем сообщении формируем массив
	if (titleChat.num === titleChat.arrPhrases.length) {
		document.removeEventListener('click', handler);
		titleBubble.animateArray();
		scene.overlayShowArray();
		return;
	};

	if (event.target.id === "amount-button" ) {
		titleChat.autoArray(titleBubble);
	}
	if (event.target.id === "array-button") {
		titleChat.manuallyArray(titleBubble);
	}
	if (event.target.id === 'auto') {
		titleChat.num = 5;
	};
	if (event.target.id === 'manually') {
		titleChat.num = 3;
	};

	//на последних двух сообщениях все выборы сделаны, приступаем к формированию массива
	if ((titleChat.num + 2) === titleChat.arrPhrases.length) {
		document.removeEventListener('click', handler);
		titleChat.textNode.textContent = titleChat.arrPhrases[titleChat.num][0];
		titleBubble.changeEmotion(titleChat.num);
		setTimeout(() => {
			titleBubble.createArray();
			titleBubble.sortArray();
			titleChat.textNode.textContent = titleChat.arrPhrases[titleChat.num][0];
			titleBubble.changeEmotion(titleChat.num);
			titleChat.num++;
			document.addEventListener('click', handler);
		}, 2000);
	}
	titleChat.say(titleBubble);
	titleBubble.changeEmotion(titleChat.num);

	//выводим форму , если в массиве чата есть флажок с конкретной формой из HTML
	if (titleChat.arrPhrases[titleChat.num][1]) {
		titleChat.node.children[titleChat.arrPhrases[titleChat.num][1]].classList.remove('hide');
		return;
	}
	titleChat.num++;
}

const scene = new Scene('scene', document.querySelector('.bg'), document.querySelector('.overlay'))	//фон, оверлей и управление сценой
const titleBubble = new MainBubble('titleBubble');													//главный титульный пузырек
const titleChat = new Chat('titleChat');																//диалоговое окно главного пузырька
const bubbles = [];																					//массив для формирования пузырей
const animationQueue = [];																			//массив очереди смены пузырей для анимации
titleBubble.node = document.querySelector('.bubble__body');
titleChat.node = document.querySelector('.chat-box__body');
titleChat.textNode = document.querySelector('.chat-box__text');

//массив [фраза, эмоция, флаг наличия определенной кнопки по номеру ноды в html]
const phrases = [
	['Привет! Добро пожаловать в пузырьковую сортировку','hi', null],
	['Желаете сгенерировать числа автоматически или ввести вручную?','question', 1],
	['Вы точно правильно ввели массив? Попробуйте снова!','question', null],
	['Введите от 2 до 100 чисел. Например: 1, 3.44, 5, -10','hi', 2],
	['Вы точно ввели целое число от 2 до 100? Попробуйте снова!','question', null],
	['Сколько значений сгенерировать? (Целое число от 2 до 100)','question', 3],
	['Идёт загрузка пузырьков...','meditation', null],
	['Готово! Идем смотреть!','joy', null]
];

titleChat.addPhrases(phrases);
titleBubble.addEmotions(phrases);
scene.create();
scene.overlayHideArray();
document.body.classList.add('hide-overflow');

//выводим первое сообщение
setTimeout(() => {
	titleChat.say(titleBubble);
	titleBubble.changeEmotion(titleChat.num);
	titleChat.num++;
	setTimeout(() => {
		document.addEventListener('click', handler);
	}, 1000)
}, 2000)