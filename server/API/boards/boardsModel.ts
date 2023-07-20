import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  permittedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  cards: [
    {
      title: { type: String, required: true },
      labels: [{ color: { type: String }, text: { type: String } }],
      tasks: [{ completed: { type: Boolean }, text: { type: String } }],
      desc: { type: String },
      date: { type: String },
    },
  ],
});

const BoardModel = mongoose.model("board", BoardSchema);
export default BoardModel;
