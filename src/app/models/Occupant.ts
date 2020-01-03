export class Occupant {
    constructor(private id?: string, private src?: string) {
      this.id = id;
      this.src = src;
    }

    getId() {
        return this.id;
    }

    getSrc() {
        return this.src;
    }

    setId(id: string) {
        this.id = id;
    }

    setSrc(src: string) {
        this.src = src;
    }

  }

  export default Occupant;