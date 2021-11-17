import {buildSlidesHtml} from "./carousel-build-html.js";
import {carouselInitInterface} from "./carousel-interface.js";
import {setEventListeners} from "./carousel-event-listeners.js";
const { gsap, imagesLoaded } = window;

class Carousel {
    constructor(options) {
        if(options.hasOwnProperty("slides")){
            this.slides = options.slides;
        } else {
            console.log("There is no correct slides data");
            return;
        }

        this.currentIndex = 1;
        this.isAutoScrollEnabled = false;
        this.autoScrollInterval = 1000;
        this.autoScrollIntervalID = null;
        this.autoScrollDurationSeconds = 5;
        this.nextSlideScrollDurarion = 300;
        this.gotoSlideTimeout = 0;

        this.carouselInitInterface(options.containerId);

        this.setEventListeners(this);

        this.cardsContainerEl = document.querySelector(".cards__wrapper");
        this.buildSlidesHtml(this.slides);
        this.waitForImages();
        this.autoScroll();
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

Carousel.prototype.buildSlidesHtml = buildSlidesHtml;
Carousel.prototype.carouselInitInterface = carouselInitInterface;
Carousel.prototype.setEventListeners = setEventListeners;

export default Carousel;