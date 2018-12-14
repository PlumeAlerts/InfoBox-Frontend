const rgbHex = require('rgb-hex');

function rgbaToHex(rgba) {
    return "#" + rgbHex(rgba.r, rgba.g, rgba.b, rgba.a)
}

export { rgbaToHex}
