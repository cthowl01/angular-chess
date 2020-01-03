import { Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
    selectedGame: string;
    games: string[];
  }

@Component({
    selector: 'gameselection-dialog',
    templateUrl: 'gameselectiondialog.component.html',
  })
  
  export class GameSelectionDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<GameSelectionDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
