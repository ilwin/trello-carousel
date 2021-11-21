export const setClassesByCurrentIndex = (_this) => {
    _this.removeClassesFromActiveSlides();
    let tmp = document.getElementById(_this.getCurrentCardIdString());
        tmp.classList.add(_this.currentCardClass);
        tmp.classList.remove(_this.hiddenCardClass);

    tmp = document.getElementById(_this.getPreviousCardIDString()).classList.add(_this.previousCardClass);
    document.getElementById(_this.getPreviousPreviousCardIDString()).classList.add(_this.previousPreviousCardClass);
    document.getElementById(_this.getNextCardIDString()).classList.add(_this.nextCardClass);
    document.getElementById(_this.getNextNextCardIDString()).classList.add(_this.nextNextCardClass);
}