import { Location } from './models/Location'
import { Square } from './models/Square'
import { User } from './models/User'

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

      
        

}