export const setEventListeners = (_this) => {
    _this.buttons = {
        prev: document.querySelector(".btn--left"),
        next: document.querySelector(".btn--right"),
        autoplay: document.querySelector('#autoplay-checkbox')
    };

    _this.inputs = {
        autoplayDuration: document.querySelector("#autoscroll-duration"),
        goto: document.querySelector("#goto")
    }

    _this.buttons.next.addEventListener("click", () => {
        _this.cancelAutoscroll();
        _this.swapCards(1, _this.nextSlideScrollDurarion);
    });
    _this.buttons.prev.addEventListener("click", () => {
        _this.cancelAutoscroll();
        _this.swapCards(-1, _this.nextSlideScrollDurarion);
    });

    if(_this.props.showAutoPlay) {
        _this.buttons.autoplay.addEventListener("change", (event) => {
            if(event.target.checked) {
                _this.isAutoScrollEnabled = true;//Click on Manual scrolling cancels autoplay
                _this.autoScroll();
            } else {
                _this.isAutoScrollEnabled = false;
                _this.cancelAutoscroll();
            };
        });
        _this.buttons.autoplay.checked = false;
        _this.inputs.autoplayDuration.value = _this.autoScrollDurationSeconds;
        _this.inputs.autoplayDuration.addEventListener("change", (event) => {
            _this.autoScrollDuration = parseInt(event.target.value);
            event.target.value = parseInt(event.target.value);
            _this.cancelAutoscroll();
            _this.autoScrollFlag = true;
            _this.autoScroll();
        });
    }

    if(_this.props.showGoto) {
        _this.inputs.goto.addEventListener('change', (event) => {
            const goto = Math.abs(parseInt(event.target.value));
            const jumpSize = Math.abs(goto - _this.currentIndex);
            const direction = Math.sign(goto - _this.currentIndex);
            _this.cancelAutoscroll();
            _this.swapCards(direction * jumpSize, _this.gotoSlideTimeout);
        })
    }

    document.addEventListener('keydown', (event) => _this.onKeyDown(event));
}