import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ActivatedRoute, Router } from '@angular/router';
import { localGame } from '../services/localGame.service';
import { feld } from '../services/modules/feld.module';

@Component({
  selector: 'app-local-game',
  templateUrl: './local-game.component.html',
  styleUrls: ['./local-game.component.css'],
  animations: [
    trigger('feld', [
      state('normal', style({})),
      state('X', style({
        'background-color': '#0275d8',
        'transform': 'scale(1.05)',
        'color': 'white'
      })),
      state('O', style({
        'background-color': '#d9534f',
        'transform': 'scale(1.05)',
        'color': 'white'
      })),
      state('Won', style({
        'background-color': '#5cb85c',
        'transform': 'scale(1.1)',
        'color': 'white'
      })),
      transition('normal => X', animate(200)),
      transition('normal => O', animate(200)),
      transition('X => Won', animate(200)),
      transition('O => Won', animate(200))
    ])
  ]
})
export class LocalGameComponent implements OnInit {
  felder: feld[];
  gameErg:string;
  player:string;
  playerScore:number;
  aiScore:number;
  gameOver:boolean;

  constructor(private localGameSerivce: localGame, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //If the user reloads the page, will be redirected to the Lobby
    if (this.localGameSerivce.diff == null) this.router.navigate(['TicTacToe']);
    //Get The Fields
    this.localGameSerivce.reset();
    this.felder = this.localGameSerivce.felder;
    this.gameOver = this.localGameSerivce.gameOver;
    this.localGameSerivce.playerScore.subscribe(score => this.playerScore = score);
    this.localGameSerivce.aiScore.subscribe(score => this.aiScore = score);
    this.localGameSerivce.gameErg.subscribe(erg => {
      if(erg == 'Tie!'){
        this.gameErg = erg;
        this.gameOver = true;
      } 
      else if (erg == 'X' || erg == 'O'){
        this.gameErg = erg + ' Won!';
        this.gameOver = true;
      }
      else { this.gameErg = erg;}
    });
    //Listen To Game Ergebnis
    this.player = this.localGameSerivce.player;
    this.playerScore = 0;
    this.aiScore = 0;
  }

  setFeld(feld: feld) {
    this.localGameSerivce.setFeld(feld);
  }
  
  reset() {
    this.gameOver = false;
    this.localGameSerivce.reset();
  }

  back(){
    this.router.navigate(['']);
  }
}
