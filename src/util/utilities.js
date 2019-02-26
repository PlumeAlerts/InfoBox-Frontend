const rgbHex = require('rgb-hex');

function rgbaToHex(rgba) {
    return "#" + rgbHex(rgba.r, rgba.g, rgba.b, rgba.a)
}

const defaultAnnotation = {
    id: 0,
    text: "Example text",
    textSize: 4,
    url: "https://example.com",
    icon: "500px",
    iconColor: "#FFF",
    textColor: "#FFF",
    backgroundColor: "#000",
    intervals: 15
};

export {rgbaToHex, defaultAnnotation}