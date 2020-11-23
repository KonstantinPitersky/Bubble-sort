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