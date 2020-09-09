var n = 15 //ilość atomów
var r = 5 //promień atomów

class Atom{
    m = 1 //masa
    constructor(r,x,y,vx,vy){
        this.r = r //promień
        this.pos_vector = [x,y] //wektor położenia
        this.vel_vector = [vx,vy] //wektor prędkości
    }
    
    function wall_bounce(opt){ //true - odbicie od górnej lub od dolnej ścianki, false - odbicie od prawej lub lewej ścianki
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

// function change_n(x){
//     if x > 1/4*()
// }