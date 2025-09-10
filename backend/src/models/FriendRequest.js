import moongose from "mongoose";

const friendRequestSchema = new moongose.Schema(
  {
    sender: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = moongose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;