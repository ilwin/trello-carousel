import {top_250_movies} from "./top_250_movies.mjs";

console.clear();
const slides = top_250_movies;
console.log(top_250_movies)

const { gsap, imagesLoaded } = window;

let currentIndex = 1;

const buttons = {
    prev: document.querySelector(".btn--left"),
    next: document.querySelector(".btn--right"),
};
const cardsContainerEl = document.querySelector(".cards__wrapper");
const appBgContainerEl = document.querySelector(".app__bg");

// const cardInfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapCards("right"));

buttons.prev.addEventListener("click", () => swapCards("left"));

function buildSlidesHtml (slides) {
    const carousel = document.querySelector('.cards__wrapper');

    slides.map((slide, index) => {
        const divCard = document.createElement("div");
        const classById = {
            [slides.length -1]: "previous-previous--card",
            [slides.length]:    "previous--card",
            1:                  "current--card",
            2:                  "next--card",
            3:                  "next-next--card",
            "theRest":          "hidden--card"
        }
        divCard.setAttribute("class", "card");
        divCard.setAttribute("id", `card-${index + 1}`);

        //Set classes for image wrapper
        if(classById.hasOwnProperty((index + 1).toString())) {
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
        carousel.append(divCard);//
    });
}

buildSlidesHtml(slides);
function swapCards(direction) {
    let currentCardEl = cardsContainerEl.querySelector(".current--card");
    let previousCardEl = cardsContainerEl.querySelector(".previous--card");
    let previousPreviousCardEl = cardsContainerEl.querySelector(".previous-previous--card");
    let nextCardEl = cardsContainerEl.querySelector(".next--card");
    let nextNextCardEl = cardsContainerEl.querySelector(".next-next--card");
    console.log("nextNextCardEl:", nextNextCardEl);

    // changeInfo(direction);
    swapCardsClass();

    removeCardEvents(currentCardEl);

    function swapCardsClass() {
        currentCardEl.classList.remove("current--card");
        previousCardEl && previousCardEl.classList.remove("previous--card");
        nextCardEl && nextCardEl.classList.remove("next--card");
        previousPreviousCardEl && previousPreviousCardEl.classList.remove("previous-previous--card");
        nextNextCardEl.classList.remove("next-next--card");


        currentCardEl.style.zIndex = "50";

        if (direction === "right") {
            currentIndex = (currentIndex + 1) % slides.length;
            previousCardEl.style.zIndex = "20";
            nextCardEl.style.zIndex = "30";
            // const
            currentCardEl.classList.add("previous--card");
            previousCardEl.classList.add("previous-previous--card");
            nextCardEl.classList.add("current--card");
            nextNextCardEl.classList.add("next--card");
            previousPreviousCardEl.classList.add("hidden--card");
            //loop through all.At the end just to start
            const newPreviousPreviousCardEl = document.getElementById(
                `card-${(currentIndex + 2) % slides.length || currentIndex + 2}`)
            newPreviousPreviousCardEl.classList.remove("hidden--card");
            newPreviousPreviousCardEl.classList.add("next-next--card");
        } else if (direction === "left") {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;

            if(previousCardEl) {
                previousCardEl.style.zIndex = "30";
            }
            if(nextCardEl){
                nextCardEl.style.zIndex = "20";
            }

            currentCardEl.classList.add("next--card");
            previousCardEl.classList.add("current--card");
            nextCardEl.classList.add("next-next--card");
            previousPreviousCardEl.classList.add("previous--card");
            nextNextCardEl.classList.add("hidden--card");
            //loop through all.At the end just to start
            const newPreviousPreviousCardEl = document.getElementById(
                `card-${(currentIndex - 2 + slides.length) % slides.length || slides.length}`)
            newPreviousPreviousCardEl.classList.remove("hidden--card");
            newPreviousPreviousCardEl.classList.add("previous-previous--card");
        }
    }
}

// function changeInfo(direction) {
//     let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
//     let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
//     let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");
//
//     gsap.timeline()
//         .to([buttons.prev, buttons.next], {
//             duration: 0.2,
//             opacity: 0.5,
//             pointerEvents: "none",
//         })
//         .to(
//             currentInfoEl.querySelectorAll(".text"),
//             {
//                 duration: 0.4,
//                 stagger: 0.1,
//                 translateY: "-120px",
//                 opacity: 0,
//             },
//             "-="
//         )
//         .call(() => {
//             swapInfosClass(direction);
//         })
//         .call(() => initCardEvents())
//         .fromTo(
//             direction === "right"
//                 ? nextInfoEl.querySelectorAll(".text")
//                 : previousInfoEl.querySelectorAll(".text"),
//             {
//                 opacity: 0,
//                 translateY: "40px",
//             },
//             {
//                 duration: 0.4,
//                 stagger: 0.1,
//                 translateY: "0px",
//                 opacity: 1,
//             }
//         )
//         .to([buttons.prev, buttons.next], {
//             duration: 0.2,
//             opacity: 1,
//             pointerEvents: "all",
//         });
//
//     function swapInfosClass() {
//         currentInfoEl.classList.remove("current--info");
//         previousInfoEl.classList.remove("previous--info");
//         nextInfoEl.classList.remove("next--info");
//
//         if (direction === "right") {
//             currentInfoEl.classList.add("previous--info");
//             nextInfoEl.classList.add("current--info");
//             previousInfoEl.classList.add("next--info");
//         } else if (direction === "left") {
//             currentInfoEl.classList.add("next--info");
//             nextInfoEl.classList.add("previous--info");
//             previousInfoEl.classList.add("current--info");
//         }
//     }
// }

function updateCard(e) {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const centerPosition = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
    };
    let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
    gsap.set(card, {
        "--current-card-rotation-offset": `${angle}deg`,
    });
    // const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
/*    gsap.set(currentInfoEl, {
        rotateY: `${angle}deg`,
    });*/
}

function resetCardTransforms(e) {
    const card = e.currentTarget;
    // const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
    gsap.set(card, {
        "--current-card-rotation-offset": 0,
    });
/*    gsap.set(currentInfoEl, {
        rotateY: 0,
    });*/
}

function initCardEvents() {
    const currentCardEl = cardsContainerEl.querySelector(".current--card");
    currentCardEl.addEventListener("pointermove", updateCard);
    currentCardEl.addEventListener("pointerout", (e) => {
        resetCardTransforms(e);
    });
}

// initCardEvents();

function removeCardEvents(card) {
    card.removeEventListener("pointermove", updateCard);
}

function init() {
    console.log("Init");
    let tl = gsap.timeline();

    tl.to(cardsContainerEl.children, {
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
            [buttons.prev, buttons.next],
            {
                duration: 0.4,
                opacity: 1,
                pointerEvents: "all",
            },
            "-=0.4"
        );
}

const waitForImages = () => {
    const images = [...document.querySelectorAll("img")];
    const totalImages = images.length;
    let loadedImages = 0;
    const loaderEl = document.querySelector(".loader span");
    console.log("waitForImages");
    gsap.set(cardsContainerEl.children, {
        "--card-translateY-offset": "100vh",
    });
/*    gsap.set(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
        translateY: "40px",
        opacity: 0,
    });*/
    gsap.set([buttons.prev, buttons.next], {
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

                if (totalImages == loadedImages) {
                    gsap.timeline()
                        .to(".loading__wrapper", {
                            duration: 0.8,
                            opacity: 0,
                            pointerEvents: "none",
                        })
                        .call(() => init());
                }
            }
        });
    });
};

waitForImages();

