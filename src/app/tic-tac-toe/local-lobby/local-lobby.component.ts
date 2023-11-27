import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { localGame } from '../services/localGame.service';

@Component({
  selector: 'app-local-lobby',
  templateUrl: './local-lobby.component.html',
  styleUrls: ['./local-lobby.component.css']
})
export class LocalLobbyComponent implements OnInit {

  playerSet:boolean;
  selected:string;
  isLoading:boolean;
  constructor(private localGame:localGame, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    this.playerSet = false;
    this.selected = '';
  }
  
  
  setPlayer(player:string){
    this.playerSet = true;
    if(player == 'X'){
      this.localGame.player ='X';
      this.selected = 'X';
      this.localGame.ai ='O';
    }
    else {
      this.localGame.player ='O';
      this.selected = 'O';
      this.localGame.ai ='X';
    }
    // console.log('player is ' + this.localGame.player);
    // console.log('ai is ' + this.localGame.ai);
    
  }

  setDiff(diff:string){
    if(!this.playerSet) return;
    this.localGame.diff = diff;
    this.router.navigate(['LocalGame'],{relativeTo:this.activatedRoute.parent});
  }

}
