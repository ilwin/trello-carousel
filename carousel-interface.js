export const carouselInitInterface = (props) => {

        let content =
        '    <div class="cardList">\n' +
        '        <div class="cards__wrapper"></div>\n' +
        '\n' +
        '        <button class="cardList__btn btn btn--left">\n' +
        '            <div class="icon">\n' +
        '                <svg>\n' +
        '                    <use xlink:href="#arrow-left"></use>\n' +
        '                </svg>\n' +
        '            </div>\n' +
        '        </button>\n' +
        '        <div class="cardList__customControls">\n';

        content +=
            props.showAutoPlay ?
        '            <div class="cardList__customControls__autoplay">\n' +
        '                <input id="autoplay-checkbox" type="checkbox" />\n' +
        '                <label for="autoplay-checkbox">Autoplay</label>\n' +
        '                <input id="autoscroll-duration" type="text" />\n' +
        '                <span>sec</span>\n' +
        '            </div>\n'
            : '' ;

        content +=
            props.showGoto ?
        '            <div class="cardList__customControls__goto">\n' +
        '                <label for="goto">Jump to #</label>\n' +
        '                <input id="goto" type="text" />\n' +
        '            </div>\n'
        : '';

        content +=
        '        </div>\n' +
        '        <button class="cardList__btn btn btn--right">\n' +
        '            <div class="icon">\n' +
        '                <svg>\n' +
        '                    <use xlink:href="#arrow-right"></use>\n' +
        '                </svg>\n' +
        '            </div>\n' +
        '        </button>\n' +
        '\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="loading__wrapper">\n' +
        '        <div class="loader--text">Loading...</div>\n' +
        '        <div class="loader">\n' +
        '            <span></span>\n' +
        '        </div>\n' +
        '    </div>' +
        '<svg class="icons" style="display: none;">\n' +
        '    <symbol id="arrow-left" xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'>\n' +
        '        <polyline points=\'328 112 184 256 328 400\'\n' +
        '                  style=\'fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px\' />\n' +
        '    </symbol>\n' +
        '    <symbol id="arrow-left-fast" xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'>\n' +
        '        <polyline points=\'328 112 184 256 328 400\'\n' +
        '                  style=\'fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px\' />\n' +
        '        <polyline points=\'184 112 50 256 184 400\'\n' +
        '                  style=\'fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px\' />\n' +
        '    </symbol>\n' +
        '    <symbol id="arrow-right" xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'>\n' +
        '        <polyline points=\'184 112 328 256 184 400\'\n' +
        '                  style=\'fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px\' />\n' +
        '    </symbol>\n' +
        '    <symbol id="arrow-right-fast" xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'>\n' +
        '        <polyline points=\'184 112 328 256 184 400\'\n' +
        '                  style=\'fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px\' />\n' +
        '        <polyline points=\'328 112 480 256 328 400\'\n' +
        '                  style=\'fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px\' />\n' +
        '    </symbol>\n' +
        '</svg>';

    document.getElementById(props.containerId).innerHTML = content;
}