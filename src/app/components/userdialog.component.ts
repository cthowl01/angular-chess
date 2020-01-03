import { Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
    user1: string;
    user2: string;
  }

@Component({
    selector: 'user-dialog',
    templateUrl: 'userdialog.component.html',
  })
  
  export class UserDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<UserDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
