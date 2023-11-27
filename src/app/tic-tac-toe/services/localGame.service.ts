import { NgIfContext } from "@angular/common";
import { Injectable } from "@angular/core";
import { max, Subject, throwIfEmpty } from "rxjs";
import { feld } from "./modules/feld.module";

@Injectable({ providedIn: 'root' })
export class localGame {
    felder: feld[];
    player: string;
    playerTurn: boolean;
    ai: string;
    diff: string;
    gameOver: boolean;
    scorePlayer = 0;
    scoreAi = 0;
    playerScore = new Subject<number>();
    aiScore = new Subject<number>();
    winCondition: number[][];
    gameErg = new Subject<string>();
    currentPlayer = new Subject<string>();
    countMini = 0;
    firstTurn: boolean;

    constructor() {
        this.firstTurn = true;
        this.gameOver = false;
        this.playerScore.next(0);
        this.aiScore.next(0);
        this.initFelder();
        this.initWinCondition();
        this.currentPlayer.subscribe(player => {
            if (player == this.player) {
                this.playerTurn = true;
            } else {
                this.playerTurn = false;
                this.setAi(this.diff);
            }
        })
    }

    checkWin(): string {
        let winner;
        // //Check Win
        for (let cond of this.winCondition) {
            if (this.felder[cond[0]].value == this.felder[cond[1]].value &&
                this.felder[cond[1]].value == this.felder[cond[2]].value &&
                this.felder[cond[0]].value != ''
            ) {
                this.felder[cond[0]].state = this.felder[cond[1]].state = this.felder[cond[2]].state = 'Won';
                winner = this.felder[cond[0]].value;
                
                winner == this.ai ? this.aiScore.next(++this.scoreAi): this.playerScore.next(++this.scorePlayer);
                // console.log(this.aiScore);
                // console.log(this.playerScore);
                
                this.gameErg.next(winner);
                return winner;
            }
        }
        // //Check Draw
        let drawCount = 0;
        for (let feld of this.felder) {
            if (!feld.free) drawCount++;
        }

        if (drawCount == 9) {
            // console.log('Tie');
            this.gameErg.next('Tie');
            return 'Tie';
        }
        //Else Game is still Running, now the Ai sould play
        else {
            return '';
        }
    }

    checkW(felder: feld[]): string {
        // //Check Win
        for (let cond of this.winCondition) {
            if (felder[cond[0]].value == felder[cond[1]].value &&
                felder[cond[1]].value == felder[cond[2]].value &&
                felder[cond[0]].value != '') {
                return felder[cond[0]].value;
            }
        }
        // //Check Draw
        let drawCount = 0;
        for (let feld of felder) {
            if (!feld.free) drawCount++;
        }
        if (drawCount == 9) {
            return 'Tie';
        }
        return null;
    }




    setFeld(feld: feld) {
        if (!this.playerTurn || this.gameOver || !this.felder[feld.pos].free) {
            // console.log('Not Player Turn !');
            return;
        }
        this.felder[feld.pos].value = this.player;
        this.felder[feld.pos].state = this.player;
        this.felder[feld.pos].free = false;
        let erg = this.checkWin();
        if (erg != '') {
            this.gameOver = true;
            this.gameErg.next(erg);
            // console.log(erg);
        } else {
            this.currentPlayer.next(this.ai);
        }
    }

    setFeldAi(pos: number) {
        if(this.gameOver) return;
        this.felder[pos].value = this.ai;
        this.felder[pos].state = this.ai;
        this.felder[pos].free = false;
        let erg = this.checkWin();
        if (erg != '') {
            this.gameOver = true;
            this.gameErg.next(erg);
            // console.log(erg);
        } else {
            this.currentPlayer.next(this.player);
        }
    }


    setAi(diff: string) {
        switch (diff) {
            case 'Easy':
                this.setAiEasy();
                break;
            case 'Medium':
                this.setAiMedium();
                break;
            case 'Impossible':
                this.setAiImpossible();
                break;
        }
    }

    setAiEasy() {
        // Easy
        setTimeout(() => {
            let found = false;
            let pos = 10;
            while (found == false) {
                pos = Math.floor(Math.random() * this.felder.length);
                if (this.felder[pos].free) found = true;
            }
            this.felder[pos].value = this.ai;
            this.felder[pos].state = this.ai;
            this.felder[pos].free = false;
            let erg = this.checkWin();
            if (erg != '') {
                this.gameOver = true;
                this.gameErg.next(erg);
                // console.log(erg);

            } else {
                this.currentPlayer.next(this.player);
            }
        }, 300);
    }

