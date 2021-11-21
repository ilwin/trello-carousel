import {buildSlidesHtmlInitial} from "./carousel-build-html.js";
import {carouselInitInterface} from "./carousel-interface.js";
import {setEventListeners} from "./carousel-event-listeners.js";
import {setClassesByCurrentIndex} from "./setClassesByCurrentIndex.js";

const { gsap, imagesLoaded } = window;

class Carousel {
    constructor(props) {
        if(props.hasOwnProperty("slides")){
            this.slides = props.slides;
        } else {
            console.log("There is no correct slides data");
            return;
        }

        this.props = props;

        this.cardIdPrefix = 'card-';

        this.currentCardClass = "current--card"
        this.previousCardClass = "previous--card"
        this.previousPreviousCardClass = "previous-previous--card"
        this.nextCardClass = "next--card"
        this.nextNextCardClass = "next-next--card"
        this.hiddenCardClass = "hidden--card"

        this.currentIndex = 1;
        this.isAutoScrollEnabled = props.autoPlayEnabled;
        this.autoScrollInterval = 1000;
        this.autoScrollIntervalID = null;
        this.autoScrollDurationSeconds = 5;
        this.nextSlideScrollDurarion = 300;

        this.carouselInitInterface(props);

        this.setEventListeners(this);

        this.cardsContainerEl = document.querySelector(".cards__wrapper");
        this.buildSlidesHtmlInitial = buildSlidesHtmlInitial.bind(this);
        this.buildSlidesHtmlInitial();
        this.waitForImages();
        this.autoScroll();
    }

    autoScroll(shiftSlidesCount = 1) {
        if(this.isAutoScrollEnabled) {
            if(this.props.showAutoPlay) {
                this.buttons.autoplay.checked = true;
            }
            this.autoScrollIntervalID = setInterval(() => this.swapCards(shiftSlidesCount), this.autoScrollInterval);
            setTimeout(() => this.cancelAutoscroll(), this.autoScrollDurationSeconds * 1000)
        }
    }

        cancelAutoscroll() {
        this.isAutoScrollEnabled = false;
        this.autoScrollIntervalID && clearInterval(this.autoScrollIntervalID);
        this.autoScrollIntervalID = null;
        if(this.props.showAutoPlay) {
            this.buttons.autoplay.checked = false;
        }
    }

    gotoSlide(id) {
        this.currentIndex = id;
        this.removeClassesFromActiveSlides();
        this.setClassesByCurrentIndex(this);
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
        let tmp = document.getElementById(this.getCurrentCardIdString());
            tmp.classList.remove(this.currentCardClass);
            tmp.classList.add(this.hiddenCardClass);

        tmp = document.getElementById(this.getPreviousCardIDString());
            tmp.classList.remove(this.previousCardClass);
            tmp.classList.add(this.hiddenCardClass);

        tmp = document.getElementById(this.getPreviousPreviousCardIDString());
            tmp.classList.remove(this.previousPreviousCardClass);
            tmp.classList.add(this.hiddenCardClass);

        tmp = document.getElementById(this.getNextCardIDString());
            tmp.classList.remove(this.nextCardClass);
            tmp.classList.add(this.hiddenCardClass);

        tmp = document.getElementById(this.getNextNextCardIDString());
            tmp.classList.remove(this.nextNextCardClass);
            tmp.classList.add(this.hiddenCardClass);
    }

    swapCards(shiftSlidesCount=1, scrollSpeed=this.autoScrollInterval) {
        const shiftSlidesCountAbs = Math.abs(shiftSlidesCount);

        for(let i = 0; i < shiftSlidesCountAbs; i++) {
            ((i)=>setTimeout(() => this.swapCardsClass(Math.sign(shiftSlidesCount))
                ,scrollSpeed * i)
            )(i);
        }
    }

    getSlideIndexByDelta(delta) {
        return       % this.slides.length || this.slides.length;
    }



    swapCardsClass(shiftSlidesCount) {
        this.removeClassesFromActiveSlides();
        // this.currentCardEl.style.zIndex = "50";
        this.currentIndex = this.getSlideIndexByDelta(shiftSlidesCount);
        this.setClassesByCurrentIndex(this);
    }

    getCardIdString(id) {
        return this.cardIdPrefix + id;
    }

    getCurrentCardIdString() {
        return this.getCardIdString(this.currentIndex);
    }

    getPreviousCardIDString() {
        return this.getCardIdString(this.getSlideIndexByDelta(-1));
    }

    getPreviousPreviousCardIDString() {
        return this.getCardIdString(this.getSlideIndexByDelta(-2));
    }

    getNextCardIDString() {
        return this.getCardIdString(this.getSlideIndexByDelta(1));
    }

    getNextNextCardIDString() {
        return this.getCardIdString(this.getSlideIndexByDelta(2));
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

    // buildSlidesHtmlInitial = buildSlidesHtmlInitial.bind(this)
}

// Carousel.prototype.buildSlidesHtmlInitial = buildSlidesHtmlInitial;
Carousel.prototype.carouselInitInterface = carouselInitInterface;
Carousel.prototype.setEventListeners = setEventListeners;
Carousel.prototype.setClassesByCurrentIndex = setClassesByCurrentIndex;

export default Carousel;