import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  anlat: {
    type: String,
    required: false,
  },
  dinle: {
    type: String,
    required: false,
  }
});

const Room = mongoose.model("room", roomSchema);

export default Room;