    setAiMedium() {
        setTimeout(() => {
            if (this.felder[4].free) {
                this.setFeldAi(4);
                return;
            } else {
                let best = this.getBestMoves();
                // console.log(best);

                let possibleMoves = [];
                best.forEach(comb => {
                    if (this.felder[comb].free) possibleMoves.push(comb);
                });

                let pos = possibleMoves[0];

                this.felder[pos].value = this.ai;
                this.felder[pos].state = this.ai;
                this.felder[pos].free = false;

                let erg = this.checkWin();
                if (erg != '') {
                    this.gameOver = true;
                    this.gameErg.next(erg);
                    // console.log(erg);

                } else {
                    this.currentPlayer.next(this.player);
                }
            }
        }, 300);
    }

    setAiImpossible() {
        setTimeout(() => {
            let bestScore = -100;
            let bestMove;
            this.felder.forEach(feld => {
                if (this.felder[feld.pos].free) {
                    this.felder[feld.pos].value = this.ai;
                    this.felder[feld.pos].free = false;
                    let points = this.minimax(this.felder, 0, false);
                    this.felder[feld.pos].value = '';
                    this.felder[feld.pos].free = true;
                    if (points > bestScore) {
                        bestScore = points;
                        bestMove = feld.pos;
                    }
                }
            })
            this.felder[bestMove].value = this.ai;
            this.felder[bestMove].state = this.ai;
            this.felder[bestMove].free = false;
            let erg = this.checkWin();
            if (erg != '') {
                this.gameOver = true;
                this.gameErg.next(erg);
                // console.log(erg);
            } else {
                this.currentPlayer.next(this.player);
            }
        }, 300);
    }

    getMoves():number[]{
        let best = [];
        let bestScore = 0;
        this.winCondition.forEach(cond => {

        })
        return best;
    }

    getBestMoves(): number[] {
        let best = [];
        let bestScore = 0;

        this.winCondition.forEach(cond => {
            if (!this.felder[cond[0]].free && !this.felder[cond[1]].free && !this.felder[cond[2]].free) {
            }
            else{
                let score = this.getScore(cond[0]) + this.getScore(cond[1]) + this.getScore(cond[2]);
                // console.log('Score of [' + cond[0] + ',' + cond[1] + ',' + cond[2] + '] is ' + score);
                // console.log('BestScore is'+bestScore);
                if (score > bestScore) {
                    bestScore = score;
                    best = cond;
                }
                if (score == 5 && bestScore < 100) {
                    best = cond;
                    bestScore = 150;
                }
                if (score == 35 && bestScore < 100) {
                    best = cond;
                    bestScore = 200;
                }

            }
        });
        return best;
    }

    getScore(pos: number): number {
        if (this.felder[pos].value == this.ai) return 15;
        else if (this.felder[pos].value == this.player) return 0;
        return 5;
    }

    minimax(felder: feld[], depth: number, isMaximizing: boolean): number {
        let erg = this.checkW(felder);
        if (erg == this.ai) return 1;
        if (erg == this.player) return -1;
        if (erg == 'Tie') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < felder.length; i++) {
                if (felder[i].free) {
                    felder[i].value = this.ai;
                    felder[i].free = false;
                    let points = this.minimax(felder, depth + 1, false);
                    felder[i].value = '';
                    felder[i].free = true;
                    bestScore = Math.max(bestScore, points);
                }
            }
            return bestScore;
        }
        else {
            let bestScore = 100;
            for (let i = 0; i < this.felder.length; i++) {
                if (felder[i].free) {
                    felder[i].value = this.player;
                    felder[i].free = false;
                    let points = this.minimax(felder, depth + 1, true);
                    felder[i].value = '';
                    felder[i].free = true;
                    bestScore = Math.min(bestScore, points);
                }
            }
            return bestScore;
        }
    }



    reset() {
        // if (this.player == 'X') this.playerTurn = true;
        this.gameOver = false;
        this.gameErg.next('');
        this.felder.forEach(feld => {
            feld.free = true;
            feld.value = '';
            feld.state = 'normal';
        });
        if (this.ai == 'X') {
            this.setAiEasy();
        } else {
            this.currentPlayer.next('X');
        }
    }


    initWinCondition() {
        this.winCondition = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    }

    initFelder() {
        this.felder = [
            new feld(0),
            new feld(1),
            new feld(2),
            new feld(3),
            new feld(4),
            new feld(5),
            new feld(6),
            new feld(7),
            new feld(8),
        ];
    }
}