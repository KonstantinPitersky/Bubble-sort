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