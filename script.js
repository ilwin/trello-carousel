const { gsap, imagesLoaded } = window;

export class Carousel {
    constructor(options) {
        if(options.hasOwnProperty("slides")){
            this.slides = options.slides;
        }
        this.currentIndex = 1;
        this.buttons = {
            prev: document.querySelector(".btn--left"),
            next: document.querySelector(".btn--right"),
            autoplay: document.querySelector('#autoplay-checkbox')
        };

        this.inputs = {
            autoplayDuration: document.querySelector("#autoscroll-duration"),
            goto: document.querySelector("#goto")
        }

        this.isAutoScrollEnabled = false;
        this.autoScrollInterval = 1000;
        this.autoScrollIntervalID = null;
        this.autoScrollDurationSeconds = 5;
        this.nextSlideScrollDurarion = 300;
        this.gotoSlideTimeout = 0;

        this.buttons.next.addEventListener("click", () => {
            this.cancelAutoscroll();
            this.swapCards(1, this.nextSlideScrollDurarion);
        });
        this.buttons.prev.addEventListener("click", () => {
            this.cancelAutoscroll();
            this.swapCards(-1, this.nextSlideScrollDurarion);
        });

        this.buttons.autoplay.addEventListener("change", (event) => {
            if(event.target.checked) {
                this.isAutoScrollEnabled = true;//Click on Manual scrolling cancels autoplay
                this.autoScroll();
            } else {
                this.isAutoScrollEnabled = false;
                this.cancelAutoscroll();
            };
        })
        this.buttons.autoplay.checked = false;
        this.inputs.autoplayDuration.value = this.autoScrollDurationSeconds;
        this.inputs.autoplayDuration.addEventListener("change", (event) => {
            this.autoScrollDuration = parseInt(event.target.value);
            event.target.value = parseInt(event.target.value);
            this.cancelAutoscroll();
            this.autoScrollFlag = true;
            this.autoScroll();
        });
        this.inputs.goto.addEventListener('change', (event) => {
            const goto = Math.abs(parseInt(event.target.value));
            const jumpSize = Math.abs(goto - this.currentIndex);
            const direction = Math.sign(goto - this.currentIndex);
            this.cancelAutoscroll();
            this.swapCards(direction * jumpSize, this.gotoSlideTimeout);
        })

        document.addEventListener('keydown', (event) => this.onKeyDown(event));

        this.cardsContainerEl = document.querySelector(".cards__wrapper");

        this.buildSlidesHtml(this.slides);
        this.waitForImages();
        this.autoScroll();
    }

    buildSlidesHtml(slides) {
        slides.map((slide, index) => {
            const divCard = document.createElement("div");
            const classById = {
                [slides.length - 1]: "previous-previous--card",
                [slides.length]: "previous--card",
                1: "current--card",
                2: "next--card",
                3: "next-next--card",
                "theRest": "hidden--card"
            }
            divCard.setAttribute("class", "card");
            divCard.setAttribute("id", `card-${index + 1}`);

            //Set classes for image wrapper
            if (classById.hasOwnProperty((index + 1).toString())) {
                divCard.classList.add(classById[index + 1]);
            } else {
                divCard.classList.add(classById["theRest"]);
            }

            const divCardImage = document.createElement("div");
            divCardImage.setAttribute("class", "card__image");

            const img = document.createElement("img");
            img.setAttribute("src", slide.image);
            img.setAttribute("alt", "");
            img.setAttribute("loading", "lazy");

            const info = document.createElement("div");
            info.setAttribute("class", "card__info");
            info.textContent = `#${index+1}`;

            divCardImage.append(img);
            divCard.append(divCardImage);
            divCard.append(info);
            this.cardsContainerEl.append(divCard);
        });
    }

    autoScroll(shiftSlidesCount = 1) {
        if(this.isAutoScrollEnabled) {
            this.buttons.autoplay.checked = true;
            this.autoScrollIntervalID = setInterval(() => this.swapCards(shiftSlidesCount), this.autoScrollInterval);
            setTimeout(() => this.cancelAutoscroll(), this.autoScrollDurationSeconds * 1000)
        }
    }

    cancelAutoscroll() {
        this.isAutoScrollEnabled = false;
        this.autoScrollIntervalID && clearInterval(this.autoScrollIntervalID);
        this.autoScrollIntervalID = null;
        this.buttons.autoplay.checked = false;
    }

    onKeyDown(event) {
        switch(event.code){
            case "ArrowLeft":
                this.swapCards(1, this.nextSlideScrollDurarion);
                break;
            case "ArrowRight":
                this.swapCards(-1, this.nextSlideScrollDurarion);
                break;
        }
    }

