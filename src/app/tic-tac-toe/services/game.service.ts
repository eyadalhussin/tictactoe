import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn:'root'})
export class gameService{
    gameID = new Subject<string>();


    createGame(){
        this.gameID.next('123');
    }
}