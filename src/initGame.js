import initKaplay from "./kaplayCtx"

const GRAVITY = 2000
const JUMP = 500
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
    k.loadSprite("numbers", ["./numbers/0.png", "./numbers/1.png", "./numbers/2.png", "./numbers/3.png", "./numbers/4.png", "./numbers/5.png", "./numbers/6.png", "./numbers/7.png", "./numbers/8.png", "./numbers/9.png"])

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
        k.onMousePress("left", () => k.go("game", 0))
    })
    k.go("start-game")

    // Game
    k.scene("game", (score) => {
        // Background
        k.add([
            k.sprite("background-day"), 
            k.z(0),
            k.pos(0,0),
            "bg"
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
        floor.animate("pos", [k.vec2(0, BASE), k.vec2(-48, BASE)], {duration:0.3, direction:"forward"})

        // Score
        const boxScore = k.add([
            k.pos(k.width() / 2, 50),
            k.z(2),
            k.fixed()
        ]);
        const thentDigit = boxScore.add([
            k.sprite("numbers", {frame: 0}),
            k.pos(-10,0),
            k.opacity(0)
        ])
        const unitDigit = boxScore.add([
            k.sprite("numbers", {frame: 0}),
            k.pos(10,0),
            k.opacity(1)
        ])
        function Score(score) {
            var thent = Math.floor(score / 10)
            var unit = Math.floor(score % 10)
            if (score > 9) {
                thentDigit.opacity = 1
                thentDigit.frame = thent

            } 
            unitDigit.frame = unit
        }
        k.onUpdate("bird", () => Score(score))

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
            bird.jump(JUMP)
        })
        bird.onCollide("pipe", () => {
            k.go("lose", score)
        })
        bird.onCollide("floor", () => {
            k.go("lose", score)
        })

        // Pipes
        function spawnPipe() {
        const top = k.rand(MAX, MIN - OPEN)

        k.add([
            k.sprite("pipes"),
            k.area({isSensor: true}),
            k.anchor("topright"),
            k.rotate(180),
            k.move(k.LEFT, 160),
            k.z(1),
            k.pos(k.width(), top),
            k.offscreen({destroy: true}),
            "pipe",
            {passed: false}
        ])
        k.add([
            k.sprite("pipes"),
            k.area({isSensor: true}),
            k.rotate(0),
            k.move(k.LEFT, 160),
            k.z(1),
            k.pos(k.width(), top + OPEN),
            k.offscreen({destroy: true}),
            "pipe",
            { passed: false },
            ])
        }
        k.onUpdate("pipe", (p) => {
            if (p.pos.x + p.width <= bird.pos.x && p.passed === false) {
                score += 0.5
                p.passed = true
                k.debug.log(score)
            }
        })

        k.loop(1.2, () => {
            spawnPipe()
        })
    })

    // Lost Game
    k.scene("lose", (score) => {
        var thent = Math.floor(score / 10)
        var unit = Math.floor(score % 10)
        const boxScore = k.add([
            k.pos(k.width()/2, k.height()/2 + 50),
            k.z(2),
            k.fixed(),
            k.anchor(k.center())
        ]);
        const thentDigit = boxScore.add([
            k.sprite("numbers", {frame: 0}),
            k.pos(-10,0),
            k.opacity(0)
        ])
        const unitDigit = boxScore.add([
            k.sprite("numbers", {frame: 0}),
            k.pos(10,0),
            k.opacity(1)
        ])
        if (score > 9) {
            thentDigit.opacity = 1
            thentDigit.frame = thent
            unitDigit.frame = unit
        } else {
            unitDigit.frame = unit
            unitDigit.pos = k.vec2(0,0)
        }
    
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
        k.onMousePress("left", () => k.go("game", 0))
    })
}