    selectCurrentlyActiveSlides() {
        this.currentCardEl = this.cardsContainerEl.querySelector(".current--card");
        this.previousCardEl = this.cardsContainerEl.querySelector(".previous--card");
        this.previousPreviousCardEl = this.cardsContainerEl.querySelector(".previous-previous--card");
        this.nextCardEl = this.cardsContainerEl.querySelector(".next--card");
        this.nextNextCardEl = this.cardsContainerEl.querySelector(".next-next--card");
    }

    removeClassesFromActiveSlides() {
        this.currentCardEl.classList.remove("current--card");
        this.previousCardEl.classList.remove("previous--card");
        this.nextCardEl.classList.remove("next--card");
        this.previousPreviousCardEl.classList.remove("previous-previous--card");
        this.nextNextCardEl.classList.remove("next-next--card");
    }

    swapCards(shiftSlidesCount=1, scrollSpeed=this.autoScrollInterval) {
        const shiftSlidesCountAbs = Math.abs(shiftSlidesCount);

        for(let i = 0; i < shiftSlidesCountAbs; i++) {
            ((i)=>setTimeout(() => this.swapCardsClass(Math.sign(shiftSlidesCount))
                ,scrollSpeed * i)
            )(i);
        }
    }

    swapCardsClass(shiftSlidesCount) {
        this.selectCurrentlyActiveSlides();
        this.removeClassesFromActiveSlides();
        this.currentCardEl.style.zIndex = "50";

        if (shiftSlidesCount === 1) {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.previousCardEl.style.zIndex = "20";
            this.nextCardEl.style.zIndex = "30";
            this.currentCardEl.classList.add("previous--card");
            this.previousCardEl.classList.add("previous-previous--card");
            this.nextCardEl.classList.add("current--card");
            this.nextNextCardEl.classList.add("next--card");
            this.previousPreviousCardEl.classList.add("hidden--card");
            //loop through all.At the end just to start
            const newPreviousPreviousCardEl = document.getElementById(
                `card-${(this.currentIndex + 2) % this.slides.length || this.currentIndex + 2}`)
            newPreviousPreviousCardEl.classList.remove("hidden--card");
            newPreviousPreviousCardEl.classList.add("next-next--card");
        } else if (shiftSlidesCount === -1) {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;

            if (this.previousCardEl) {
                this.previousCardEl.style.zIndex = "30";
            }
            if (this.nextCardEl) {
                this.nextCardEl.style.zIndex = "20";
            }

            this.currentCardEl.classList.add("next--card");
            this.previousCardEl.classList.add("current--card");
            this.nextCardEl.classList.add("next-next--card");
            this.previousPreviousCardEl.classList.add("previous--card");
            this.nextNextCardEl.classList.add("hidden--card");
            //loop through all.At the end just to start
            const newPreviousPreviousCardEl = document.getElementById(
                `card-${(this.currentIndex - 2 + this.slides.length) % this.slides.length || this.slides.length}`)
            newPreviousPreviousCardEl.classList.remove("hidden--card");
            newPreviousPreviousCardEl.classList.add("previous-previous--card");
        }
    }

    init() {
        let tl = gsap.timeline();

        tl
            .to(this.cardsContainerEl.children, {
            delay: 0,
            duration: 0,
            stagger: {
                ease: "power4.inOut",
                from: "left",
                amount: 0.1,
            },
            "--card-translateY-offset": "50%",
        })
            .to(
                [this.buttons.prev, this.buttons.next],
                {
                    duration: 0.4,
                    opacity: 1,
                    pointerEvents: "all",
                },
                "-=0.4"
            );
    }

    waitForImages = () => {
        const images = [...document.querySelectorAll("div.card:not(.hidden--card)")];
        const totalImages = images.length;
        let loadedImages = 0;
        const loaderEl = document.querySelector(".loader span");

        images.forEach((image) => {
            imagesLoaded(image, (instance) => {
                if (instance.isComplete) {
                    loadedImages++;
                    let loadProgress = loadedImages / totalImages;

                    gsap.to(loaderEl, {
                        duration: 1,
                        scaleX: loadProgress,
                        backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
                    });

                    if (totalImages === loadedImages) {
                        gsap.timeline()
                            .to(".loading__wrapper", {
                                duration: 0.8,
                                opacity: 0,
                                pointerEvents: "none",
                            })
                            .call(() => this.init());
                    }
                }
            });
        });
    };


}
