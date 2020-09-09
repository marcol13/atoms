var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

atoms = []
var n = 15 //ilość atomów
var r = 5 //promień atomów

class Atom{
    m = 1 //masa
    constructor(r,x,y,vx,vy){
        this.r = r //promień
        this.pos_vector = [x,y] //wektor położenia
        this.vel_vector = [vx,vy] //wektor prędkości
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.pos_vector[0], this.pos_vector[1], this.r, 0, Math.PI * 2, false)
        ctx.fill()
    }

    move(){
        this.pos_vector[0] += this.vel_vector[0]
        this.pos_vector[1] += this.vel_vector[1]
    }
    
    wall_bounce(opt){ //true - odbicie od górnej lub od dolnej ścianki, false - odbicie od prawej lub lewej ścianki
        if(opt === true)
            this.vel_vector[1] *= -1
        else
            this.vel_vector[0] *= -1
    }
}

class Rect{
    constructor(etah, etal){
        this.etah = etah >= 20 ? etah : 20, //współczynnik h
        this.etal = etal >= 20 ? etal : 20, //współczynnik l
        this.h = this.etah * r, //wysokość
        this.l = this.etal * r //szerokość
    }
}

cvs = new Rect(50,20)
canvas.width = cvs.l * 3
canvas.height = cvs.h * 3

function random_value(min,max){
    return Math.floor(Math.random() * max) + min
}

for(var i = 0; i < n; i++){
    atoms.push(new Atom(r, random_value(r,canvas.width), random_value(r,canvas.height), random_value(1,4), random_value(1,4)))
}

function draw_atoms(){
    ctx.clearRect(0,0, canvas.width, canvas.height)

    for(const el of atoms){
        el.draw()
        el.move()
        if(el.pos_vector[0] + el.r >= canvas.width || el.pos_vector[0] - el.r <= 0){
            el.wall_bounce(false)
        }
        if(el.pos_vector[1] + el.r >= canvas.height || el.pos_vector[1] - el.r <= 0){
            el.wall_bounce(true)
        }
    }
    window.requestAnimationFrame(draw_atoms)
}
window.requestAnimationFrame(draw_atoms)


// function change_n(x){
//     if x > 1/4*()
// }


