// définie une zone d'action
const canvas = document.getElementById('canvas1')
    // permet d'attribuer des propriétées à la zone
const ctx = canvas.getContext('2d')
    // taille de la zone ( taille de l'écran width and height)
canvas.width = window.innerWidth
canvas.height = window.innerHeight


const collisionCanvas = document.getElementById('collisionCanvas1')
const collisionCtx = collisionCanvas.getContext('2d')
collisionCanvas.width = window.innerWidth
collisionCanvas.height = window.innerHeight

// variable utilisé pour la boucle de pop des corbeaux
let timeToNextRaven = 0
let ravenInterval = 3000
let lastTime = 0

// tableau qui contiendra les class corbeaux généré
let ravens = []

let score = 0
let gameOver = false
let victory = false

ctx.font = '50px Impact'

// Class corbeau
class Raven {
    constructor() {
            this.spriteWidth = 271
            this.spriteHeight = 271
            this.sizeModifier = Math.random() * 0.5 + 0.3
            this.width = this.spriteWidth * this.sizeModifier;
            this.height = this.spriteHeight * this.sizeModifier;
            //position x et y des corbeaux
            this.x = canvas.width;
            this.y = Math.random() * (canvas.height - this.height);
            // déplacement x et y des corbeaux
            this.directionX = Math.random() * 5 + 3;
            this.directionY = Math.random() * 5 - 2.5;
            //filtre utilisé plus bas
            this.markedForDeletion = false
            this.image = new Image()
            this.image.src = '../assets/img/sprites/ezgif.com-gif-maker.png'
            this.frame = 0
            this.maxFrame = 3
            this.timeSinceFlap = 0
            this.flapInterval = 100
            this.flapInterval = Math.random() * 50 + 50
            this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)
            ]
            this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'
            this.hasTrail = Math.random() > 0.5

        }
        // fonction transforme la position x en deplacement sur l'axe x
    update(deltaTime) {
            if (this.y < 0 || this.y > canvas.height - this.height) {
                this.directionY = this.directionY * -1
            }
            this.x -= this.directionX
            this.y += this.directionY
            if (this.x < 0 - this.width) this.markedForDeletion = true;
            this.timeSinceFlap += deltaTime
            if (this.timeSinceFlap > this.flapInterval) {
                if (this.frame > this.maxFrame) this.frame = 0;
                else this.frame++
                    this.timeSinceFlap = 0
                if (this.hasTrail) {
                    particles.push(new Particle(this.x, this.y, this.width, this.color))
                }
            }
            if (this.x < 0 - this.width) gameOver = true
        }
        // dessine le rectangle avec les propriété définie ci-dessus 
        // position x et y 
        // taille 
        // this =corbeau ( class Raven)
    draw() {
        collisionCtx.fillStyle = this.color
        collisionCtx.fillRect(this.x, this.y, this.width, this.height, )
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

let explosions = []
class Explosion {
    constructor(x, y, size) {
        this.image = new Image()
        this.image.src = '../assets/img/sprites/cloud.png'
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.size = size
        this.x = x
        this.y = y
        this.frame = 0
        this.sound = new Audio()
        this.sound.src = '../assets/sound/boom.wav'
        this.timeSinceLastFrame = 0
        this.frameInterval = 200
        this.markedForDeletion = false
    }
    update(deltaTime) {
        if (this.frame === 0) this.sound.play()
        this.timeSinceLastFrame += deltaTime
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++
                if (this.frame > 5) this.markedForDeletion = true
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size)
    }
}

let particles = []
class Particle {
    constructor(x, y, size, color) {
        this.size = size
        this.x = x + this.size / 2
        this.y = y + this.size / 3

        this.radius = Math.random() * this.size / 10
        this.maxRadius = Math.random() * 20 + 35
        this.markedForDeletion = false
        this.speedX = Math.random() * 1 + 0.5
        this.color = color
    }
    update() {
        this.x += this.speedX
        this.radius += 0.5
        if (this.radius > this.maxRadius) this.markedForDeletion = true
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = 1 - this.radius / this.maxRadius
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('score: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.fillStyle = 'black'
    ctx.fillText('rechargez la page pour relancer une partie', canvas.width / 3, canvas.height / 2)
    ctx.fillText('GAME OVER ' + 'votre score est de ' + score, canvas.width / 4 + 5, canvas.height / 3 + 5)
    ctx.fillStyle = 'white'
    ctx.fillText('GAME OVER ' + 'votre score est de ' + score, canvas.width / 4, canvas.height / 3)
    ctx.fillText('rechargez la page pour relancer une partie', canvas.width / 3 + 5, canvas.height / 2 + 5)
}

function addDifficultLevel() {
    if (Number.isInteger(score / 5)) {
        ravenInterval = ravenInterval - 500
        if (ravenInterval <= 1000) {
            ravenInterval = 1000
        }
        console.log(ravenInterval)
    }
}

// function conditionVictory() {
//     if (score == 60) {

//         victory = true
//     }
// }

function drawVictory() {
    ctx.fillStyle = 'black'
    ctx.fillText('Bien joué ! ', canvas.width / 4 + 5, canvas.height / 3 + 5)
    ctx.fillStyle = 'white'
    ctx.fillText('Bien joué ! ', canvas.width / 4, canvas.height / 3)
    ctx.fillStyle = 'black'
    ctx.fillText('votre score est de ' + score, canvas.width / 3, canvas.height / 2)
    ctx.fillStyle = 'white'
    ctx.fillText('votre score est de ' + score, canvas.width / 3 + 5, canvas.height / 2 + 5)
}

window.addEventListener('click', function(e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1)
    const pc = detectPixelColor.data
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] &&
            object.randomColors[2] === pc[2]) {
            object.markedForDeletion = true
            score++
            addDifficultLevel()
            explosions.push(new Explosion(object.x, object.y, object.width))
            conditionVictory()

        }
    })
})

// boucle de génération des corbeaux
function animate(timestamp) {
    // supprimera tout les rectangle (corbeaux) qui ne seront pas compris entre  et taille du canvas)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height)
        // variable qui défini le temps entre chaque pop de corbeaux
        //timestamp est un chronomètre
    let deltaTime = timestamp - lastTime
        //au premier tour de boucle lastTime =0
        // puis on attribue la valeur du chronomètre pour ce tour de boucle à la variable lastTime
    lastTime = timestamp
        // On incrémente la valeur de timeToNextRaven (initialisé à 0) de la valeur de deltaTime
    timeToNextRaven += deltaTime
        // A chaque tour de boucle la valeur de deltaTime augmente et si 
        // la valeur est supérieur à la valeur de la variable ravenInterval (initialisé à 500)
    if (timeToNextRaven > ravenInterval) {
        // On créer une nouvelle entrée d'une class Raven au tableau ravens
        ravens.push(new Raven())
        timeToNextRaven = 0
        ravens.sort(function(a, b) {
            return a.width - b.width
        })
    };
    drawScore();
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion)
    explosions = explosions.filter(object => !object.markedForDeletion)
    particles = particles.filter(object => !object.markedForDeletion)
        // if (!gameOver && !victory) requestAnimationFrame(animate)
        // else drawGameOver()

    if (gameOver) {
        drawGameOver()
    } else if (victory) {
        drawVictory()
        const ts = timestamp.toLocaleString()
        console.log(ts)
    } else {
        requestAnimationFrame(animate)
    }


}
animate(0)