import Square from './Square';
import User from './User';

export class Board {
    constructor(private game?: string,
      private types?: Map<string, string>, 
      private numMoves?: Map<string, number>, 
      private directions?: Map<number, string>,
      private dirChanges?: Map<string, number[]>,
      private initialMoves?: Map<string, number[]>,
      private pawnMoves?: Map<string, number>,
      private checkerPieces?: Map<string, number>,
      private knightMoves?: number[][],
      private squares?: Square[],
      private currentHighlights?: number[],
      private users?: User[],
      private originalSquareId?: string,
      private firstDiscards?: string[],
      private secondDiscards?: string[]
      ) {
      this.game = "Chess";
      this.types = new Map([[ 'K', 'King' ],[ 'Q', 'Queen' ], [ 'B', 'Bishop' ], [ 'N', 'Knight' ], 
                            [ 'R', 'Rook' ], [ 'P', 'Pawn' ], [ 'C', 'Checker' ]]);
  
      this.numMoves = new Map([[ 'K', 1 ],[ 'Q', 7 ], [ 'B', 7 ], [ 'N', 1 ], 
                            [ 'R', 7 ], [ 'P', 1 ], [ 'C', 1 ], [ 'D', 1 ]]);
  
      this.directions = new Map([[ 0, "NW" ], [ 1, "N" ], [ 2, "NE" ], [ 3, "W" ], 
                                 [ 4, "E" ], [ 5, "SW" ], [ 6, "S" ], [ 7, "SE" ]]);
  
      this.dirChanges = new Map([["NW", [-1, -1] ], [ "N", [0, -1] ], [ "NE", [1, -1] ], [ "W", [-1, 0] ], 
                                [ "E", [1, 0] ], [ "SW", [-1, 1] ], [ "S", [0, 1] ], [ "SE", [1, 1] ]]);
  
      this.initialMoves = new Map([ ['K', [0,1,2,3,4,5,6,7]], ['Q', [0,1,2,3,4,5,6,7]], 
                                  ['R', [1,3,4,6]], ['B', [0,2,5,7]], ['wP', [1]], ['bP', [6]] 
                                  , ['rC', [0,2]], ['bC', [5,7]], 
                                  ['rD', [0,2,5,7]], ['bD', [0,2,5,7]]]);
  
      this.pawnMoves = new Map([ ['wP1', 2], ['wP2', 2], ['wP3', 2], ['wP4', 2], 
                                  ['wP5', 2], ['wP6', 2], ['wP7', 2], ['wP8', 2],         
                                  ['bP1', 2], ['bP2', 2], ['bP3', 2], ['bP4', 2],
                                  ['bP5', 2], ['bP6', 2], ['bP7', 2], ['bP8', 2] ]);

      this.checkerPieces = new Map([ ['bC2', 1], ['bC4', 1], ['bC6', 1], ['bC8', 1],
                                     ['bC9', 1], ['bC11', 1], ['bC13', 1], ['bC15', 1],
                                     ['bC18', 1], ['bC20', 1], ['bC22', 1], ['bC24', 1],
                                     ['rC41', 1], ['rC43', 1], ['rC45', 1], ['rC47', 1], 
                                     ['rC50', 1], ['rC52', 1], ['rC54', 1], ['rC56', 1], 
                                     ['rC57', 1], ['rC59', 1], ['rC61', 1], ['rC63', 1],
                                     ['bD2', 1], ['bD4', 1], ['bD6', 1], ['bD8', 1],
                                     ['bD9', 1], ['bD11', 1], ['bD13', 1], ['bD15', 1],
                                     ['bD18', 1], ['bD20', 1], ['bD22', 1], ['bD24', 1],
                                     ['rD41', 1], ['rD43', 1], ['rD45', 1], ['rD47', 1], 
                                     ['rD50', 1], ['rD52', 1], ['rD54', 1], ['rD56', 1], 
                                     ['rD57', 1], ['rD59', 1], ['rD61', 1], ['rD63', 1]] );  
      this.knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2],
                          [1, -2], [1, 2], [2, -1], [2, 1]  ];
      this.squares = [];
      this.currentHighlights = [];
      this.users = [ (new User("Chris", "White", true)), (new User("Danielle", "Black", false))];
      this.originalSquareId = "";
      this.firstDiscards = [];
      this.secondDiscards = [];
    }

    getGame() {
      return this.game;
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

    getCheckerPieces() {
      return this.checkerPieces;
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

    getFirstDiscards() {
      return this.firstDiscards;
    }

    getSecondDiscards() {
      return this.secondDiscards;
    }

    setGame(game) {
      this.game = game;
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

    setFirstDiscards(img: string) {
      this.getFirstDiscards().push(img);
    }

    setSecondDiscards(img: string) {
      this.getSecondDiscards().push(img);
    }

    exchangeInitialMoves(firstPiece: string, secondPiece: string) {
      let moveTemp = this.getInitialMoves().get(firstPiece);
      this.setInitialMove(firstPiece, this.getInitialMoves().get(secondPiece));
      this.setInitialMove(secondPiece, moveTemp);
    }

  }

  export default Board;