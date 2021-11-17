export const setEventListeners = (context) => {
    context.buttons = {
        prev: document.querySelector(".btn--left"),
        next: document.querySelector(".btn--right"),
        autoplay: document.querySelector('#autoplay-checkbox')
    };

    context.inputs = {
        autoplayDuration: document.querySelector("#autoscroll-duration"),
        goto: document.querySelector("#goto")
    }

    context.buttons.next.addEventListener("click", () => {
        context.cancelAutoscroll();
        context.swapCards(1, context.nextSlideScrollDurarion);
    });
    context.buttons.prev.addEventListener("click", () => {
        context.cancelAutoscroll();
        context.swapCards(-1, context.nextSlideScrollDurarion);
    });

    context.buttons.autoplay.addEventListener("change", (event) => {
        if(event.target.checked) {
            context.isAutoScrollEnabled = true;//Click on Manual scrolling cancels autoplay
            context.autoScroll();
        } else {
            context.isAutoScrollEnabled = false;
            context.cancelAutoscroll();
        };
    })
    context.buttons.autoplay.checked = false;
    context.inputs.autoplayDuration.value = context.autoScrollDurationSeconds;
    context.inputs.autoplayDuration.addEventListener("change", (event) => {
        context.autoScrollDuration = parseInt(event.target.value);
        event.target.value = parseInt(event.target.value);
        context.cancelAutoscroll();
        context.autoScrollFlag = true;
        context.autoScroll();
    });
    context.inputs.goto.addEventListener('change', (event) => {
        const goto = Math.abs(parseInt(event.target.value));
        const jumpSize = Math.abs(goto - context.currentIndex);
        const direction = Math.sign(goto - context.currentIndex);
        context.cancelAutoscroll();
        context.swapCards(direction * jumpSize, context.gotoSlideTimeout);
    })

    document.addEventListener('keydown', (event) => context.onKeyDown(event));
}