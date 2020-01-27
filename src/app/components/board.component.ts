import { Component, Input, Output, EventEmitter } from '@angular/core';
import Board from '../models/Board';
import User from '../models/User';
import Location from '../models/Location';
import Square from '../models/Square';
import {Howl} from 'howler';
import Utils from '../utils'
import Display from '../display';

    @Component({
      selector: 'app-board',
      templateUrl: './board.component.html',
    })

    export class BoardComponent {
      displayBoard: boolean;

      constructor() {
       }

      @Input() cn:string;
      @Input() id:string;
      @Input() src:string;
      @Input() receivedBoard:Board;
      
      @Output() receivedSquaresChange = new EventEmitter<Square []>();
      @Output() receivedHighlightsChange = new EventEmitter<number []>();
      @Output() receivedInitialMovesChange = new EventEmitter<Map<string, number[]>>();

      ind_arr: number[] = [];
      highlighted: number[] = [];
      iterations: number = null;
      originalCautionClassName: string = "";
      userMoveDiv;
      squares: Square[] = [];
      discard: HTMLCollectionOf<Element>;

      emitToParent() {
        this.receivedSquaresChange.emit(this.receivedBoard.getSquares());
        this.receivedHighlightsChange.emit(this.receivedBoard.getCurrentHighlights());
      }

      // TO-DO: replace with hash map lookup
      lookupByNetXY(netX: number, netY: number) {
        let coords = Utils.getXYFromNet(netX, netY);
        return Utils.getIndexFromXY(coords.getX(), coords.getY(), this.receivedBoard.getSquares());
      }

      allowDrop(event) {
        event.preventDefault();
      }

      createBoard(brd: Board){
        var location:Location = new Location(1,1);
        for (var i=0;i<64;i++) {
          this.squares = Utils.createSquareElement(brd, this.squares, location.getX(), location.getY());
         
          location = Utils.incrementBoardSquare(location, i);
          // Iterate x and see if a new row is reached
          // location.setX(location.getX()+1);
          // if ((i+1) % 8 == 0) {
          //   location.setX(1);
          //   location.setY(location.getY()+1);
          // }
        }
          return this.squares;
        }
    
      flipBoard(brd: Board){
        brd = Utils.flipSquares(brd);
        this.receivedSquaresChange.emit(brd.getSquares());
        this.receivedInitialMovesChange.emit(brd.getInitialMoves());
        this.squares = brd.getSquares();
        return brd.getSquares();
      }
    
      drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        if (this.isMovable(ev)) {
            this.highlightAvailableMoves(ev, ev.target.id);
        } else {
          console.log("Select another piece");
          return;
        }
      }
      
      isMovable(ev) {
        // Ensure the piece in question's color matches the current user's color
        if (this.receivedBoard.getGame() === "Chess" && 
          (Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "White" && ev.target.id.match('b')) || 
          (Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "Black" && ev.target.id.match('w')) ||
          this.receivedBoard.getGame() === "Checkers" && 
          (Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "Red" && ev.target.id.match('b')) || 
          (Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "Black" && ev.target.id.match('r'))
          ) {

          let index = Utils.lookupByID(ev.target.id, this.receivedBoard.getSquares());
          this.receivedBoard.setOriginalSquareId(this.receivedBoard.getSquares()[index].getOccupant().getId());

          // If index not already in highlighted array, add it
          if (this.receivedBoard.getCurrentHighlights()[this.receivedBoard.getCurrentHighlights().length -1] != index) {
            this.receivedBoard.addCurrentHighlight(index);
            this.receivedBoard.getSquares()[index].setClass('square yellowSquare');
          }
          this.emitToParent();
          return false;
        } else {
          this.receivedBoard.setOriginalSquareId(ev.target.id);
          return true;
        }
      }
      
      clearCaution(ev) {
        this.unhighlight(ev);
      }

      highlightAvailableMoves(ev, idtemp: string) {

        let originalSquareIndex = Utils.lookupByID(idtemp, this.receivedBoard.getSquares());
        let originalSquare: Square = this.receivedBoard.getSquares()[originalSquareIndex];
        let x = originalSquare.getLocation().getX();
        let y = originalSquare.getLocation().getY();
      
        // start at original square, move in all valid piece directions until piece or edge reached
        var id = idtemp;
        let currentPiece = id[1];
      
        if (currentPiece === 'P' || currentPiece === 'C' || currentPiece === 'D') {
          currentPiece = id[0] + id[1];
        }
      
          let arr = [];
          let aMap = new Map();
          arr.push([x, y]);
      
          this.iterations = this.receivedBoard.getNumMoves().get(id[1]);
          
          // Add special logic to reassign value for pawns and checkers
          if (currentPiece.length === 2 && currentPiece[1] === 'P') {
            this.iterations = this.receivedBoard.getPawnMoves().get(id);
          } else if (currentPiece.length === 2 && (currentPiece[1] === 'C' || currentPiece[1] === 'C')) {
            this.iterations = this.receivedBoard.getCheckerPieces().get(id);
          }

          aMap = this.fillInitial(arr, currentPiece, id);

          if (this.iterations > 1 || id[1] === 'C' || id[1] === 'D') {

            if (id[1] === "P") {
              this.iterations = 1;
            }

            var initialMoves = this.receivedBoard.getInitialMoves().get(currentPiece);

              // directions will be the array of valid directions, e.g for 'R' it will be [1,3,4,6]
            if(currentPiece !=='N') {
              aMap = this.fillDirections(aMap, initialMoves, x, y, id); 
            }
          }
      
          // After all possible moves are returned, can move from a map back to an array
          for (let moves of aMap.keys()) {
            for (let i = 0; i < aMap.get(moves).length; i++) {
              arr.push(aMap.get(moves)[i]);
            } 
          }
          
          let temp_arr = [];
          
          for (let i=0;i<arr.length;i++) {
              let occupies = Utils.whatOccupies(arr[i][0], arr[i][1], this.receivedBoard.getSquares());
              let oppositeColorMove = Utils.isOccupiedByOpposite(id, arr[i][0], arr[i][1],
                                                          this.receivedBoard.getSquares());
              if (!occupies || oppositeColorMove )
                  temp_arr.push(arr[i]);
              } 

            if (currentPiece === 'wP' || currentPiece === 'bP') {

              // First, get the straightforward north or south value for the current pawn
              var straight: number[] = this.receivedBoard.getInitialMoves().get(currentPiece);
             
              // For the directions adjacent to straight direction (NW and NE for northbound; SW and SE for southbound):
              // if the square is occupied by an opposite color piece then the square can be highlighted as a valid move
              if (straight[0] === 1 && y > 1) {
                  var previousDirection = this.receivedBoard.getDirChanges().get("NW");
                  var nextDirection = this.receivedBoard.getDirChanges().get("NE");
              } else {
                  previousDirection = this.receivedBoard.getDirChanges().get("SW");
                  nextDirection = this.receivedBoard.getDirChanges().get("SE");
              }

              var newArr: number[][] = [[]];

              newArr[0] = [x + previousDirection[0], y + previousDirection[1]];
              newArr[1] = [x + nextDirection[0], y + nextDirection[1]];
             
              for (let i=0;i<2;i++) {
                if (Utils.isOccupiedByOpposite(id,newArr[i][0], newArr[i][1], this.receivedBoard.getSquares())) {
                  temp_arr.push([newArr[i][0], newArr[i][1]]);
                }
              }
          }
          
          this.ind_arr = [];
      
          // Get the 0-63 index from the x/y coords
          for (let i=0;i<temp_arr.length; i++) {
            this.ind_arr.push(Utils.convertXYToI(temp_arr[i][0], temp_arr[i][1]));
          }
          
          // Replace the original square colors with "greenSquare" in the className
          for (let i=0;i<this.ind_arr.length; i++) {
            // Keep track of highlighted squares so they can be reverted later
            // If index not already in highlighted array, add it
            if (this.receivedBoard.getCurrentHighlights()[this.receivedBoard.getCurrentHighlights().length -1] != this.ind_arr[i]) {
              this.receivedBoard.addCurrentHighlight(this.ind_arr[i]);
              this.receivedBoard.getSquares()[this.ind_arr[i]].setClass('square greenSquare');
            }      
          }        
          this.emitToParent();
          return;
        }
      
        unhighlight(ev) {
        
          for (let i=0;i<this.receivedBoard.getCurrentHighlights().length; i++) {
            var index = this.receivedBoard.getCurrentHighlights()[i];

            // Calculate original class name based on sum of x/y (even is white, odd is brown)
            if ((this.receivedBoard.getSquares()[index].getLocation().getX() + 
                    this.receivedBoard.getSquares()[index].getLocation().getY()) % 2 === 1) {
                      this.receivedBoard.getSquares()[index].setClass('square whiteSquare');
            } else {
                this.receivedBoard.getSquares()[index].setClass('square brownSquare');
            }
          }
        
          // Clear the array used to track currenty highlighted squares
          this.receivedBoard.setCurrentHighlights([]);
          this.emitToParent();
          return;
        }
          
          fillInitial(arr: number[], currentPiece: string, id: string) {

            var tempMap = new Map();
        
            if(currentPiece !== 'N') {
              var validMoves = this.receivedBoard.getInitialMoves().get(currentPiece);

              while (this.iterations > 0 && arr.length > 0) {
                let popped = arr.pop();
                // Use extra incrementer to increment the index even if a square is invalid
                // to keep track of which direction the move is in
                let index = 0;
                for (let j = popped[1]-1; j <= popped[1] + 1; j++) {
                  for (let i = popped[0]-1;  i <= popped[0] + 1; i++) {
          
                      // If both are in the range of valid coords and aren't the starting square:
                      if (Utils.validCoords(i, j) && !(i === popped[0] && j === popped[1])) {
                        // Only add to array if valid directional move for this piece
                        if (validMoves.includes(index)) {

                            if (id[1] === "P") {
                              let occupied = Utils.whatOccupies(i, j, this.receivedBoard.getSquares());
                              if (!occupied) {
                                tempMap.set(index, [[i, j]]);
                              } 
                            } 
                            
                            else {  // not pawn so always execute
                              tempMap.set(index, [[i, j]]);
                            }
                        }
                      }
                      // Increment index only if not on starting square
                      if (!(i === popped[0] && j === popped[1])) {
                        index++;
                      }
                  }
                }             
             }
            } else {
              tempMap = Utils.fillInitialKnightMoves(arr, this.receivedBoard, id, tempMap);    
            }

          // Only the initial moves that are in a valid direction based on the subject piece will be returned
          return tempMap;
        }
             
        fillDirections(aMap, validMoves, x: number, y: number, id: string) {      
          // The results for each direction will be stored in an array, and each array will be added to a map that is returned
          let dMap  = new Map();

          // Don't want to change this.iterations, so will use tempIterations to decrement and test later
          var tempIterations = this.iterations;
        
          // Hardcoded 8 is the number of possible directions a piece could move
          for (let i=0; i < 8; i++){
              // Look at the key for each member of the Map
              let key = validMoves[i]; // e.g. for R directions[0] = 1
        
                  // Need to ensure the direction in question was included in the fillInitial() results
                  if (aMap.get(key)) {
                      
                    // Use flag to indicate that a dead end has been reached for this specific direction
                    let flag = false;
                    let moveArray = [];
                    let newLoc: Location = new Location(aMap.get(key)[0][0], aMap.get(key)[0][1]);
        
                    // Set the starting square for this direction in the map to be returned before iterating
                    // in that direction
                    let oppositeColorMove = Utils.isOccupiedByOpposite(id, newLoc.getX(), newLoc.getY(),
                                                                        this.receivedBoard.getSquares());
                    let occupied = Utils.whatOccupies(newLoc.getX(), newLoc.getY(), this.receivedBoard.getSquares());

                    // From key, get the direction as a letter e.g. for 1, directions.get[1] = 'N'
                    let newKey = this.receivedBoard.getDirections().get(key);
        
                    // From letter, lookup the direction changes 
                    //e.g. for 'N', dirChanges.get('N') = [0, -1] (no x change, up one)
                    let coords = this.receivedBoard.getDirChanges().get(newKey);
                    
                    if(occupied) {
                      if (oppositeColorMove) {
                        if (id[1] != 'C' && id[1] != 'D') {
                          moveArray.push([newLoc.getX(), newLoc.getY()]);
                        } else {
                          let occupied = Utils.whatOccupies(newLoc.getX() + coords[0], newLoc.getY() + coords[1],
                                                                          this.receivedBoard.getSquares());
                          if (Utils.validCoords(newLoc.getX() + coords[0], newLoc.getY() + coords[1]) 
                                && !occupied) {
                            moveArray.push([newLoc.getX() + coords[0], newLoc.getY() + coords[1]]);
                          }
                        }
                      } 
                      flag = true;    
                    } else {
                      moveArray.push([newLoc.getX(), newLoc.getY()]);
                    }

                    if (id[1] === 'C' || id[1] === 'D') {
                      flag = true;
                    }
        
                    while(!flag) {
      
                      // Determine if move is on the board, and either unoccupied or occupied by other color
                      // If the space is occupied with an opposite color piece, the move is still valid 
                      // but the flag should be set to terminate further moves in that direction
                      let oppositeColorMove = Utils.isOccupiedByOpposite(id, newLoc.getX() + coords[0], 
                                            newLoc.getY() + coords[1], this.receivedBoard.getSquares());         
                      let occupied = Utils.whatOccupies(newLoc.getX() + coords[0], newLoc.getY() + coords[1],
                                                                              this.receivedBoard.getSquares());
                      
                      if (Utils.inRangeExclusive(newLoc.getX() + coords[0], 0, 9) && Utils.inRangeExclusive(newLoc.getY() + coords[1], 0, 9)
                          && (!occupied || 
                          oppositeColorMove)) { 
                          if (id[1] === 'P') {
                              if (occupied) {
                                flag = true;
                              } else  {
                                moveArray.push([newLoc.getX() + coords[0], newLoc.getY() + coords[1]]);
                                this.iterations = 1;
                                tempIterations--;
                              }             
                          } else {
                            // Push the new match to the array for this direction
                            moveArray.push([newLoc.getX() + coords[0], newLoc.getY() + coords[1]]);
                          }

                          // Since pawn moves are never lower than 1, don't need to decrement receivedBoard 
                          // in fillDirection() due to previous decrement in fillInitial()
                          if (oppositeColorMove || tempIterations === 0) {
                            flag = true;
                          } else {
                            // Then, rebase newX and newY for the next iteration
                            newLoc.setX(newLoc.getX() + coords[0]);
                            newLoc.setY(newLoc.getY() + coords[1]);
                          } 
                      } else {
                        flag = true;
                      }              
                    } // end while

                  // Set the key/value pair in the return map, where the value is the array containing all moves
                  // for this direction       
                  dMap.set(key, moveArray);              
                  } // end if    
          } // end for
          return dMap;
        }

      drop(ev) {
        ev.preventDefault();

        let id = "";

        var originalSquareIndex: number = Utils.lookupByID(this.receivedBoard.getOriginalSquareId(),
                                                                    this.receivedBoard.getSquares());
        var originalSquare: Square = this.receivedBoard.getSquares()[originalSquareIndex];
 
        if (((originalSquare.getOccupant().getId().match('w') || originalSquare.getOccupant().getId().match('r')) 
            && Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "Black") || 
            (originalSquare.getOccupant().getId().match('b') 
            && (Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "Red" || 
            Utils.getCurrentUserColor(this.receivedBoard.getUsers()) === "White")))
              {
              this.unhighlight(ev);
              return;
        }
        
        if (ev.currentTarget.childNodes[0]) {
          if (ev.currentTarget.childNodes[0].id != "") {
            id = ev.currentTarget.childNodes[0].id;
          }
        } 
      
          if (id !== "") {
            var newSquareIndex: number = Utils.lookupByID(id, this.receivedBoard.getSquares());   
          } else {
            // If new square is vacant, can't lookup by ID so will need to lookup by net coordinates
            newSquareIndex = this.lookupByNetXY(Math.abs(ev.pageX - ev.offsetX), 
                                                Math.abs(ev.pageY - ev.offsetY));
          }
      
          var newSquare = (this.receivedBoard.getSquares())[newSquareIndex];
      
          if (originalSquareIndex === newSquareIndex || originalSquareIndex === null) {
            // Return highlighted squares to their original value
            this.unhighlight(ev);

            // Reset original square ID
            this.receivedBoard.setOriginalSquareId('');
            return;
          }
          let isValid = false;
       
          // if newSquare's coordinates are in the highlighted array, set isValid to true
          for (var i = 0; i < this.receivedBoard.getCurrentHighlights().length; i++) {
            if ( this.receivedBoard.getCurrentHighlights()[i] === Utils.convertXYToI(newSquare.getLocation().getX(), newSquare.getLocation().getY())) {
              isValid = true;
            }
          }
          
          if (isValid === true) {
            
            var capturedPiece = this.receivedBoard.getSquares()[newSquareIndex].getOccupant().getId();
            var capturedImage = this.receivedBoard.getSquares()[newSquareIndex].getOccupant().getSrc();
            var originalPiece = this.receivedBoard.getSquares()[originalSquareIndex].getOccupant().getId();
      
            // Assign original piece to new square
            this.receivedBoard.getSquares()[newSquareIndex].getOccupant().setId(originalSquare.getOccupant().getId());
            this.receivedBoard.getSquares()[newSquareIndex].getOccupant().setSrc(originalSquare.getOccupant().getSrc());
      
            // Empty out original square 
            this.receivedBoard.getSquares()[originalSquareIndex].getOccupant().setId('');
            this.receivedBoard.getSquares()[originalSquareIndex].getOccupant().setSrc('');

            // Since pawn moves are handled individually, they are the only piece that needs
            // this additional decrement. For other pieces, decrementing this.iterations is sufficient
            if (originalPiece[1] === "P") {
              this.receivedBoard.setPawnMoves(originalPiece, 1);
            } 

          if (originalPiece[1] === 'C' || originalPiece[1] === 'D') {
            // Average the x and y values of the original and new squares to determine captured value
              let absX = Math.abs(originalSquare.getLocation().getX() - newSquare.getLocation().getX());
              let absY = Math.abs(originalSquare.getLocation().getY() - newSquare.getLocation().getY());

                if ((absX === 2) && (absY === 2)) {
                  let capturedX = (newSquare.getLocation().getX() + originalSquare.getLocation().getX()) / 2;
                  let capturedY = (newSquare.getLocation().getY() + originalSquare.getLocation().getY()) / 2;
                  let capturedSquareIndex = Utils.getIndexFromXY(capturedX, capturedY, 
                                                      this.receivedBoard.getSquares());

                  capturedImage = this.receivedBoard.getSquares()[capturedSquareIndex].getOccupant().getSrc();
                  capturedPiece = this.receivedBoard.getSquares()[capturedSquareIndex].getOccupant().getId();

                  // Lookup by coords, then set capturedImage and empty out original square
                  this.receivedBoard.getSquares()[capturedSquareIndex].getOccupant().setId('');
                  this.receivedBoard.getSquares()[capturedSquareIndex].getOccupant().setSrc('');
                }
            }
      
            // Return highlighted squares to their original value
            this.unhighlight(ev);
          } else {
            // Play sound effect
            var sound = new Howl({ src: ['assets/audio/buzzer.mp3'] });
            sound.play();
      
            this.unhighlight(ev);
            return;
          }
      
        // If there is an existing image:
        if (capturedImage != "") {
           // Play sound effect
            var sound = new Howl({ src: ['assets/audio/ring.wav'] });           
            sound.play();
  
          // Based on color of old image, assign to appropriate div
          if(capturedImage.match('w') || capturedImage.match('r')) {
            this.discard = document.getElementsByClassName("first-discards");
            this.receivedBoard.setFirstDiscards(capturedImage);
          } else {
            this.discard = document.getElementsByClassName("second-discards");
            this.receivedBoard.setSecondDiscards(capturedImage);
          }    
        } 
   
        Display.printMove(ev, this.receivedBoard, originalSquare, originalPiece, capturedPiece);

        this.receivedBoard.toggleIsCurrentUser();
      
        Display.printUserDisplay(this.receivedBoard.getUsers());

        // Decrement pawn moves if applicable; can set to 1 without checking here
        if (this.receivedBoard.getOriginalSquareId().match('P')) {
            this.receivedBoard.setPawnMoves(this.receivedBoard.getOriginalSquareId(), 1);
        }

        // Reset original square index
        this.receivedBoard.setOriginalSquareId("");

        // Checkers: check if king is needed
        if (this.receivedBoard.getGame() === "Checkers") {
          let pieceColor = this.receivedBoard.getSquares()[newSquareIndex].getOccupant().getId()[0];

          if ((newSquareIndex < 9  && pieceColor === 'r') || (newSquareIndex > 56  && pieceColor === 'b')) {
              // Change C to D in id and in src
              let newSrc = Utils.kingMe(this.receivedBoard, newSquareIndex);
              this.receivedBoard.getSquares()[newSquareIndex].getOccupant().setSrc(newSrc);           
          }
        }
        this.emitToParent();

        // Check for check?

      }
    }