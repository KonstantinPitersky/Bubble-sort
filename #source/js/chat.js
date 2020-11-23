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