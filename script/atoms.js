var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

atoms = []
var n = 4 //ilość atomów
var r = 7 //promień atomów

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
canvas.width = cvs.l * 2
canvas.height = cvs.h * 2

function random_value(min,max){
    return Math.floor(Math.random() * max) + min
}

function atom_distance(el1,el2){
    return Math.sqrt(Math.pow(el2[0] - el1[0],2)+Math.pow(el2[1] - el1[1],2))
}

function random_sign(){
    let rand = Math.floor(Math.random() * 2)
    return rand == 1 ? 1 : -1
}

function create_atoms(){
    for(var i = 0; i < n; i++){
        let atom_x
        let atom_y
        let flag = false
        let same_pos_flag = false
        while(flag != true){
            same_pos_flag = false
            atom_x = random_value(r,canvas.width)
            atom_y = random_value(r,canvas.height)
            console.log(atom_x,atom_y)
            if(atom_x + r >= canvas.width || atom_y + r >= canvas.height)
                continue
            for(let j = 0; j < i; j++){
                if(atom_distance([atom_x,atom_y],atoms[j].pos_vector) < r){
                    same_pos_flag = true
                    break
                }
            }
            if(same_pos_flag == true)
                continue
            flag = true
        }
        atom_vx = random_value(1,4) * random_sign()
        atom_vy = random_value(1,4) * random_sign()
        atoms.push(new Atom(r, atom_x, atom_y, atom_vx, atom_vy))
    }
}

function check_colision(){
    var d = 1/10*r // tolerancja zderzenia
    for(const i of atoms){
        for(const j of atoms){
            if(i === j)
                continue
            // console.log(atom_distance(i.pos_vector,j.pos_vector))
            if(2*r <= Math.abs(atom_distance(i.pos_vector,j.pos_vector)) && Math.abs(atom_distance(i.pos_vector,j.pos_vector)) <= 2*r + d){
                let temp = i.vel_vector[0]
                i.vel_vector[0] = j.vel_vector[0]
                j.vel_vector[0] = temp
                console.log("kolizja")
            }
                
        }
    }
}

function draw_atoms(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    check_colision()
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
create_atoms()
// window.requestAnimationFrame(draw_atoms)
draw_atoms()


// function change_n(x){
//     if x > 1/4*()
// }


