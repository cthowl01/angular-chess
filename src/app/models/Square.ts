import Location from './Location';
import Occupant from './Occupant';

export class Square {

      private location: Location;
      private occupant: Occupant;
      //private className: string;

      private chessImagePath: string = "assets/img/";
      private checkersImagePath: string = "assets/img/";
      private chessImageExtension: string = ".png";
      private checkersImageExtension: string = ".png";


    // constructor(private location?: Location, private occupant?: Occupant, private className?: string) {
    //   this.location = location;
    //   this.occupant = occupant;
    //   this.className = className;
    // }

    constructor(private x?: number, private y?: number, private color?: 
            string, private piece?: string, private className?: string) {

              this.location = new Location(x, y);

              let id = '';
              let src = '';
  
              if (piece != 'C' && piece != '') {
                  id = color + piece + x;
              } else if (piece != '') {
                  id = color + piece + String((y-1)*8 + x);
              } 
  
              if (piece != 'C' && piece != '') {
                  src = this.chessImagePath + color + piece + this.chessImageExtension;
              } else if (piece != '') {
                  src = this.checkersImagePath + color + piece + this.checkersImageExtension;
              }
  
              this.occupant = new Occupant(id, src);

    }

    getLocation() {
      return this.location;
    }

    getOccupant() {
      return this.occupant;
    }

    getClassName() {
      return this.className;
    }

    setLocation(location: Location) {
      this.location = location;
    }

    setOccupant(occupant: Occupant) {
      this.occupant = occupant;
    }

    setClass(className: string) {
      this.className = className;
    }
  
  }

  export default Square;