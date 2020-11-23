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