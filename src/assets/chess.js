// import User from './User';
// import Location from './Location';
// import Square from './Square';

class Board {
  constructor() {
    this.types = new Map([[ 'K', 'King' ],[ 'Q', 'Queen' ], [ 'B', 'Bishop' ], [ 'N', 'Knight' ], 
                          [ 'R', 'Rook' ], [ 'P', 'Pawn' ]]);

    // In TypeScript:
    //
    // enum Types { K = 'King', Q = 'Queen', B = 'Bishop', 
    //            N = 'Knight', R = 'Rook', P = 'Pawn'};
    //
    // type = Types.K;
    //
    // Instead of using board.types hash map to lookup 
    // full name for piece based on initial in image name:
    //
    // board.types.get(id[1])
    //
    // Would need to get the enum "key" and then use it to find 
    // correct type:
    //
    // key - get(id[1]);
    // type = Types.key;

    this.numMoves = new Map([[ 'K', 1 ],[ 'Q', 7 ], [ 'B', 7 ], [ 'N', 2 ], 
                          [ 'R', 7 ], [ 'P', 1 ]]);

    this.directions = new Map([[ 0, "NW" ], [ 1, "N" ], [ 2, "NE" ], [ 3, "W" ], 
                               [ 4, "E" ], [ 5, "SW" ], [ 6, "S" ], [ 7, "SE" ]]);

    this.dirChanges = new Map([["NW", [-1, -1] ], [ "N", [0, -1] ], [ "NE", [1, -1] ], [ "W", [-1, 0] ], 
                              [ "E", [1, 0] ], [ "SW", [-1, 1] ], [ "S", [0, 1] ], [ "SE", [1, 1] ]]);

    this.initialMoves = new Map([ ['K', [0,1,2,3,4,5,6,7]], ['Q', [0,1,2,3,4,5,6,7]], 
                                ['R', [1,3,4,6]], ['B', [0,2,5,7]], ['wP', [1]], ['bP', [6]] ]);

    this.squares = [];
    // this.squares = new Map();
    // this.squares = new TwoWayMap();
  }
}


// class Location {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }
// }

// TypeScript:
//
// constructor(x: number, y: number)

// class Square {
//   constructor(piece, location) {
//     this.occupant = piece;
//     this.location = location;
//   }
// }

// class User {
//   constructor(name, color) {
//     this.name = name;
//     this.color = color;
//   }
// }


// // From StackOverflow:
// class TwoWayMap {
//   constructor(map) {
//      this.map = map;
//      this.reverseMap = {};
//      for(let key in map) {
//         const value = map[key];
//         this.reverseMap[value] = key;   
//      }
//   }
//   get(key) { return this.map[key]; }
//   revGet(key) { return this.reverseMap[key]; }
// }

// Used to track highlighted squares in order to revert
let ind_arr = [],
    highlighted = [];

let originalCautionClassName = "";

const chessImagePath = checkersImagePath = "img/";

const chessImageExtension = checkersImageExtension = ".png";

const game = "CHESS";

let user1 = new User("Chris", "White");
let user2 = new User("Danielle", "Black");

let currentUser = user1;

let iterations = '';

let board = new Board();


function printUserDisplay() {
  let user1Div = document.getElementsByClassName("user-1");
  let user2Div = document.getElementsByClassName("user-2");
  user1Div[0].childNodes[0].innerHTML = (currentUser === user1? "CURRENT - ": "") + user1.name + " playing " + user1.color + " pieces";
  user2Div[0].childNodes[0].innerHTML = (currentUser === user2? "CURRENT - ": "") + user2.name + " playing " + user2.color + " pieces";
}

function inRangeExclusive(i, min, max) {
  return (i > min && i < max)? true : false;
}

// Using arrow function and types:
//
// let inRangeExclusive = (i: number, min: number, max: number) 
//    => (i > min && i < max)? true : false;

function inRangeInclusive(i, min, max) {
  return (i >= min && i <= max)? true : false;
}

// Ensure x,y coords are on the 8x8 board
function validCoords(x,y) {
  return (inRangeExclusive(x, 0, 9) && inRangeExclusive(y, 0, 9)) ? true : false;
}

