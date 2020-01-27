import { Location } from './models/Location'
import { Square } from './models/Square'
import { User } from './models/User'
import Board from './models/Board'
import Utils from './utils'

export default class Display {

      static printMove(ev, receivedBoard, originalSquare: Square, originalPiece: string, capturedPiece: string) {

        let userMoveDiv = (receivedBoard.getUsers()[0].getIsCurrentUser()) ? 
        document.getElementsByClassName("user-1-last-move") : document.getElementsByClassName("user-2-last-move");

        let netLocation:Location = new Location(Math.abs(ev.pageX  - ev.offsetX), 
                                                Math.abs(ev.pageY - ev.offsetY));
        let coords = Utils.getXYFromNet(netLocation.getX(), netLocation.getY());
      
        let userChild = <HTMLElement> userMoveDiv[0].childNodes[0];
        userChild.innerHTML = "Last Move: " + 
        Utils.getCurrentUserColor(receivedBoard.getUsers()) + " " 
          // Use board.types hash map to lookup full name for piece based on initial in image name
          + receivedBoard.getTypes().get(originalPiece[1])
          + " from <br>(" + originalSquare.getLocation().getX() + ", " + originalSquare.getLocation().getY() + ") to (" 
          + coords.getX() + ", " + coords.getY() + ")";
        
        if(capturedPiece!='') {
          userChild.innerHTML += "<br>Captured: " 
          + ((Utils.getCurrentUserColor(receivedBoard.getUsers())==="Black") ? 
                ((receivedBoard.getGame() === "Chess") ? "White" : "Red") : "Black") + " " + 
                receivedBoard.getTypes().get(capturedPiece[1]);
        }
      }

      static printUserDisplay(users: User[]) {
        let user1Div = document.getElementsByClassName("user-1");
        let user2Div = document.getElementsByClassName("user-2");
        let user1Child = <HTMLElement> user1Div[0].childNodes[0];
        let user2Child = <HTMLElement> user2Div[0].childNodes[0];
        user1Child.innerHTML = (users[0].getIsCurrentUser()? "CURRENT:<br>": "") + users[0].getName() + " playing " + users[0].getColor() + " pieces";
        user2Child.innerHTML = (users[1].getIsCurrentUser()? "CURRENT:<br>": "") + users[1].getName() + " playing " + users[1].getColor() + " pieces"; 
        return;
      }

}