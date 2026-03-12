import initKaplay from "./kaplayCtx"

const GRAVITY = 2500
const MIN = 412
const MAX = 50
const OPEN = 130
const BASE = 450

export default function initGame() {
    const k = initKaplay()
    k.setGravity(GRAVITY)
    k.loadSprite("background-day", "./background-day.png")
    k.loadSprite("start-game", "./message.png")
    k.loadSprite("base", "./base.png")
    k.loadSprite("blue-bird", ["./bluebird-midflap.png", "./bluebird-downflap.png", "./bluebird-upflap.png"], {
        anims: {
            "fly": {
                from: 0,
                to: 2,
                loop: true
            }
        }
    })
    k.loadSprite("pipes", "./pipe-green.png")
    k.loadSprite("lose-game", "./gameover.png")

    // Init game
    k.scene("start-game", () => {
        k.add([
            k.sprite("background-day"), 
            k.z(0),
            k.pos(0,0)
        ])
        k.add([
            k.sprite("start-game"),
            k.z(1),
            k.pos(k.center()),
            k.anchor("center")
        ])
        k.onMousePress("left", () => k.go("game"))
    })
    k.go("start-game")

    // Game
    k.scene("game", () => {
        // Background
        k.add([
            k.sprite("background-day"), 
            k.z(0),
            k.pos(0,0)
        ])

        // Floor
        const floor = k.add([
            k.sprite("base"),
            k.z(2),
            k.pos(0, BASE),
            k.area(),
            k.body({isStatic: true}),
            k.animate(),
            "floor"
        ])
        floor.animate("pos", [k.vec2(0, BASE), k.vec2(-48, BASE)], {duration:1, direction:"forward"})

        // Bird
        const bird = k.add([
            k.sprite("blue-bird", {anim: "fly"}), 
            k.area(), 
            k.body(),
            k.rotate(0),
            k.pos(80, 50),
            {direction: k.vec2(0,0)},
            "bird"
        ])
        k.onMousePress("left", () => {
            bird.jump(600)
        })
        bird.onCollide("pipe", () => {
            k.go("lose")
        })
        bird.onCollide("floor", () => {
            k.go("lose")
        })

        // Pipes
        function spawnPipe() {
        const top = k.rand(MAX, MIN - OPEN)

        k.add([
            k.sprite("pipes"),
            k.area(),
            k.anchor("topright"),
            k.rotate(180),
            k.move(k.LEFT, 160),
            k.z(1),
            k.pos(k.width(), top),
            k.offscreen({destroy: true}),
            "pipe"
        ])
        k.add([
            k.sprite("pipes"),
            k.area(),
            k.rotate(0),
            k.move(k.LEFT, 160),
            k.z(1),
            k.pos(k.width(), top + OPEN),
            k.offscreen({destroy: true}),
            "pipe",
            { passed: false },
            ])
        }

        k.loop(1.2, () => {
            spawnPipe()
            k.debug.log("pipe spawn")
        })
    })

    // Lost Game
    k.scene("lose", () => {
        k.add([
            k.sprite("background-day"), 
            k.z(0),
            k.pos(0,0)
        ])
        k.add([
            k.sprite("lose-game"),
            k.z(1),
            k.pos(k.width() / 2, k.height() / 2),
            k.anchor("center"),
        ]);
        k.onMousePress("left", () => k.go("game"))
    })
}