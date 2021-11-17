export const buildSlidesHtml =  (slides) => {
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