import Room from "./room.model.js";

export const createRoom = (room) => new Room(room).save();
export const createManyRoom = (roomArray) => Room.insertMany(roomArray);
export const updateRoom = (_id, room) => Room.updateOne({ _id }, room);
export const getRoomById = (id) => Room.findOne({ _id: id });
export const getRoomByRoomNumber = (num) => Room.findOne({ roomNumber: num });
export const getAllRooms = (block,whom)=> {
    if(whom!=="none") return Room.find({block: block, roomType: whom}).sort({roomNumber: 1});
    else return Room.find({block: block}).sort({roomNumber: 1});
}