function printMove(ev, originalSquare, capturedPiece) {

  let userMoveDiv = '';

  if (currentUser === user1) {
    userMoveDiv = document.getElementsByClassName("user-1-last-move");
  } else {
    userMoveDiv = document.getElementsByClassName("user-2-last-move");
  }

  let netX = Math.abs(ev.pageX  - ev.currentTarget.parentElement.offsetLeft);
  let netY = Math.abs(ev.pageY - ev.currentTarget.parentElement.offsetTop);

  let coords = getXYFromNet(netX, netY);

  let id = '';

  if(ev.currentTarget.children.length != 1) {
    id = ev.currentTarget.children[1].id;
  } else {
    id = ev.currentTarget.children[0].id;
  }

  userMoveDiv[0].childNodes[0].innerHTML = "Last Move: " + currentUser.color + " " 
    // Use board.types hash map to lookup full name for piece based on initial in image name
    + board.types.get(id[1])
    + " from <br>(" + originalSquare.location.x + ", " + originalSquare.location.y + ") to (" 
    + coords.x + ", " + coords.y + ")";
  
  // If piece is captured, add that to HTML
  if(capturedPiece!='') {
    userMoveDiv[0].childNodes[0].innerHTML += "<br>Captured: " 
    + (currentUser.color==="White"? "Black" : "White")
    + " " + board.types.get(capturedPiece[1]);
  }
  
}

// TO-DO: replace with hash map lookup
function lookupByID(id) {
  for (i=0;i<board.squares.length;i++) {
    if (board.squares[i].occupant === id) {
      return i;
    }
  }
}

// TO-DO: replace with hash map lookup
function lookupByNetXY(netX, netY) {
  let match = '';
  let coords = getXYFromNet(netX, netY);

  for (i=0;i<board.squares.length;i++) {
    if (board.squares[i].location.x === coords.x && board.squares[i].location.y === coords.y) {
      return i;
    }
  }
}


function getXYFromNet(netX, netY) {
  return new Location(Math.ceil(netX / 80), Math.ceil(netY / 80));
}


// This function either returns the contents of a square or false if empty, so it can also be used to check 
// whether a square is occupied or not
function whatOccupies(x, y) {
  for (let i=0;i<board.squares.length;i++) {
    if (board.squares[i].location.x === x && board.squares[i].location.y === y) {
      return (board.squares[i].occupant !== "")? board.squares[i].occupant : false;
      }   
    } 
}


// TODO: lookup using Map instead of brute force


// function whatOccupiesMap(x, y) {

      // 

// }

function allowDrop(ev) {
  ev.preventDefault();
}


function fillInitial(arr, currentPiece) {

    let newMap = new Map();

    let validMoves = board.initialMoves.get(currentPiece);

    while (iterations > 0 && arr.length > 0) {
      let popped = arr.pop();
      
      // Use extra incrementer to increment the index even if a square is invalid
      // to keep track of which direction the move is in
      let index = 0;

      for (let j = popped[1]-1; j <= popped[1] + 1; j++) {
        for (let i = popped[0]-1;  i <= popped[0] + 1; i++) {

            // If both are in the range of valid coords and aren't the starting square, add to array
            if (inRangeExclusive(i, 0, 9) && inRangeExclusive(j, 0, 9) && !(i === popped[0] && j === popped[1])) {
              newMap.set(index, [[i,j]]);
            }
            // Increment index only if not on starting square
            if (!(i === popped[0] && j === popped[1])) {
              index++;
            }
        }
    }
    iterations -= 1;
  }

  // Before extending to check additional moves, would need to use mask to eliminate invalid piece moves to not continue down that path
  let tempMap = new Map();

  // For the number of initial moves allowed for this piece, 
  for(let i = 0; i < board.initialMoves.get(currentPiece).length ; i++) {
    // Must check to see if value is defined before setting to temp Map
    if (newMap.get(validMoves[i])) {
      tempMap.set(validMoves[i], newMap.get(validMoves[i]));
    }
  }

  // Only the initial moves that are in a valid direction based on the subject piece will be returned
  return tempMap;
}



