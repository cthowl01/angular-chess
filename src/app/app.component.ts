import { Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import Square from '../assets/Square';
import Board from '../assets/Board';
import { BoardComponent } from './board.component';
import { UserDialogComponent } from './userdialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public dialog: MatDialog) {
  }

  firstDiscardArea: string = "white-discards";
  secondDiscardArea: string = "black-discards";
  firstUser: string = "user-1";
  secondUser: string = "user-2";
  generateButton: string = "Generate Board";
  flipButton: string = "Flip Board";
  userButton: string = "Edit User Names";

  chessImagePath: string =  "assets/img/";

  chessImageExtension: string = ".png";

  squares :Square[] = [];

  brd = new Board();

  board = new BoardComponent();

  openDialog() {
    console.log("openDialog called");
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: {user1: this.brd.getUsers()[0].getName(), user2: this.brd.getUsers()[1].getName()}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.brd.getUsers()[0].setName(result.user1);
      this.brd.getUsers()[1].setName(result.user2);

      this.board.printUserDisplay(this.brd.getUsers());
    });
  }

  receiveSquares($event){
    this.brd.setSquares($event);
  }

  // receiveUsers($event){
  //   //this.brd.setUser($event);
  // }

  receiveInitialMoves(map: Map<string, number[]>){
    this.brd.setAllInitialMoves(map);
  }

  createBoard() {
    this.brd.setSquares(this.board.createBoard());
    this.board.printUserDisplay(this.brd.getUsers());
  }

  flipBoard() {
    this.brd.setSquares(this.board.flipBoard(this.brd));
    this.board.printUserDisplay(this.brd.getUsers());
  }


}
