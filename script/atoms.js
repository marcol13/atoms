var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var dist_chart = document.querySelector('.dist-chart')
var avg_dist = document.querySelector('.avg-distance')

atoms = []
var n = 30 //ilość atomów
var r = 7 //promień atomów
var d = 1/10*r // tolerancja zderzenia

class Atom{
    m = 1 //masa
    // collision = false
    constructor(r,x,y,vx,vy){
        this.r = r //promień
        this.pos = {
            x: x,
            y: y
        } //wektor położenia
        this.vel = {
            vx: vx,
            vy: vy
        } //wektor prędkości
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false)
        ctx.fillStyle = "black"
        ctx.fill()
    }

    move(){
        this.pos.x += this.vel.vx
        this.pos.y += this.vel.vy
    }
    
    wall_bounce(opt){ //true - odbicie od górnej lub od dolnej ścianki, false - odbicie od prawej lub lewej ścianki
        if(opt === true)
            this.vel.vy *= -1
        else
            this.vel.vx *= -1
    }
}

class RedAtom extends Atom{
    dist = [0]

    draw(){
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false)
        ctx.fillStyle = "#FE383E"
        ctx.fill()
    }

    calc_distance(){
        this.dist[this.dist.length - 1] += parseFloat(Math.sqrt(Math.pow(this.vel.vx,2) + Math.pow(this.vel.vy,2)))
    }

    calc_avg(){
        return this.dist.reduce((a,b) => a + b, 0)/this.dist.length
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

cvs = new Rect(30,30)
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
    for(let i = 0; i < n; i++){
        let atom_x
        let atom_y
        let flag = false
        let same_pos_flag = false
        while(flag != true){
            same_pos_flag = false
            atom_x = random_value(r,canvas.width)
            atom_y = random_value(r,canvas.height)
            if(atom_x + r >= canvas.width || atom_y + r >= canvas.height)
                continue
            for(let j = 0; j < i; j++){
                if(atom_distance([atom_x,atom_y],[atoms[j].pos.x,atoms[j].pos.y]) < r){
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
        if(i == 0)
            atoms.push(new RedAtom(r, atom_x, atom_y, atom_vx, atom_vy))
        else
            atoms.push(new Atom(r, atom_x, atom_y, atom_vx, atom_vy))
    }
}

function check_collision(){
    for(let i = 0; i < atoms.length-1; i++){
        for(let j = i + 1; j < atoms.length; j++){
            let dist = Math.abs(atom_distance([atoms[i].pos.x,atoms[i].pos.y],[atoms[j].pos.x,atoms[j].pos.y]))
            let sub_x = atoms[j].pos.x - atoms[i].pos.x //różnica w x
            let sub_y = atoms[j].pos.y - atoms[i].pos.y //różnica w y
            if((2*r <= dist && dist <= 2*r + d) && ((atoms[i].vel.vx * sub_x + atoms[i].vel.vy * sub_y).toFixed(1) > 0 || (atoms[j].vel.vx * (-sub_x) + atoms[j].vel.vy * (-sub_y).toFixed(1) > 0)) || dist < 2*r){
                let par_x1, par_y1 
                if(sub_x == 0 && sub_y == 0)
                    par_x1 = par_y1 = 0
                else{
                    par_x1 = (sub_x * (sub_x * atoms[i].vel.vx + sub_y * atoms[i].vel.vy)) / (sub_x ** 2 + sub_y ** 2)
                    par_y1 = (sub_y * (sub_x * atoms[i].vel.vx + sub_y * atoms[i].vel.vy)) / (sub_x ** 2 + sub_y ** 2) 
                }
                let par_x2, par_y2
                sub_x = -sub_x
                sub_y = -sub_y
                if(sub_x == 0 && sub_y == 0)
                    par_x2 = par_y2 = 0
                else{
                    par_x2 = (sub_x * (sub_x * atoms[j].vel.vx + sub_y * atoms[j].vel.vy)) / (sub_x ** 2 + sub_y ** 2)
                    par_y2 = (sub_y * (sub_x * atoms[j].vel.vx + sub_y * atoms[j].vel.vy)) / (sub_x ** 2 + sub_y ** 2)
                }
                atoms[i].vel.vx = atoms[i].vel.vx - par_x1 + par_x2
                atoms[i].vel.vy = atoms[i].vel.vy - par_y1 + par_y2
                atoms[j].vel.vx = atoms[j].vel.vx - par_x2 + par_x1
                atoms[j].vel.vy = atoms[j].vel.vy - par_y2 + par_y1 
                if(atoms[i] instanceof RedAtom){
                    Plotly.extendTraces(dist_chart,{
                        y: [[atoms[0].dist[atoms[0].dist.length-1]]]
                    }, [0])
                    move_chart(cnt)
                    cnt++
                    atoms[i].dist.push(0)
                }
                if(atoms[j] instanceof RedAtom){
                    Plotly.extendTraces(dist_chart,{
                        y: [[atoms[0].dist[atoms[0].dist.length-1]]]
                    }, [0])
                    move_chart(cnt)
                    cnt++
                    atoms[j].dist.push(0)
                }
                    
            } 
        }
    }
}

function exit_wall(el,flag){ //flag true - oś x, false - oś y
    if(flag === true){
        if(el.pos.x - el.r < 0)
            el.pos.x = r
        else if(el.pos.x + el.r > canvas.width)
            el.pos.x = canvas.width - r
    }else{
        if(el.pos.y - el.r < 0)
            el.pos.y = r
        else if(el.pos.y + el.r > canvas.height)
            el.pos.y = canvas.height - r
    }    
}

// function reset_collision_flag(){
//     for(const el of atoms){
//         el.collision = false
//     }
// }

function draw_atoms(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    // reset_collision_flag()
    check_collision()
    for(const el of atoms){
        el.move()
        el.draw()
        
        if(el.pos.x + el.r >= canvas.width || el.pos.x - el.r <= 0){
            el.wall_bounce(false)
            exit_wall(el,true)
        }
        if(el.pos.y + el.r >= canvas.height || el.pos.y - el.r <= 0){
            el.wall_bounce(true)
            exit_wall(el,false)
        }
        if(el instanceof RedAtom)
            el.calc_distance()
    }
    window.requestAnimationFrame(draw_atoms)
}
create_atoms()
// window.requestAnimationFrame(draw_atoms)
draw_atoms()

setInterval(function(){
    avg_dist.innerHTML = atoms[0].calc_avg().toFixed(2)
},1000)


function move_chart(cnt){
    if(cnt > 100){
        Plotly.relayout(dist_chart,{
            xaxis:{
                range: [cnt-300,cnt]
            }
        })
    }
}

var cnt = 0
Plotly.plot(dist_chart,[{y:atoms[0].dist, type: 'line'}])





// function change_n(x){
//     if x > 1/4*()
// }