function fillDirections(aMap, validMoves, x, y) {

  // The results for each direction will be stored in an array, and each array will be added to a map that is returned
  let dMap  = new Map();

  // Hardcoded 8 is the number of possible directions a piece could move

  for (let i=0; i < 8; i++){
      // Look at the key for each member of the Map
      let key = validMoves[i]; // e.g. for R directions[0] = 1

          // Need to ensure the direction in question was included in the fillInitial() results
          if (aMap.get(key)) {
              
            // Use flag to indicate that a dead end has been reached for this specific direction
            let flag = false;

            let newX = x,
                newY = y;

            let moveArray = [];

            // From key, get the direction as a letter
            let newKey = board.directions.get(key); // e.g. for 1, directions.get[1] = 'N'

            // From letter, lookup the direction changes
            let coords = board.dirChanges.get(newKey); // e.g. for 'N', dirChanges.get('N') = [0, -1] (no x change, up one)

            let oppositeColorMove = '';

            while(!flag) {

                // This logic will dictate that the move would be on the board,
                // and that the space is either unoccupied or is occupied with an opposite color piece

                // If the space is occupied with an opposite color piece, the move is still valid 
                // but the flag should be set to terminate further moves in that direction

                oppositeColorMove = (whatOccupies(newX + coords[0], newY + coords[1]) 
                                    && !(whatOccupies(newX + coords[0], newY + coords[1]).match(currentUser.color[0].toLowerCase())));
          
                if (inRangeExclusive(newX + coords[0], 0, 9) && inRangeExclusive(newY + coords[1], 0, 9)
                    && (!whatOccupies(newX + coords[0], newY + coords[1]) || 
                    oppositeColorMove)) { 

                      // Push the new match to the array for this direction
                      moveArray.push([newX + coords[0], newY + coords[1]]);
                      
                      // Set the key/value pair in the return map, where the value is the array containing all moves
                      // for this direction       
                      dMap.set(key, moveArray);

                      if (oppositeColorMove) {
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
           
          } // end if

  } // end for

  return dMap;
}

function highlightAvailableMoves(ev) {
  let originalSquareIndex = lookupByID(ev.dataTransfer.getData("text"));
  let originalSquare = board.squares[originalSquareIndex];
  let x = originalSquare.location.x;
  let y = originalSquare.location.y;

  // start at original square, and depending on piece type move in all directions until another piece
  // or the edge of the board is reached

  let id = ev.dataTransfer.getData("text");

  let currentPiece = id[1];

  if (currentPiece === 'P') {
    currentPiece = id[0] + id[1];
  }

  // Temporary; Check for implemented piece moves
  if (currentPiece === 'K' || currentPiece ==='R' || currentPiece ==='B' || currentPiece ==='Q'
      || currentPiece === 'wP' || currentPiece === 'bP') {

    let arr = [];

    let aMap = new Map();

    arr.push([x, y]);

    // Pass x/y coords, array, and number of spaces the piece can move

    // iterations is global
    // iterations = 1;
    iterations = board.numMoves.get(id[1]);
    aMap = fillInitial(arr, currentPiece);

    if (iterations > 0) {
        
        // directions will be the array of valid directions, e.g for 'R' it will be [1,3,4,6]
        aMap = fillDirections(aMap, board.initialMoves.get(currentPiece), x, y); 
    }

    // After all possible moves are returned, can move from a map back to an array

    // iterate over keys
    for (let moves of aMap.keys()) {
      for (let i = 0; i < aMap.get(moves).length; i++) {
        arr.push(aMap.get(moves)[i]);
      } 
    }
    
    let temp_arr = [];
    
    for (i=0;i<arr.length;i++) {
        // If the square isn't occupied OR if the occupying piece isn't the same color, the square can be highlighted
        if (!whatOccupies(arr[i][0], arr[i][1]) || 
            (whatOccupies(arr[i][0], arr[i][1]) && !(whatOccupies(arr[i][0], arr[i][1]).match(currentUser.color[0].toLowerCase()))))
          temp_arr.push(arr[i]);
    } 

    // Replace the array with the highlightable array
    arr = temp_arr;

    // Get the 0-63 index from the x/y coords
    for (let i=0;i<arr.length; i++) {
      ind_arr.push(convertXYToI(arr[i][0], arr[i][1]));
    }
    
    // Replace the original square colors with "greenSquare" in the className
    for (let i=0;i<ind_arr.length; i++) {

      let child = ev.currentTarget.parentNode.parentElement.children[ind_arr[i]];

      // Keep track of highlighted squares and their original color so they can be reverted later
      highlighted.push([ind_arr[i], child.className]);

      child.className = 'square greenSquare';
    }

    } else {
      console.log("Can't highlight yet");
    }
  }

  function unhighlight(ev) {
  
    for (i=0;i<ind_arr.length; i++) {
      let child = ev.currentTarget.parentNode.children[ind_arr[i]];
  
      // Revert to original class name to set square color back to white or brown
      child.className = highlighted[i][1];
    }
  
    // Clear these arrays used to track currenty highlighted squares
    ind_arr = [];
    highlighted = [];
    
  }


function convertXYToI(x, y) {
    // Converts x/y pair to a square index (0-63)
    return 8*(y-1) - 1 + x;
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  if (isMovable(ev)) {
    highlightAvailableMoves(ev);
  } else {
    console.log("Select another piece");
    return;
  }
}

function isMovable(ev) {
  // Ensure the piece in question's color matches the current user's color
  if ((currentUser.color === "White" && ev.target.id.match('b')) || 
      (currentUser.color === "Black" && ev.target.id.match('w'))) {
    origClassName = ev.target.className; 
    ev.target.className = "square yellowSquare";
    return false;
  }

  return true;
}

function clearCaution(ev) {
  ev.currentTarget.className = originalCautionClassName;
}

function isHighlighted(newSquare){
      for (let i = 0; i < highlighted.length; i++) {
        if (highlighted[i][0] === convertXYToI(newSquare.location.x, newSquare.location.y))
          isValid = true;
      }
}

function drop(ev) {
  ev.preventDefault();

  var data = ev.dataTransfer.getData("text");

  let originalSquareIndex = null,
      originalSquare = null,
      newSquareIndex = null,
      newSquare = null;

  let id = "";

  originalSquareIndex = lookupByID(data);
  originalSquare = board.squares[originalSquareIndex];

  console.log("Original square occupant is " + originalSquare.occupant);

  if ((originalSquare.occupant.match('w') && currentUser.color === "Black") ||
        (originalSquare.occupant.match('b') && currentUser.color === "White")) {

    // Return highlighted squares to their original value
    unhighlight(ev);
    return;
  }
  
  if (ev.currentTarget.childNodes[0]) {
    id = ev.currentTarget.childNodes[0].id;
  } 

    if (id !== "") {
      newSquareIndex = lookupByID(id);   
    } else {
      // If new square is vacant, can't lookup by ID so will need to lookup by net coordinates
      let netX = Math.abs(ev.pageX  - ev.currentTarget.parentElement.offsetLeft);
      let netY = Math.abs(ev.pageY - ev.currentTarget.parentElement.offsetTop);
      newSquareIndex = lookupByNetXY(netX, netY);
    }

    newSquare = board.squares[newSquareIndex];

    if (originalSquare === newSquare) {

      // Return highlighted squares to their original value
      unhighlight(ev);
      return;
    }

    let originalPieceColor = data[0];

    let newPieceColor = "";
    
    if (ev.currentTarget.childNodes[0]) {
      // Need to find a better way to do this
      if (ev.currentTarget.childNodes[0].id !== "") {
        newPieceColor = ev.currentTarget.childNodes[0].id[0];
      } else if (newSquare.occupant !== "") {
        newPieceColor = ev.currentTarget.childNodes[1].id[0];
      } 
    }

    let isValid = false;

    //if (data.match('R') || data.match('B') || data.match('Q') || data.match('K')) {

      if (!data.match('N')) {
      // if newSquare's coordinates are in the highlighted array, set isValid to true
      for (var i = 0; i < highlighted.length; i++) {
        if ( highlighted[i][0] === convertXYToI(newSquare.location.x, newSquare.location.y)) {
          isValid = true;
        }
      } 
    } else if (data.match('P')) {
      // Placeholder defaults to true for now

      // Make sure pawns stay on their column unless they are capturing a piece and only move one square unless it's 
      // the first move. Need to determine how to track first move or not.
      isValid = true;
    } else if (data.match('N')) {

        abs_x = Math.abs(originalSquare.location.x - newSquare.location.x);
        abs_y = Math.abs(originalSquare.location.y - newSquare.location.y);
  
        // Make sure knights move one square in one direction and two squares in another
        if (abs_x <= 2 && abs_x > 0 && abs_y <= 2 && abs_y > 0
            && (Math.abs(abs_x-abs_y) === 1)) {
          // Valid drop location
          console.log("Yep!");
          isValid = true;
        } 
    } else {
        console.log("Nope!");
    }

    // Save captured piece data to pass to printMove()
    let capturedPiece = '';

    if (isValid === true) {

      capturedPiece = board.squares[newSquareIndex].occupant;

      // Assign new coordinates to original square
      board.squares[newSquareIndex].occupant = originalSquare.occupant;

      // Empty out original square 
      board.squares[originalSquareIndex].occupant = "";

      // Return highlighted squares to their original value
      unhighlight(ev);
    } else {

      // Return highlighted squares to their original value
      unhighlight(ev);
      return;
    }

  // If piece is already here and piece is a different color, replace existing with dropped
  var oldImage = document.getElementById(ev.target.id);
  var newImage = document.getElementById(data);

  // If there is an existing image, replace it with the new one; otherwise, just add the new image
  if (oldImage != null) {
    ev.target.parentNode.replaceChild(newImage, oldImage);
    // Add old image to discard area
    var x = document.getElementsByClassName("discards");

    // Based on color of old image, assign to appropriate div
    if(oldImage.id.match('w')) {
      discard = document.getElementsByClassName("white-discards");
    } else {
      discard = document.getElementsByClassName("black-discards");
    }

    discard[0].appendChild(oldImage);
  } else {
    ev.target.appendChild(newImage);
  }

  // Print last move
  printMove(ev, originalSquare, capturedPiece);

  // Toggle current user
  if(currentUser === user1) {
    currentUser = user2;
  } else {
    currentUser = user1;
  }

  // Print user display
  printUserDisplay();
}

var createBoard = function(evt) {
  var container = document.querySelector('.container');
  var flip = false;
  var x = 1,
      y = 1;

  for (var i=0;i<64;i++) {
    // For each row, alternate between starting colors
    if (i % 8 == 0) {
      flip = !flip;
    }

    var squareElement = createSquareElement(flip, i, x, y);
    container.appendChild(squareElement);

    // Set key-value pair for location-occupant in the board.squares Map:
    // board.squares.set(new Location(x ,y), squareElement.childNodes[0].id);
    var square = new Square(squareElement.childNodes[0].id, new Location(x ,y));
    board.squares.push(square);
    x++;
    if ((i+1) % 8 == 0) {
      x = 1;
      y++;
    }
  }

  printUserDisplay();
}

var flipBoard = function(evt) {
  var container = document.querySelector('.container');

  var flippedSquares = [];

  for(var i = 63; i >=0; i--) {
    var n = container.removeChild(container.childNodes[i]);
    container.appendChild(n);
    flippedSquares[63-i]=board.squares[i];
  }

  board.squares = flippedSquares;
}

function createSquareElement(flip, i, x, y) {
  var square = document.createElement('div');

  square.setAttribute("ondrop","drop(event)");
  square.setAttribute("ondragover","allowDrop(event)");

  var initialPiece = document.createElement('img');

  if (game === "CHECKERS") {
    if ((y === 1 || y === 3) && (x % 2 === 0) || ((y === 2) && (x % 2 === 1))) {
      initialPiece.setAttribute("id","bP"+x);
      initialPiece.setAttribute("src",checkersImagePath + "black_checker.png");
    }

    if ((y === 6 || y === 8) && (x % 2 === 1) || (y === 7) && (x % 2 === 0)) {
      initialPiece.setAttribute("id","rP"+x);
      initialPiece.setAttribute("src",checkersImagePath + "red_checker.png");
    }
  }

  let color = '';

  if (game === "CHESS") {

      if (y < 3) {
        color = 'b';
      } else if (y > 6) {
        color = 'w';
      } 

      if (color) {
        if (y === 2 || y === 7) {
          initialPiece = createPiece(initialPiece, x, y, color, 'P');
        } else if (x === 1 || x === 8) {
          initialPiece = createPiece(initialPiece, x, y, color, 'R');
        } else if (x === 2 || x === 7) {
          initialPiece = createPiece(initialPiece, x, y, color, 'N');
        } else if (x === 3 || x === 6) {
          initialPiece = createPiece(initialPiece, x, y, color, 'B');
        } else if (x === 4) {
          initialPiece = createPiece(initialPiece, x, y, color, 'Q');
        } else {
          initialPiece = createPiece(initialPiece, x, y, color, 'K');
        } 
      }

  }

  initialPiece.setAttribute("draggable","true");
  initialPiece.setAttribute("ondragstart","drag(event)");
  initialPiece.setAttribute("onmouseover","isMovable(event)");
  initialPiece.setAttribute("onmouseout","clearCaution(event)");

  var firstColor = flip ? 'brownSquare':'whiteSquare';
  var secondColor = flip ? 'whiteSquare':'brownSquare';

  square.className = 'square ' + ((i % 2 == 0) ? firstColor : secondColor);

  square.appendChild(initialPiece);

  return square;
}

function createPiece(initialPiece, x, y, color, piece) {
  initialPiece.setAttribute("id",color + piece +x);
  initialPiece.setAttribute("src",chessImagePath + color + piece + chessImageExtension);
  return initialPiece;
}

var createButton = document.querySelector('#createbutton');
createButton.onclick = createBoard;

var flipButton = document.querySelector('#flipbutton');
flipButton.onclick = flipBoard;

