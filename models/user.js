import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
