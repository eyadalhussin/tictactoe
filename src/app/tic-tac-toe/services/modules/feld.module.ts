export class feld{
    pos:number;
    value:string;;
    free:boolean;
    state:string;

    
    constructor(pos:number){
        this.pos = pos;
        this.value = '';
        this.free = true;
        this.state = 'normal';
    }
}