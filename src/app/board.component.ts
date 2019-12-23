import { Component, Input, Output, EventEmitter } from '@angular/core';
import Board from '../assets/Board';
import User from '../assets/User';
import Location from '../assets/Location';
import Square from '../assets/Square';
import Occupant from '../assets/Occupant';
import {Howl, Howler} from 'howler';

    @Component({
      selector: 'app-board',
      templateUrl: './board.component.html',
    })

    export class BoardComponent {

      displayBoard: boolean;

      constructor() { }

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
    
      chessImagePath: string = "assets/img/";
    
      checkersImagePath: string = "assets/img/";
    
      chessImageExtension: string = ".png";
    
      checkersImageExtension: string = ".png";
    
      game: string = "CHESS";

      userMoveDiv;

      squares: Square[] = [];

      discard: HTMLCollectionOf<Element>;

      isOccupiedByOpposite(id: string, x: number, y: number) {
        let occupies = this.whatOccupies(x, y);

        if (occupies) {
          var occupier = occupies.getId();
        }

        if (occupies && occupier[0] !== id[0]) {
          return true;
        } else {
          return false;
        }
      }

      allowDrop(event) {
        console.log("allowDrop");
        event.preventDefault();
      }

      getCurrentUserIndex() {
        return this.receivedBoard.getUsers()[0].getIsCurrentUser()? 0 : 1;
      }

      getCurrentUserColor() {
        return this.receivedBoard.getUsers()[this.getCurrentUserIndex()].getColor();
      }

      printUserDisplay(users: User[]) {
        let user1Div = document.getElementsByClassName("user-1");
        let user2Div = document.getElementsByClassName("user-2");
        let user1Child = <HTMLElement> user1Div[0].childNodes[0];
        let user2Child = <HTMLElement> user2Div[0].childNodes[0];
      
        user1Child.innerHTML = (users[0].getIsCurrentUser()? "CURRENT - ": "") + users[0].getName() + " playing " + users[0].getColor() + " pieces";
        user2Child.innerHTML = (users[1].getIsCurrentUser()? "CURRENT - ": "") + users[1].getName() + " playing " + users[1].getColor() + " pieces"; 

      }

      createPiece(x: number, y: number, color: string, piece: string) {
      
            let newLocation = new Location(x, y);

            let id = '';
            let src = '';

            if (piece != '') {
                id = color + piece + x;
            }

            if (piece != '') {
                src = this.chessImagePath + color + piece + this.chessImageExtension;
            }

            let newOccupant = new Occupant(id, src);

            var firstColor = 'square brownSquare';
            var secondColor = 'square whiteSquare';

            this.squares.push(new Square(newLocation, newOccupant, (((x+y) % 2 == 0) ? firstColor : secondColor)));
            
            return;
        }

      createBoard(){
        console.log("Create Board called");

        var x: number = 1,
            y: number = 1;
  
        for (var i=0;i<64;i++) {

          this.createSquareElement(i, x, y);
         
          // Iterate x and see if a new row is reached
          x++;
          if ((i+1) % 8 == 0) {
            x = 1;
            y++;
          }

        }

          return this.squares;
        }
    
      flipBoard(brd: Board){
        console.log("Flip Board called");

        var flippedSquares: Square[] = [];

        for(let i = 63; i >=0; i--) {
            
            // New X and Y location needs to be 9 - current
            // For top row pieces they end up on bottom row, e.g. 9 - 1 = 8 
            this.squares[i].getLocation().setX(9 - this.squares[i].getLocation().getX());
            this.squares[i].getLocation().setY(9 - this.squares[i].getLocation().getY());
            
            flippedSquares.push(this.squares[i]);

        }

        // Toggle pawn directions

        let whitePawnMoves = brd.getInitialMoves().get('wP');
        let blackPawnMoves = brd.getInitialMoves().get('bP');

        brd.setInitialMove('wP', blackPawnMoves);
        brd.setInitialMove('bP', whitePawnMoves);

        this.receivedSquaresChange.emit(flippedSquares);

        this.receivedInitialMovesChange.emit(brd.getInitialMoves());

        this.squares = flippedSquares;

        return flippedSquares;
      }
     
    
      createSquareElement(i: number, x: number, y: number) {
  
        let color = '';
      
        if (this.game === "CHESS") {
      
                if (y < 3) {
                    color = 'b';
                } else if (y > 6) {
                    color = 'w';
                } 
        
              if (color != '') {
                if (y === 2 || y === 7) {
                  this.createPiece(x, y, color, 'P');
                } else if (x === 1 || x === 8) {
                  this.createPiece(x, y, color, 'R');
                } else if (x === 2 || x === 7) {
                  this.createPiece(x, y, color, 'N');
                } else if (x === 3 || x === 6) {
                  this.createPiece(x, y, color, 'B');
                } else if (x === 4) {
                  this.createPiece(x, y, color, 'Q');
                } else if (x === 5) {
                  this.createPiece(x, y, color, 'K');
                } 
              } else {
                this.createPiece(x, y, color, '');
              }
      
        }
      
        return;
      }
    
      
      drag(ev) {
        console.log("drag");
        ev.dataTransfer.setData("text", ev.target.id);
        if (this.isMovable(ev)) {
            this.highlightAvailableMoves(ev, ev.target.id);
        } else {
          console.log("Select another piece");
          return;
        }
      }
      
      isMovable(ev) {
          console.log("isMovable");
        // Ensure the piece in question's color matches the current user's color
        if ((this.getCurrentUserColor() === "White" && ev.target.id.match('b')) || 
            (this.getCurrentUserColor() === "Black" && ev.target.id.match('w'))) {

            let index = this.lookupByID(ev.target.id);

            this.receivedBoard.setOriginalSquareId(this.receivedBoard.getSquares()[index].getOccupant().getId());

            // If index not already in highlighted array, add it
            if (this.receivedBoard.getCurrentHighlights()[this.receivedBoard.getCurrentHighlights().length -1] != index) {
              this.receivedBoard.addCurrentHighlight(index);
              this.receivedBoard.getSquares()[index].setClass('square yellowSquare');
            }

            this.receivedSquaresChange.emit(this.receivedBoard.getSquares());
            this.receivedHighlightsChange.emit(this.receivedBoard.getCurrentHighlights());

            console.log("false");
            return false;
        } else {
          console.log("true");
          this.receivedBoard.setOriginalSquareId(ev.target.id);
          return true;
        }
      
        
      }
      
      clearCaution(ev) {
        this.unhighlight(ev);
      }

      getXYFromNet(netX: number, netY: number) {

        var tempX = netX - (1349/2);

        if (tempX > -1 && tempX < 79) {
          tempX = 5;
        } else if (tempX > 79 && tempX < 159) {
          tempX = 6;
        } else if (tempX > 159 && tempX < 239) {
          tempX = 7;
        } else if (tempX > 239 && tempX < 319) {
          tempX = 8;
        } else if (tempX > -321 && tempX < -241) {
          tempX = 1;
        } else if (tempX > -241 && tempX < -161) {
          tempX = 2;
        } else if (tempX > -161 && tempX < -81) {
          tempX = 3;
        } else if (tempX > -81 && tempX < -1) {
          tempX = 4;
        }
        let newX = tempX;
        let newY = Math.ceil(netY / 80);
        return new Location(newX, newY);
      }

      // TO-DO: replace with hash map lookup
        lookupByID(id: string) {
            for (let i=0;i<this.receivedBoard.getSquares().length;i++) {
                if (this.receivedBoard.getSquares()[i].getOccupant().getId() === id) {
                    return i;
                }
            }
        }
  
         // TO-DO: replace with hash map lookup
        lookupByNetXY(netX: number, netY: number) {
            let match = '';
            let coords = this.getXYFromNet(netX, netY);
        
            for (let i=0;i<this.receivedBoard.getSquares().length;i++) {
            if (this.receivedBoard.getSquares()[i].getLocation().getX() === coords.getX() && 
                    (this.receivedBoard.getSquares()[i].getLocation().getY() === coords.getY())) {
                    return i;
                }
            }
        }

      highlightAvailableMoves(ev, idtemp: string) {

        console.log("Highlight");
        
        let originalSquareIndex = this.lookupByID(idtemp);

        let originalSquare: Square = this.receivedBoard.getSquares()[originalSquareIndex];
        let x = originalSquare.getLocation().getX();
        let y = originalSquare.getLocation().getY();
      
        // start at original square, and depending on piece type move in all directions until another piece
        // or the edge of the board is reached

        var id = idtemp;
      
        let currentPiece = id[1];
      
        if (currentPiece === 'P') {
          currentPiece = id[0] + id[1];
        }
      
          let arr = [];
      
          let aMap = new Map();
      
          arr.push([x, y]);
      
          this.iterations = this.receivedBoard.getNumMoves().get(id[1]);
          
          // Add special logic to reassign value for pawns
          if (currentPiece.length === 2 && currentPiece[1] === 'P') {
            this.iterations = this.receivedBoard.getPawnMoves().get(id);
          }

          aMap = this.fillInitial(arr, currentPiece, id);

          if (this.iterations > 1) {

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
      
          // iterate over keys
          for (let moves of aMap.keys()) {
            for (let i = 0; i < aMap.get(moves).length; i++) {
              arr.push(aMap.get(moves)[i]);
            } 
          }
          
          let temp_arr = [];
          
          for (let i=0;i<arr.length;i++) {
              let occupies = this.whatOccupies(arr[i][0], arr[i][1]);

              let oppositeColorMove = this.isOccupiedByOpposite(id, arr[i][0], arr[i][1]);

              // var occupier = '';
              // if (occupies) {
              //     occupier = occupies.getId();
              // }
              // If the square isn't occupied OR if the occupying piece isn't the same color, the square can be highlighted
              // if (!occupies || 
              //     (this.whatOccupies(arr[i][0], arr[i][1]) && !(occupier.match(this.getCurrentUserColor()[0].toLowerCase()))))
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

                if (this.isOccupiedByOpposite(id,newArr[i][0], newArr[i][1])) {
                  temp_arr.push([newArr[i][0], newArr[i][1]]);
                }

              }

          }
          
          arr = temp_arr;

          this.ind_arr = [];
      
          // Get the 0-63 index from the x/y coords
          for (let i=0;i<arr.length; i++) {
            this.ind_arr.push(this.convertXYToI(arr[i][0], arr[i][1]));
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
             
          this.receivedSquaresChange.emit(this.receivedBoard.getSquares());
          this.receivedHighlightsChange.emit(this.receivedBoard.getCurrentHighlights());
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
          
          this.receivedSquaresChange.emit(this.receivedBoard.getSquares());
          this.receivedHighlightsChange.emit(this.receivedBoard.getCurrentHighlights());
          
        }

          inRangeExclusive(i: number, min: number, max: number) {
            return (i > min && i < max)? true : false;
          }
          
          inRangeInclusive(i: number, min: number, max: number) {
            return (i >= min && i <= max)? true : false;
          }
          
          // Ensure x,y coords are on the 8x8 board
          validCoords(x: number, y: number) {
            return (this.inRangeExclusive(x, 0, 9) && this.inRangeExclusive(y, 0, 9)) ? true : false;
          }
          
          printMove(ev, originalSquare: Square, originalPiece: string, capturedPiece: string) {
    
            if (this.receivedBoard.getUsers()[0].getIsCurrentUser()) {
              this.userMoveDiv = document.getElementsByClassName("user-1-last-move");
            } else {
              this.userMoveDiv = document.getElementsByClassName("user-2-last-move");
            }
          
            let netX = Math.abs(ev.pageX  - ev.offsetX);
            let netY = Math.abs(ev.pageY - ev.offsetY);
          
            let coords = this.getXYFromNet(netX, netY);
          
            this.userMoveDiv[0].childNodes[0].innerHTML = "Last Move: " + this.getCurrentUserColor() + " " 
              // Use board.types hash map to lookup full name for piece based on initial in image name
              + this.receivedBoard.getTypes().get(originalPiece[1])
              + " from <br>(" + originalSquare.getLocation().getX() + ", " + originalSquare.getLocation().getY() + ") to (" 
              + coords.getX() + ", " + coords.getY() + ")";
            
            // If piece is captured, add that to HTML
            if(capturedPiece!='') {
              this.userMoveDiv[0].childNodes[0].innerHTML += "<br>Captured: " 
              + (this.getCurrentUserColor()==="White"? "Black" : "White")
              + " " + this.receivedBoard.getTypes().get(capturedPiece[1]);
            }
            
          }

          fillInitial(arr: number[], currentPiece: string, id: string) {

            let newMap = new Map();

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
          
                      // If both are in the range of valid coords and aren't the starting square, add to array
                      if (this.inRangeExclusive(i, 0, 9) && this.inRangeExclusive(j, 0, 9) && !(i === popped[0] && j === popped[1])) {
                        newMap.set(index, [[i,j]]);
                      }
                      // Increment index only if not on starting square
                      if (!(i === popped[0] && j === popped[1])) {
                        index++;
                      }
                  }
              }
              
              // Before extending to check additional moves, eliminate invalid piece moves to not continue down that path
            
              // For the number of initial moves allowed for this piece, 
              for(let i = 0; i < this.receivedBoard.getInitialMoves().get(currentPiece).length ; i++) {
                // Must check to see if value is defined before setting to temp Map
                if (newMap.get(validMoves[i])) {
                  // For pawns, at this point only straightforward moves are considered,
                  // so if a square is already occupied it shouldnt' be included as a possible move
                    if (id[1] === "P") {

                      let occupied = this.whatOccupies(newMap.get(validMoves[i])[0][0], newMap.get(validMoves[i])[0][1]);

                      if (!occupied) {
                        tempMap.set(validMoves[i], newMap.get(validMoves[i]));
                      } 
                    } else {  // not pawn so always execute
                      tempMap.set(validMoves[i], newMap.get(validMoves[i]));
                    }
                }
              }
            }

            } else {
              let validKnightMoves: number[][] = this.receivedBoard.getKnightMoves();

              let popped = arr.pop();

              for (let i=0; i<validKnightMoves.length; i++) {
                if (this.inRangeExclusive(popped[0]+validKnightMoves[i][0], 0, 9) && this.inRangeExclusive(popped[1]+validKnightMoves[i][1], 0, 9)) {
                  newMap.set(i, [[popped[0]+validKnightMoves[i][0],popped[1]+validKnightMoves[i][1]]]);
                }
              }

              for (let moves of newMap.keys()) {
                let occupied = this.whatOccupies(newMap.get(moves)[0][0], newMap.get(moves)[0][1]);

                let oppositeColorMove = this.isOccupiedByOpposite(id, newMap.get(moves)[0][0], newMap.get(moves)[0][1]);

                if (!occupied || (oppositeColorMove) ) {
                    tempMap.set(moves, newMap.get(moves));
                }

              }
             
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
        
                    let newX = aMap.get(key)[0][0];
                    let newY = aMap.get(key)[0][1];

                    // Set the starting square for this direction in the map to be returned before iterating
                    // in that direction

                    let oppositeColorMove = this.isOccupiedByOpposite(id, newX, newY);

                    let occupied = this.whatOccupies(newX, newY);
                    
                    if(occupied) {
                      if (oppositeColorMove) {
                        moveArray.push([newX, newY]);
                      } 
                      flag = true;    
                    } else {
                      moveArray.push([newX, newY]);
                    }
        
                    // From key, get the direction as a letter e.g. for 1, directions.get[1] = 'N'
                    let newKey = this.receivedBoard.getDirections().get(key);
        
                    // From letter, lookup the direction changes 
                    //e.g. for 'N', dirChanges.get('N') = [0, -1] (no x change, up one)
                    let coords = this.receivedBoard.getDirChanges().get(newKey);
        
                    while(!flag) {
        
                        // This logic will dictate that the move would be on the board,
                        // and that the space is either unoccupied or is occupied with an opposite color piece
        
                        // If the space is occupied with an opposite color piece, the move is still valid 
                        // but the flag should be set to terminate further moves in that direction

                        let oppositeColorMove = this.isOccupiedByOpposite(id, newX + coords[0], newY + coords[1]);
                        
                        let occupied = this.whatOccupies(newX + coords[0], newY + coords[1]);
                        
                        if (this.inRangeExclusive(newX + coords[0], 0, 9) && this.inRangeExclusive(newY + coords[1], 0, 9)
                            && (!occupied || 
                            oppositeColorMove)) { 

                            if (id[1] === 'P') {

                                if (occupied) {
                                  flag = true;
                                } else  {
                                  moveArray.push([newX + coords[0], newY + coords[1]]);
                                  this.iterations = 1;
                                  tempIterations--;
                                }
                                
                            } else {
      
                              // Push the new match to the array for this direction
                              moveArray.push([newX + coords[0], newY + coords[1]]);
                
                            }

                            // Since pawn moves are never lower than 1, don't need to decrement receivedBoard 
                            // in fillDirection() due to previous decrement in fillInitial()
      
                            if (oppositeColorMove || tempIterations === 0) {
                              flag = true;
                            } else {
                              // Then, rebase newX and newY for the next iteration
                              newX = newX + coords[0];
                              newY = newY + coords[1];
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

        // This function either returns the contents of a square or false if empty, so it can also be used to check 
        // whether a square is occupied or not
        whatOccupies(x: number, y: number) {
            for (let i=0;i<this.receivedBoard.getSquares().length;i++) {
            if ((this.receivedBoard.getSquares())[i].getLocation().getX() === x && 
                    (this.receivedBoard.getSquares())[i].getLocation().getY() === y) {
                return ((this.receivedBoard.getSquares())[i].getOccupant().getId() !== "")? 
                          (this.receivedBoard.getSquares())[i].getOccupant() : false;
                }   
            } 
        }

        convertXYToI(x: number, y: number) {
            // Converts x/y pair to a square index (0-63)
            return 8*(y-1) - 1 + x;
        }


      drop(ev) {

        ev.preventDefault();

        let originalSquareIndex = null,
            originalSquare: Square = null,
            newSquareIndex = null,
            newSquare: Square = null;
      
        let id = "";

        //Save captured piece data to pass to printMove()
        var capturedPiece = '';

        var capturedImage = '';

        var originalPiece = '';
      
        originalSquareIndex = this.lookupByID(this.receivedBoard.getOriginalSquareId());

        originalSquare = this.receivedBoard.getSquares()[originalSquareIndex];
      
        console.log("Original square occupant is " + originalSquare.getOccupant().getId());
      
        if ((originalSquare.getOccupant().getId().match('w') && this.getCurrentUserColor() === "Black") ||
              (originalSquare.getOccupant().getId().match('b') && this.getCurrentUserColor() === "White")) {
      
          // Return highlighted squares to their original value
          this.unhighlight(ev);
          return;
        }
        
        if (ev.currentTarget.childNodes[0]) {
          if (ev.currentTarget.childNodes[0].id != "") {
            id = ev.currentTarget.childNodes[0].id;
          }
        } 
      
          if (id !== "") {
            newSquareIndex = this.lookupByID(id);   
          } else {
            // If new square is vacant, can't lookup by ID so will need to lookup by net coordinates
            let netX = Math.abs(ev.pageX  - ev.offsetX);
            let netY = Math.abs(ev.pageY - ev.offsetY);
            newSquareIndex = this.lookupByNetXY(netX, netY);
          }
      
          newSquare = (this.receivedBoard.getSquares())[newSquareIndex];
      
          if (originalSquareIndex === newSquareIndex || originalSquareIndex === "") {
      
            // Return highlighted squares to their original value
            this.unhighlight(ev);

            // Reset original square ID
            this.receivedBoard.setOriginalSquareId('');

            return;
          }
      
          let isValid = false;
      
          
          // if newSquare's coordinates are in the highlighted array, set isValid to true
          for (var i = 0; i < this.receivedBoard.getCurrentHighlights().length; i++) {
            if ( this.receivedBoard.getCurrentHighlights()[i] === this.convertXYToI(newSquare.getLocation().getX(), newSquare.getLocation().getY())) {
              isValid = true;
            }
            
          }
          // if (isValid === false) {
          //   // Play sound effect
          //   var sound = new Howl({
          //     src: ['assets/audio/buzzer.mp3']
          //   });
            
          //   console.log("buzz!");
          //   sound.play();
          // } 
      
          if (isValid === true) {
            
            capturedPiece = this.receivedBoard.getSquares()[newSquareIndex].getOccupant().getId();

            capturedImage = this.receivedBoard.getSquares()[newSquareIndex].getOccupant().getSrc();

            originalPiece = this.receivedBoard.getSquares()[originalSquareIndex].getOccupant().getId();
      
            // Assign new coordinates to original square
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
      
            // Return highlighted squares to their original value
            this.unhighlight(ev);
          } else {

            // Play sound effect
            var sound = new Howl({
              src: ['assets/audio/buzzer.mp3']
            });
            
            console.log("buzz!");
            sound.play();
      
            // Return highlighted squares to their original value
            this.unhighlight(ev);
            return;
          }
      
        // If there is an existing image:
        if (capturedImage != "") {

           // Play sound effect
            var sound = new Howl({
              src: ['assets/audio/ring.wav']
            });
            
            console.log("ring!");
            sound.play();
  
          // Based on color of old image, assign to appropriate div
          if(capturedImage.match('w')) {
            this.discard = document.getElementsByClassName("white-discards");
            this.receivedBoard.setWhiteDiscards(capturedImage);
          } else {
            this.discard = document.getElementsByClassName("black-discards");
            this.receivedBoard.setBlackDiscards(capturedImage);
          }
      
        } 
   
        // Print last move
        this.printMove(ev, originalSquare, originalPiece, capturedPiece);

        this.receivedBoard.toggleIsCurrentUser();
      
        // Print user display
        this.printUserDisplay(this.receivedBoard.getUsers());

        // Decrement pawn moves if applicable; can set to 1 without checking here
        if (this.receivedBoard.getOriginalSquareId().match('P')) {
            this.receivedBoard.setPawnMoves(this.receivedBoard.getOriginalSquareId(), 1);
        }

        // Reset original square index
        this.receivedBoard.setOriginalSquareId("");

        // Emit changes to parent component
        this.receivedSquaresChange.emit(this.receivedBoard.getSquares());
        this.receivedHighlightsChange.emit(this.receivedBoard.getCurrentHighlights());

        // Check for check?

      }

    }