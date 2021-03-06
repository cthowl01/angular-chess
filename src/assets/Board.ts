import Square from '../assets/Square';
import User from '../assets/User';

export class Board {
    constructor(private types?: Map<string, string>, 
      private numMoves?: Map<string, number>, 
      private directions?: Map<number, string>,
      private dirChanges?: Map<string, number[]>,
      private initialMoves?: Map<string, number[]>,
      private pawnMoves?: Map<string, number>,
      private knightMoves?: number[][],
      private squares?: Square[],
      private currentHighlights?: number[],
      private users?: User[],
      private originalSquareId?: string,
      private whiteDiscards?: string[],
      private blackDiscards?: string[]) {
      this.types = new Map([[ 'K', 'King' ],[ 'Q', 'Queen' ], [ 'B', 'Bishop' ], [ 'N', 'Knight' ], 
                            [ 'R', 'Rook' ], [ 'P', 'Pawn' ]]);
  
      this.numMoves = new Map([[ 'K', 1 ],[ 'Q', 7 ], [ 'B', 7 ], [ 'N', 1 ], 
                            [ 'R', 7 ], [ 'P', 1 ]]);
  
      this.directions = new Map([[ 0, "NW" ], [ 1, "N" ], [ 2, "NE" ], [ 3, "W" ], 
                                 [ 4, "E" ], [ 5, "SW" ], [ 6, "S" ], [ 7, "SE" ]]);
  
      this.dirChanges = new Map([["NW", [-1, -1] ], [ "N", [0, -1] ], [ "NE", [1, -1] ], [ "W", [-1, 0] ], 
                                [ "E", [1, 0] ], [ "SW", [-1, 1] ], [ "S", [0, 1] ], [ "SE", [1, 1] ]]);
  
      this.initialMoves = new Map([ ['K', [0,1,2,3,4,5,6,7]], ['Q', [0,1,2,3,4,5,6,7]], 
                                  ['R', [1,3,4,6]], ['B', [0,2,5,7]], ['wP', [1]], ['bP', [6]] ]);
  
      this.pawnMoves = new Map([ ['wP1', 2], ['wP2', 2], ['wP3', 2], ['wP4', 2], 
                                  ['wP5', 2], ['wP6', 2], ['wP7', 2], ['wP8', 2],         
                                  ['bP1', 2], ['bP2', 2], ['bP3', 2], ['bP4', 2],
                                  ['bP5', 2], ['bP6', 2], ['bP7', 2], ['bP8', 2] ]);
      this.knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2],
                          [1, -2], [1, 2], [2, -1], [2, 1]  ];
      this.squares = [];
      this.currentHighlights = [];
      this.users = [ (new User("Chris", "White", true)), (new User("Danielle", "Black", false))];
      this.originalSquareId = "";
      this.whiteDiscards = [];
      this.blackDiscards = [];
    }

    getDirChanges() {
      return this.dirChanges;
    }

    getDirections() {
      return this.directions;
    }

    getSquares() {
      return this.squares;
    }

    getInitialMoves() {
      return this.initialMoves;
    }

    getPawnMoves() {
      return this.pawnMoves;
    }

    getKnightMoves() {
      return this.knightMoves;
    }

    getNumMoves() {
      return this.numMoves;
    }

    getTypes() {
      return this.types;
    }

    getUsers() {
      return this.users;
    }

    getOriginalSquareId() {
      return this.originalSquareId;
    }

    getWhiteDiscards() {
      return this.whiteDiscards;
    }

    getBlackDiscards() {
      return this.blackDiscards;
    }

    setSquares(squares: Square[]) {
      this.squares = squares;
    }

    addSquare(sq: Square) {
      this.squares.push(sq);
    }

    getCurrentHighlights() {
      return this.currentHighlights;
    }

    addCurrentHighlight(index: number) {
      this.currentHighlights.push(index);
    }

    setUser(i: number, user: User) {
      this.users[i] = user;
    }

    setInitialMove(id: string, moves: number[]) {
      this.initialMoves.set(id, moves);
    }

    setAllInitialMoves(moves: Map<string, number[]>) {
      this.initialMoves = moves;
    }

    setPawnMoves(id: string, moves: number) {
      this.pawnMoves.set(id, moves);
    }

    toggleIsCurrentUser() {
      for (let i=0; i<2; i++) {
        this.users[i].setIsCurrent(!this.users[i].getIsCurrentUser());
      }
    }

    setOriginalSquareId(id: string) {
      this.originalSquareId = id;
    }

    setCurrentHighlights(highlights: number[]) {
      this.currentHighlights = highlights;
    }

    setWhiteDiscards(img: string) {
      this.getWhiteDiscards().push(img);
    }

    setBlackDiscards(img: string) {
      this.getBlackDiscards().push(img);
    }
  }

  export default Board;