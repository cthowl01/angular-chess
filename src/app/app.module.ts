import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app.component';
import { DiscardAreaComponent } from './components/discardarea.component';
import { DisplayComponent } from './components/display.component';
import { ButtonComponent } from './components/button.component';
import { SquareComponent } from './components/square.component';
import { BoardComponent } from './components/board.component';
import { UserDialogComponent } from './components/userdialog.component';
import { GameSelectionDialogComponent } from './components/gameselectiondialog.component';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    AppComponent,
    DiscardAreaComponent,
    DisplayComponent,
    ButtonComponent,
    SquareComponent,
    BoardComponent,
    UserDialogComponent,
    GameSelectionDialogComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule
  ],
  entryComponents: [
    UserDialogComponent,
    GameSelectionDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
