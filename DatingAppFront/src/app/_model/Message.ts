export interface IMessage {

    id:number;
    senderId:number;
    senderKnownAs:string;
    senderPhotoUrl:string;
    recepientId:number;
    recepientKnownAs:string;
        recipentPhotoUrl:string;
        content:string;
        isRead:boolean;
        dateRead:Date;
       messageSent:Date;


}
