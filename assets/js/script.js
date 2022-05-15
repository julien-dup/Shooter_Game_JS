// définie une zone d'action
const canvas =document.getElementById('canvas1')
// permet d'attribuer des propriétées à la zone
const ctx =canvas.getContext('2d')
// taille de la zone ( taille de l'écran width and height)
canvas.width =window.innerWidth
canvas.height = window.innerHeight


const collisionCanvas =document.getElementById('collisionCanvas1')
const collisionCtx =collisionCanvas.getContext('2d')
collisionCanvas.width =window.innerWidth
collisionCanvas.height = window.innerHeight

// variable utilisé pour la boucle de pop des corbeaux
let timeToNextRaven =0
let ravenInterval =500
let lastTime =0

// tableau qui contiendra les class corbeaux généré
let ravens = []

let score = 0
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
        this.x =canvas.width;
        this.y= Math.random()  * (canvas.height - this.height);
        // déplacement x et y des corbeaux
        this.directionX = Math.random() *  5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        //filtre utilisé plus bas
        this.markedForDeletion = false
        this.image =new Image()
        this.image.src = '../assets/img/sprites/ezgif.com-gif-maker.png'
        this.frame = 0
        this.maxFrame = 3
        this.timeSinceFlap =0
        this.flapInterval = 100
        this.flapInterval = Math.random() * 50 + 50
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        this.color ='rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'
        
    }
    // fonction transforme la position x en deplacement sur l'axe x
    update(deltaTime) {
        if (this.y<0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1
        }
        this.x -= this.directionX
        this.y += this.directionY
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame =0;
            else this.frame ++
            this.timeSinceFlap = 0
        }
    }
    // dessine le rectangle avec les propriété définie ci-dessus 
        // position x et y 
        // taille 
        // this =corbeau ( class Raven)
    draw() {
        collisionCtx.fillStyle = this.color
        collisionCtx.fillRect(this.x, this.y, this.width, this.height, )
        ctx.drawImage(this.image, this.frame*this.spriteWidth,0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

let explosions = []
class Explosion{
    constructor(x, y, size) {
        this.image = new Image()
        thisimage.scr = 'boom.png'
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.size = size
        this.x = x
        this.y = y
        this.frame = 0
        this.sound = new Audio()
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText  ('score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText  ('score: ' + score, 55, 80);
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y,1,1)
    console.log(detectPixelColor)
    const pc = detectPixelColor.data
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0]  && object.randomColors[1] === pc[1]  && 
            object.randomColors[2] === pc[2]){
                object.markedForDeletion = true
                score ++
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
    let deltaTime =timestamp - lastTime
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
        timeToNextRaven =0
        ravens.sort(function(a,b){
            return a.width - b.width
        })
    };
    drawScore();
    [...ravens].forEach(object => object.update(deltaTime));
    [...ravens].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion)
    requestAnimationFrame(animate)
   
}
animate(0)