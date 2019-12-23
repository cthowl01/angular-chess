import Location from './Location';
import Occupant from './Occupant';

export class Square {
    constructor(private location?: Location, private occupant?: Occupant, private className?: string) {
      this.location = location;
      this.occupant = occupant;
      this.className = className;
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