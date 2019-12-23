import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DiscardAreaComponent } from './discardarea.component';
import { DisplayComponent } from './display.component';
import { ButtonComponent } from './button.component';
import { SquareComponent } from './square.component';
import { BoardComponent } from './board.component';
import { UserDialogComponent } from './userdialog.component';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    DiscardAreaComponent,
    DisplayComponent,
    ButtonComponent,
    SquareComponent,
    BoardComponent,
    UserDialogComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  entryComponents: [
    UserDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
