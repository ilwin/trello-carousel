import {top_250_movies} from "./top_250_movies.mjs";
// console.clear();

const { gsap, imagesLoaded } = window;

class Carousel {
    constructor(options) {
        let hasCorrectSlides = false;
        if (!options.hasOwnProperty("slides")) {
            console.error("{slides: [{image: ...}, {image:...}] " +
                "must be set and should be an array of objects with at least one property - 'image' - in every object");
            console.info("Was received:", options)
        } else if (!Array.isArray(options.slides)) {
            console.error("{slides: ...} property must be Array")
        } else if (options.slides.length === 0) {
            console.error("The 'slides' object is empty")
        } else {
            let isCorrectCounter = 0;
            options.slides.forEach((slide) => {
                if (slide.hasOwnProperty('image')) {
                    isCorrectCounter += 1;
                }
            })
            if (isCorrectCounter === options.slides.length) {
                hasCorrectSlides = true;
                this.slides = options.slides;

            } else {
                console.error("Check that every object has property 'image'");
            }
        }
        if (!hasCorrectSlides) {
            return;
        }

        //The initial slides data is correct
        this.currentIndex = 1;
        this.buttons = {
            prev: document.querySelector(".btn--left"),
            next: document.querySelector(".btn--right"),
            prevFast: document.querySelector(".btn--left-fast"),
            nextFast: document.querySelector(".btn--right-fast"),
        };

        this.autoScrollFlag = false;
        this.autoScrollInterval = 3000;
        this.autoScrollIntervalFunc = null;
        this.slowScrolling = 300;
        this.fastScrolling = 100;

        this.buttons.next.addEventListener("click", () => this.swapCards(1, this.slowScrolling));
        this.buttons.prev.addEventListener("click", () => this.swapCards(-1, this.slowScrolling));
        this.buttons.nextFast.addEventListener("click", () => this.swapCards(5, this.fastScrolling));
        this.buttons.prevFast.addEventListener("click", () => this.swapCards(-5, this.fastScrolling));

        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        this.cardsContainerEl = document.querySelector(".cards__wrapper");

        this.buildSlidesHtml(this.slides);
        this.waitForImages();

        if(this.autoScrollFlag) {
            this.autoScroll();
        }

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

    onKeyDown(e) {
        switch(e.code){
            case "ArrowLeft":
            this.swapCards(1, this.slowScrolling);
            case "ArrowRight":
            this.swapCards(-1, this.slowScrolling);
        }
    }

    autoScroll(shiftSlidesCount = 1) {
        this.autoScrollIntervalFunc = setInterval(() => this.swapCards(shiftSlidesCount), this.autoScrollInterval);
    }

    cancelAutoscroll() {
        if(this.autoScrollIntervalFunc) {
            clearInterval(this.autoScrollIntervalFunc);
            this.autoScrollIntervalFunc = null;
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

    swapCards(shiftSlidesCount, scrollSpeed) {
        this.cancelAutoscroll();
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

new Carousel({slides: top_250_movies});
