import { Location } from './models/Location'
import { Square } from './models/Square'
import { User } from './models/User'
import Board from './models/Board';

export default class Utils {

    static convertXYToI(x: number, y: number) {
        // Converts x/y pair to a square index (0-63)
        return 8*(y-1) - 1 + x;
    }

    static getXYFromNet(netX: number, netY: number) {
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
        return new Location(tempX, Math.ceil(netY / 80));
      }

      static inRangeExclusive(i: number, min: number, max: number) {
        return (i > min && i < max)? true : false;
      }
      
      static inRangeInclusive(i: number, min: number, max: number) {
        return (i >= min && i <= max)? true : false;
      }
      
      // Ensure x,y coords are on the 8x8 board
      static validCoords(x: number, y: number) {
        return (this.inRangeExclusive(x, 0, 9) && this.inRangeExclusive(y, 0, 9)) ? true : false;
      }

      // TO-DO: replace with hash map lookup
      static lookupByID(id: string, squares: Square[]) {
        for (let i=0;i<squares.length;i++) {
            if (squares[i].getOccupant().getId() === id) {
                return i;
            }
        }
    }

      static getIndexFromXY(x: number, y: number, squares: Square[]) {
      for (let i=0;i<squares.length;i++) {
        if (squares[i].getLocation().getX() === x && 
                (squares[i].getLocation().getY() === y)) {
                return i;
            }
        }
      }

      static isOccupiedByOpposite(id: string, x: number, y: number, squares: Square[]) {
        let occupies = this.whatOccupies(x, y, squares);
        if (occupies) {
          var occupier = occupies.getId();
        }
        return (occupies && occupier[0] !== id[0])? true : false;
      }

      // This function either returns the contents of a square or false if empty, so it can also be used to check 
      // whether a square is occupied or not
      static whatOccupies(x: number, y: number, squares: Square[]) {
          for (let i=0;i<squares.length;i++) {
          if ((squares)[i].getLocation().getX() === x && 
                  (squares)[i].getLocation().getY() === y) {
              return ((squares)[i].getOccupant().getId() !== "")? 
                        (squares)[i].getOccupant() : false;
              }   
          } 
      }

      static getCurrentUserIndex(users: User[]) {
        return users[0].getIsCurrentUser()? 0 : 1;
      }

      static getCurrentUserColor(users: User[]) {
        return users[Utils.getCurrentUserIndex(users)].getColor();
      }

      static kingMe(receivedBoard: Board, newSquareIndex: number) {
        // Change C to D in id and in src
        let originalId = receivedBoard.getSquares()[newSquareIndex].getOccupant().getId();
        let newId = originalId.replace("C", "D");
        receivedBoard.getSquares()[newSquareIndex].getOccupant().setId(newId);
        let originalSrc = receivedBoard.getSquares()[newSquareIndex].getOccupant().getSrc();
        return originalSrc.replace("C", "D");
      }

      static flipSquares(brd: Board) {
      
        var flippedSquares: Square[] = [];

        for(let i = 63; i >=0; i--) {
            // New X and Y location needs to be 9 - current
            // For top row pieces they end up on bottom row, e.g. 9 - 1 = 8 
            brd.getSquares()[i].getLocation().setX(9 - brd.getSquares()[i].getLocation().getX());
            brd.getSquares()[i].getLocation().setY(9 - brd.getSquares()[i].getLocation().getY());
            flippedSquares.push(brd.getSquares()[i]);
        }

        brd.setSquares(flippedSquares);

        // If chess, toggle pawn directions
        // If non-kinged checkers, toggle red and black piece moves. Kinged don't need to change directions.
        brd.getGame() === "Chess" ? brd.exchangeInitialMoves('wP', 'bP') : brd.exchangeInitialMoves('rC', 'bC');
        
        return brd;
      }

      static createPiece(x: number, y: number, color: string, piece: string) {
        return new Square(x, y, color, piece, (((x+y) % 2 == 0) ? 'square brownSquare' : 'square whiteSquare'));
    }

    static createSquareElement(brd: Board, squares: Square[], x: number, y: number) {
      let color = '';   
      if (brd.getGame() === "Chess") {
        if (y < 3) {
          color = 'b';
        } else if (y > 6) {
            color = 'w';
        } 
        if (color != '') {
          if (y === 2 || y === 7) {
            squares.push(Utils.createPiece(x, y, color, 'P'));
          } else {
            squares.push(Utils.createPiece(x, y, color, brd.getInitialPiecePerX()[x-1]));
          } 
        } else {
          squares.push(Utils.createPiece(x, y, color, ''));
        }
      } else { // game = "Checkers"
          if ((y  % 2 === 1) && (x % 2 === 0) || (y % 2 === 0) && (x % 2 === 1)) {
            if (y < 4) {
              color = 'b';
            } else if (y > 5) {
              color = 'r';
            }
          }          
          if (color != '') {
            squares.push(Utils.createPiece(x, y, color, 'C'));
          } else {
            squares.push(Utils.createPiece(x, y, color, ''));
          }
      }
      return squares;
    }

    static incrementBoardSquare(location: Location, i: number) {
      // Iterate x and see if a new row is reached
      location.setX(location.getX()+1);
      if ((i+1) % 8 == 0) {
        location.setX(1);
        location.setY(location.getY()+1);
      }
      
      return location
    }

    static fillInitialKnightMoves(arr: number[], receivedBoard: Board, id: string, tempMap) {
      let validKnightMoves: number[][] = receivedBoard.getKnightMoves();
      let popped = arr.pop();

      for (let i=0; i<validKnightMoves.length; i++) {
        if (Utils.inRangeExclusive(popped[0]+validKnightMoves[i][0], 0, 9) 
          && Utils.inRangeExclusive(popped[1]+validKnightMoves[i][1], 0, 9)) {

            let occupied = Utils.whatOccupies(popped[0]+validKnightMoves[i][0], 
                                              popped[1]+validKnightMoves[i][1],
                                              receivedBoard.getSquares());
            let oppositeColorMove = Utils.isOccupiedByOpposite(id, 
              popped[0]+validKnightMoves[i][0], popped[1]+validKnightMoves[i][1],
                                                  receivedBoard.getSquares());

            if (!occupied || (oppositeColorMove) ) {
                tempMap.set(i, [[popped[0]+validKnightMoves[i][0], popped[1]+validKnightMoves[i][1]]]);
            }              
        }
      }   
      return tempMap;  
    }

}