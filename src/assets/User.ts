export class User {
    constructor(private name: string, private color: string, private isCurrent: boolean) {
      this.name = name;
      this.color = color;
      this.isCurrent = isCurrent;
    }

    getName(){
      return this.name;
    }

    getColor(){
      return this.color;
    }

    getIsCurrentUser(){
      return this.isCurrent;
    }

    setName(name: string){
      this.name = name;
    }

    setIsCurrent(current: boolean){
      this.isCurrent = current;
    }

  }

  export default User;