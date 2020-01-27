import { Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import Square from '../models/Square';
import Board from '../models/Board';
import { BoardComponent } from './board.component';
import { UserDialogComponent } from './userdialog.component';
import { GameSelectionDialogComponent } from './gameselectiondialog.component';
import Display from '../display';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public dialog: MatDialog) {
    // MOve initializations here and make private with get/set as needed
    
  }

  brd = new Board();

  board = new BoardComponent();

  firstDiscardArea: string = "first-discards";
  secondDiscardArea: string = "second-discards";
  firstUser: string = "user-1";
  secondUser: string = "user-2";
  generateButton: string = "Generate " + this.brd.getGame() + " Board";
  flipButton: string = "Flip Board";
  userButton: string = "Edit User Names";
  gameButton: string = "Select Game Type";

  chessImagePath: string =  "assets/img/";

  chessImageExtension: string = ".png";

  squares :Square[] = [];

  openUserDialog() {
    console.log("openUserDialog called");
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: {user1: this.brd.getUsers()[0].getName(), user2: this.brd.getUsers()[1].getName()}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.brd.getUsers()[0].setName(result.user1);
      this.brd.getUsers()[1].setName(result.user2);

      Display.printUserDisplay(this.brd.getUsers());
    });
  }

  openGameDialog() {
    console.log("openGameDialog called");
    const dialogRef = this.dialog.open(GameSelectionDialogComponent, {
      width: '250px',
      data: {selectedGame: this.brd.getGame(), games: ['Chess', 'Checkers']}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.brd.setGame(result.selectedGame);
      console.log('New game is now ' + result.selectedGame);
      if (result.selectedGame === "Chess") {
        this.brd.getUsers()[0].setColor("White");
      } else if (result.selectedGame === "Checkers") {
        this.brd.getUsers()[0].setColor("Red");
      }
      this.generateButton = "Generate " + this.brd.getGame() + " Board";
    });
  }

  receiveSquares($event){
    this.brd.setSquares($event);
  }

  receiveInitialMoves(map: Map<string, number[]>){
    this.brd.setAllInitialMoves(map);
  }

  createBoard() {
    this.brd.setSquares(this.board.createBoard(this.brd));
    Display.printUserDisplay(this.brd.getUsers());
  }

  flipBoard() {
    this.brd.setSquares(this.board.flipBoard(this.brd));
    Display.printUserDisplay(this.brd.getUsers());
  }

}
