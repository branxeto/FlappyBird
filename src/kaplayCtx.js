import kaplay from "kaplay"

export default function initKaplay() {
    return kaplay ({
        width: 288,
        height: 512,
        letterbox: true,
        global: false,
        debug: true, //put false in prod
        debugKey: "f1",
        canvas: document.getElementById("game"),
        pixelDensity: devicePixelRatio
    })
}