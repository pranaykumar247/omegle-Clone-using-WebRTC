import { Socket } from "socket.io";
import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1;

interface Room {
    user1: User,
    user2: User,
    // roomId: string
}

export class RoomManager {
    private rooms: Map<string, Room>
    constructor() {
        this.rooms = new Map<string, Room>()
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2,
        })


        user1.socket.emit("send-offer", {
            roomId
        })
    }


    // Now the concept of WebRTC comes

    onOffer(roomId: string, sdp:string){
        const user2 = this.rooms.get(roomId)?.user2;
        user2?.socket.emit("offer", {
            sdp,
            roomId
        })
    }

    onAnswer(roomId: string,sdp:string){
        const user1 = this.rooms.get(roomId)?.user1;
        user1?.socket.emit("answer", {
            sdp,
            roomId
        })
    }





    generate() {
        return GLOBAL_ROOM_ID++;
     }
}