import bcrypt from "bcryptjs";
import {
  appName,
  cookieOptions,
  NEW_REQUEST,
  REFETCH_CHATS,
} from "../constants/index.js";
import { Request } from "../models/request.models.js";
import { User } from "../models/user.models.js";
import { emitEvent } from "../Socket/index.js";
import {
  ErrorHandler,
  saveToken,
  uploadFileToCloudinary,
} from "../utils/feature.js";
import { Chat } from "./../models/chat.models.js";

const signUp = async (req, res, next) => {
  try {
    const { name, username, email, password, bio } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const file = req.file;

    if (!file) {
      return next(new ErrorHandler("Avatar required upload the avatar", 400));
    }

    const result = await uploadFileToCloudinary([file]);

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const newUser = await User.create({
      name,
      bio,
      password,
      avatar: avatar,
      email,
      username,
    });

    saveToken(res, 201, "User created successfully", newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { UsernameOrEmail, password } = req.body;

  try {
    const query = UsernameOrEmail.includes("@")
      ? { email: UsernameOrEmail }
      : { username: UsernameOrEmail };

    const user = await User.findOne(query).select("+password").lean();

    if (!user) return next(new ErrorHandler("Invalid user", 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid password", 400));

    const { password: _, ...userProfile } = user;

    userProfile.avatar = { url: user.avatar.url };

    saveToken(
      res,
      201,
      `Welcome back ${user.username || user.email}`,
      userProfile
    );
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).lean();

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const userProfile = {
      ...user,
      avatar: {
        url: user.avatar.url,
      },
    };

    res.status(200).json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie(appName, "", { ...cookieOptions, maxAge: 0 })
      .json({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    next(error);
  }
};

const searchUserWhichIsNotFriend = async (req, res, next) => {
  try {
    const { name } = req.query;
    const userId = req.user;

    const notMyFriends = await User.find({
      _id: { $ne: userId },
      friends: { $nin: [userId] },
      name: { $regex: name, $options: "i" },
    }).select("_id name avatar");

    if (notMyFriends.length === 0) {
      return res.status(400).json({
        success: true,
        message: "Sorry, the user  is not found",
        users: [],
      });
    }

    const users = notMyFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

const sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(req.user)
      .select("friends")
      .populate("friends", "name avatar");

    const alreadyFriend = user.friends.some(
      (friend) => friend._id.toString() === userId
    );

    if (alreadyFriend) {
      return next(new ErrorHandler("Already friends", 400));
    }

    const existingRequest = await Request.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user },
      ],
    });

    if (existingRequest) {
      return next(new ErrorHandler("Request already sent", 400));
    }

    await Request.create({
      sender: req.user,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    res.status(200).json({
      success: true,
      message: "Request sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId, accept } = req.body;
    const { user: userId } = req;

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    await User.findById(userId)
      .select("friends")
      .populate("friends", "name avatar");

    if (!request) {
      return next(new ErrorHandler("Request not found", 400));
    }

    if (request.receiver._id.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler(
          "Sorry, you are not allowed to accept this request",
          400
        )
      );
    }

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend request rejected",
      });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
      User.findByIdAndUpdate(userId, {
        $addToSet: { friends: request.sender._id },
      }),
      User.findByIdAndUpdate(request.sender._id, {
        $addToSet: { friends: request.receiver._id },
      }),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
      senderId: request.sender._id,
    });
  } catch (error) {
    next(error);
  }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const response = await Request.find({ receiver: req.user }).populate(
      "sender",
      "name avatar"
    );

    if (!response.length) {
      return res.status(200).json({
        success: true,
        message: "There are no notifications for you",
      });
    }

    const notifications = response.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

const getMyFriends = async (req, res, next) => {
  try {
    const { user: userId } = req;
    const { chatId } = req.query;

    const user = await User.findById(userId)
      .select("friends")
      .populate("friends", "name avatar");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const transformedFriends = user.friends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    if (chatId) {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
      }

      const availableFriends = transformedFriends.filter(
        (friend) => !chat.members.includes(friend._id.toString())
      );

      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    }

    return res.status(200).json({
      success: true,
      friends: transformedFriends,
    });
  } catch (error) {
    next(error);
  }
};

const editUserProfile = async (req, res, next) => {
  try {
    const userId = req.user;
    const { name, bio, email } = req.body;
    const file = req.file;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (email) updateFields.email = email;

    if (file) {
      const result = await uploadFileToCloudinary([file]);

      const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
      };
      updateFields.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedUser) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};




export {
  acceptFriendRequest, editUserProfile, getAllNotifications,
  getMyFriends, getProfile, login, logOut,
  searchUserWhichIsNotFriend,
  sendFriendRequest, signUp
};

