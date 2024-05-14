import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true
  },
  block: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  slots: {
    type: Number,
    required: true
  },
  currentSize: {
    type: Number,
    default: 0
  },
  isFull:{
    type:Boolean,
    default:false
  },
  roomType: {
    type: String,
    enum: ["girls", "boys"]
  }
},{timestamps:false});

const Room = mongoose.model('room', RoomSchema);

export default Room;
