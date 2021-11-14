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
        };
        this.buttons.next.addEventListener("click", () => this.swapCards("right"));
        this.buttons.prev.addEventListener("click", () => this.swapCards("left"));

        this.cardsContainerEl = document.querySelector(".cards__wrapper");

        this.buildSlidesHtml(this.slides);
        this.waitForImages();
    }

    buildSlidesHtml(slides) {

        const carousel = document.querySelector('.cards__wrapper');
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


            divCardImage.append(img);
            divCard.append(divCardImage);
            carousel.append(divCard);
        });
    }

    swapCards(direction) {
        let currentCardEl = this.cardsContainerEl.querySelector(".current--card");
        let previousCardEl = this.cardsContainerEl.querySelector(".previous--card");
        let previousPreviousCardEl = this.cardsContainerEl.querySelector(".previous-previous--card");
        let nextCardEl = this.cardsContainerEl.querySelector(".next--card");
        let nextNextCardEl = this.cardsContainerEl.querySelector(".next-next--card");
        let context = this;
        swapCardsClass();

        function swapCardsClass() {
            currentCardEl.classList.remove("current--card");
            previousCardEl && previousCardEl.classList.remove("previous--card");
            nextCardEl && nextCardEl.classList.remove("next--card");
            previousPreviousCardEl && previousPreviousCardEl.classList.remove("previous-previous--card");
            nextNextCardEl.classList.remove("next-next--card");


            currentCardEl.style.zIndex = "50";

            if (direction === "right") {
                context.currentIndex = (context.currentIndex + 1) % context.slides.length;
                previousCardEl.style.zIndex = "20";
                nextCardEl.style.zIndex = "30";
                currentCardEl.classList.add("previous--card");
                previousCardEl.classList.add("previous-previous--card");
                nextCardEl.classList.add("current--card");
                nextNextCardEl.classList.add("next--card");
                previousPreviousCardEl.classList.add("hidden--card");
                //loop through all.At the end just to start
                const newPreviousPreviousCardEl = document.getElementById(
                    `card-${(context.currentIndex + 2) % context.slides.length || context.currentIndex + 2}`)
                newPreviousPreviousCardEl.classList.remove("hidden--card");
                newPreviousPreviousCardEl.classList.add("next-next--card");
            } else if (direction === "left") {
                context.currentIndex = (context.currentIndex - 1 + context.slides.length) % context.slides.length;

                if (previousCardEl) {
                    previousCardEl.style.zIndex = "30";
                }
                if (nextCardEl) {
                    nextCardEl.style.zIndex = "20";
                }

                currentCardEl.classList.add("next--card");
                previousCardEl.classList.add("current--card");
                nextCardEl.classList.add("next-next--card");
                previousPreviousCardEl.classList.add("previous--card");
                nextNextCardEl.classList.add("hidden--card");
                //loop through all.At the end just to start
                const newPreviousPreviousCardEl = document.getElementById(
                    `card-${(context.currentIndex - 2 + context.slides.length) % context.slides.length || context.slides.length}`)
                newPreviousPreviousCardEl.classList.remove("hidden--card");
                newPreviousPreviousCardEl.classList.add("previous-previous--card");
            }
        }
    }

    init() {
        let tl = gsap.timeline();

        tl.to(this.cardsContainerEl.children, {
            delay: 0.15,
            duration: 0.5,
            stagger: {
                ease: "power4.inOut",
                from: "right",
                amount: 0.1,
            },
            "--card-translateY-offset": "0%",
        })
            /*        .to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
                        delay: 0.5,
                        duration: 0.4,
                        stagger: 0.1,
                        opacity: 1,
                        translateY: 0,
                    })*/
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
        const images = [...document.querySelectorAll("img")];
        const totalImages = images.length;
        let loadedImages = 0;
        const loaderEl = document.querySelector(".loader span");
        gsap.set(this.cardsContainerEl.children, {
            "--card-translateY-offset": "100vh",
        });

        gsap.set([this.buttons.prev, this.buttons.next], {
            pointerEvents: "none",
            opacity: "0",
        });

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
