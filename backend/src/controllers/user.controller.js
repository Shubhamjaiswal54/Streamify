import FriendRequest from "../lib/FriendRequest";
import User from "../models/User";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("error getting recommendations");
    res.status(500).json("iternal servaer errors");
  }
}

export async function getMyFriends(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const user = await User.findById(currentUserId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user);
  } catch (error) {}
}

export async function sendFriendRequest(req, res) {
  try {
    const myid = req.user.id;
    const { id: recipientid } = req.params;

    if (myid === recipientid) {
      return res
        .status(400)
        .json({ message: "you cannot send friend request to yourself" });
    }

    const recipient = await User.findById(recipientid);

    if (!recipient) {
      return res.status(400).json({ message: "recipient id is required" });
    }
    if (recipientid.includes(myid)) {
      return res.status(400).json({ message: "friend request already sent" });
    }

    //check is user already is friends
    const alreadyFriends = await FriendRequest.findOne({
      $or: [
        { requester: myid, recipient: recipientid },
        { requester: recipientid, recipient: myid },
      ],
    });

    if (alreadyFriends) {
      return res
        .status(400)
        .json({ message: " already friends between you and the user" });
    }

    //create the friend request
    const friendRequest = new FriendRequest.create({
      sender: myid,
      recipient: recipientid,
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    console.log("error sending friend request", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestedId } = req.params;
    const friendRequest = await FriendRequest.findById(requestedId);
    if (!friendRequest) {
      return res.status(404).json({ message: "friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "you are not authorized to accept this friend request",
      });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each one of them to each other's friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $push: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $push: { friends: friendRequest.sender },
    });
    return res
      .status(200)
      .json({ sucess: true, message: "friend request accepted" });
  } catch (error) {
    console.log("error accepting friend request", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(incomingRequests);

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate(
      "recipient",
      "fullName profilePic"
    );
    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.log("error getting friend requests", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getOutgoingFriendReqs(req , res) {
  
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",  
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(outgoingRequests);   
  } catch (error) {
    console.log("error getting outgoing friend requests", error);
    res.status(500).json({ message: "internal server error" });
  }

}