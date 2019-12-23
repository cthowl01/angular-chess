export class Location {
    constructor(private x: number, private y: number) {
      this.x = x;
      this.y = y;
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    setX(x) {
      this.x = x;
    }

    setY(y) {
      this.y = y;
    }
  }

  export default Location;