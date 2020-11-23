'use strict'

function handler() {

	titleChat.hideAllForms();

	// на последнем сообщении формируем массив
	if (titleChat.num === phrases.length) {
		document.removeEventListener('click', handler);
		titleBubble.animateArray(scene);
		scene.overlayShowArray();
		document.querySelector('.reset').classList.remove('hide');
		return;
	};

	//на последних двух сообщениях все выборы сделаны, приступаем к формированию массива
	if ((titleChat.num + 2) === phrases.length) {
		document.removeEventListener('click', handler);
		titleChat.textNode.textContent = phrases[titleChat.num].text;
		titleBubble.changeEmotion(titleChat.num, phrases);
		setTimeout(() => {
			titleBubble.createArray();
			titleBubble.sortArray();
			titleChat.textNode.textContent = phrases[titleChat.num].text;
			titleBubble.changeEmotion(titleChat.num, phrases);
			titleChat.num++;
			document.addEventListener('click', handler);
		}, 2000);
	}
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);

	//выводим форму , если в массиве чата есть флажок с конкретной формой из DOM
	if (phrases[titleChat.num].action) {
		titleChat.node.children[phrases[titleChat.num].action].classList.remove('hide');
		return;
	}
	titleChat.num++;
}

const scene = new Scene('scene', document.querySelector('.bg'), document.querySelector('.overlay'))		//фон, оверлей и управление сценой
const titleBubble = new MainBubble({name:'titleBubble', node: '.bubble__body'});						//главный титульный пузырек
const titleChat = new Chat({name:'titleChat', node:'.chat-box__body', textNode: '.chat-box__text'});	//диалоговое окно главного пузырька
const bubbles = [];																						//массив для формирования пузырей
const animationQueue = [];																				//массив очереди смены пузырей для анимации

//массив [фраза, эмоция, флаг наличия определенной кнопки по номеру ноды в html]
const phrases = [
	{text: 'Привет! Добро пожаловать в пузырьковую сортировку', emotion: 'hi', action: null},
	{text: 'Желаете сгенерировать числа автоматически или ввести вручную?', emotion: 'question', action: 1},
	{text: 'Вы точно правильно ввели массив? Попробуйте снова!', emotion: 'question', action: null},
	{text: 'Введите от 2 до 100 чисел. Например: 1, 3.44, 5, -10', emotion: 'hi', action: 2},
	{text: 'Вы точно ввели целое число от 2 до 100? Попробуйте снова!', emotion: 'question', action: null},
	{text: 'Сколько значений сгенерировать? (Целое число от 2 до 100)', emotion: 'question', action: 3},
	{text: 'Идёт загрузка пузырьков...', emotion: 'meditation', action: null},
	{text: 'Готово! Идем смотреть!', emotion: 'joy', action: null}
];

scene.createLiveBG();
scene.overlayHideArray();
document.body.classList.add('hide-overflow');

//выводим первое сообщение
setTimeout(() => {
	titleChat.say(phrases);
	titleBubble.changeEmotion(titleChat.num, phrases);
	titleChat.num++;
	setTimeout(() => {
		document.addEventListener('click', handler);
	}, 1000)
}, 2000)