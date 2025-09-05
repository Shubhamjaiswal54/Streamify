import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send(400).json({ message: "All fileds are required " });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "invalid email or password " });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 1000,
      htttpOnly: true,
      samesite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ sucess: true, message: "login Sucessful" });
  } catch (error) {
    console.log("error in login controller ", error);
    return res.status(400).json({ message: "internal server error" });
  }
}

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All Filds are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password length must be atleast 6 characters" });
    }

    const exUser = await User.findOne({ email });

    if (exUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const api = -`https://avatar.iran.liara.run/public/${idx}`;

    const randomUser = await User.create({
      email,
      fullName,
      password,
      profilePic: api,
    });

    try {
      await upsertStreamUser({
        id: randomUser._id.toString(),
        name: randomUser.fullName,
        image: randomUser.profilePic || "",
      });

      console.log(`user created with the id ${randomUser.fullName}`);
    } catch (error) {
      console.log("error creating the user", error);
    }

    const token = jwt.sign({ userId: randomUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 1000,
      htttpOnly: true,
      samesite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ sucess: true, User: randomUser });
  } catch (error) {
    console.log("error in singup controller ", error);
    return res.status(400).json({ message: "internal server error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ sucess: true, message: "logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, location, learningLanguage } = req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !location ||
      !learningLanguage
    ) {
      res.status(400).json({
        message: "all field are required",

        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ],
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ sucess: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "error on onboarding" });
  }
}
