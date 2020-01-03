# Chess Code Details

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.19.

The goal of this project was to implement a chess game using Angular 8. Much of the functionality was previously written for a vanilla JavaScript implementation of chess.

The Angular module bootstraps the App component, which serves as the parent to all other Angular components: Board, Button, Discard Area, Display, and User Dialog. @Input is used to transfer data from parent to child components, and @Output is used to emit events for child->parent data transfer.

The Board component contains the data that dictates how the various chess pieces are allowed to interact with the board and with other pieces. Maps are used to allow efficient lookups. Some of the data changes throughout the game (e.g. the number of moves a pawn can make), so setters are used to update the private data.


Methods of note:

createSquareElement() determines the initial occupying piece based on the coordinates and is called by createBoard().

flipBoard() handles the logistics of moving the pieces and updating valid moves when the board is flipped.

isMovable() checks the current user and highlights illegal moves with a yellow square upon drag.

highlightAvailableMoves() determines which squares are valid landing spaces and turns them green while the piece is being dragged.

fillInitial() is used to determine the initial moves that are in a valid direction based on the subject piece. The type of piece will be looked up to determine which directions the piece can move, and any potential moves that wouldn't either move to an empty square or legally capture an opposing piece would be eliminated.

fillDirections() follows fillInitial() for pieces that can move more than one piece or one "iteration" (i.e. knights aren't included here). The initial valid moves are extended in the specific direction until the number of iterations is exhausted or else another piece or the edge of the board is reached.

unhighlight() returns the yellow and green squares to their original color (which is calculated based on the sum of the x and y coordinates).

There are three buttons presented when the application is started:
-Generate Board
-Flip Board
-Edit User Names

The "Generate Board" button creates the 8x8 chess board and populates the squares with the correct pieces.

The "Flip Board" button basically turns the board 180 degrees so that the colors at the top and bottom of the board are reversed. The data that defines the board squares and their future movements are also updated to ensure continuity.

The "Edit User Names" button allows updates to the default user names used in the display.

The color green is used to highlight valid moves. The color yellow is used to indicate a piece cannot currently be moved due to the wrong user being current.

The Angular Material framework is used for the "Edit User Names" modal and for the buttons used throughout the application. The prebuilt Material theme "indigo-pink" is used.

Sound effects are implemented using the HowlerJS framework. Currently, a capture is noted with a ring sound effect, and an invalid drop is noted with a buzzer.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



TODOs:

Keep styles in CSS files for specific components
Change to SCSS; calculate sq size based on board size %, e.g.
Components in separate folders; research where domain classes/models (e.g. Board.ts) should go (models subfolder?)

PRIORITY: Limit files to ~200 lines; limit methods to 1-2 screens; separate based on functionality

Research whether VSCode plugin could help generate getters/setters vs manual
    get and set keywords

Class properties should be read only by default; research what should be set upon init

Look into who first method

Isolate image data and functionality into image service

Look at User component that can display itself and contain other user data