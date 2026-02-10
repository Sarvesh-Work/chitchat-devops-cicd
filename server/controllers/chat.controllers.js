import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/index.js";
import { Chat } from "../models/chat.models.js";
import { Message } from "../models/message.models.js";
import { emitEvent } from "../Socket/index.js";
import {
  deleteFilesFromCloudinary,
  ErrorHandler,
  filterMembersForId,
  getOtherMembers,
  uploadFileToCloudinary,
} from "../utils/feature.js";
import { User } from "./../models/user.models.js";

const newGroup = async (req, res, next) => {
  try {
    const { name } = req.body;
    const members = JSON.parse(req.body.members);
    const file = req.file;

    if (!name || !members || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Group name and at least 3 members are required",
      });
    }

    if (!file) {
      return next(new ErrorHandler("Avatar required upload the avatar", 400));
    }

    const result = await uploadFileToCloudinary([file]);

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const allMembers = [...members, req.user];

    const newGroup = await Chat.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
      groupAvatar: avatar,
    });

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      success: true,
      message: "Group Created",
      group: newGroup,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getAllGroups = async (req, res, next) => {
  try {
    const groups = await Chat.find({
      members: req.user,
      creator: req.user,
      groupChat: true,
    });

    const transformedGroups = groups.map((group) => ({
      _id: group._id,
      name: group.name,
      avatar: group.groupAvatar.url,
      groupChat: group.groupChat,
    }));

    return res.status(200).json({
      success: true,
      groups: transformedGroups,
    });
  } catch (error) {
    next(error);
  }
};

const addMembers = async (req, res, next) => {
  try {
    const { chatId, members } = req.body;

    if (!members || members.length < 1) {
      return next(new ErrorHandler("Members are not found", 400));
    }

    const groupChat = await Chat.findById(chatId);

    if (!groupChat || !groupChat.groupChat) {
      return next(new ErrorHandler("Group not found", 401));
    }

    if (groupChat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("Sorry, you are not the creator of this group", 400)
      );
    }

    const currentMemberIds = new Set(
      groupChat.members.map((member) => member.toString())
    );

    const newMemberPromises = members.map(async (memberId) => {
      if (currentMemberIds.has(memberId)) {
        return null;
      }

      const member = await User.findById(memberId, "name");
      if (!member) {
        throw new ErrorHandler(`Member with ID ${memberId} not found`, 400);
      }
      return member;
    });

    const newMembers = await Promise.all(newMemberPromises);

    const validNewMembers = newMembers.filter((member) => member !== null);

    groupChat.members.push(...validNewMembers.map((member) => member._id));

    if (groupChat.members.length > 50) {
      return next(
        new ErrorHandler("You have reached the limit of group members", 400)
      );
    }

    await groupChat.save();

    const newMemberNames = validNewMembers
      .map((member) => member.name)
      .join(", ");

    emitEvent(req, REFETCH_CHATS, groupChat.members);

    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { userId, chatId } = req.body;

    const [chat, userToRemove] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);

    if (!chat || !chat.groupChat) {
      return next(new ErrorHandler("Group not found", 401));
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("Sorry, you are not the creator of this group", 400)
      );
    }

    if (chat.members.length <= 3) {
      return next(
        new ErrorHandler("Sorry a group should contain at list 3 members", 400)
      );
    }
    const allChatMembers = chat.members.map((i) => i.toString());

    chat.members = chat.members.filter(
      (member) => member._id.toString() !== userId.toString()
    );

    await chat.save();

    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const userId = req.user;
    const [chat, user] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);

    if (!chat || !chat.groupChat) {
      return next(new ErrorHandler("Group not found", 401));
    }

    const remainingMembers = chat.members.filter(
      (member) => member._id.toString() !== userId.toString()
    );

    if (remainingMembers.length < 3) {
      return next(
        new ErrorHandler(
          "Fail to leave, a group should contain at least 3 members",
          400
        )
      );
    }

    if (chat.creator.toString() === userId.toString()) {
      const randomIndex = Math.floor(Math.random() * remainingMembers.length);
      chat.creator = remainingMembers[randomIndex];
    }

    chat.members = remainingMembers;
    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Left the group",
    });
  } catch (error) {
    next(error);
  }
};

const sendAttachment = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const [chat, user] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.user, "name"), // Ensure req.user is the correct user object
    ]);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 401));
    }

    const files = req.files || [];
    if (files.length === 0) {
      return next(
        new ErrorHandler(
          "Attachment not provided, please provide an attachment",
          400
        )
      );
    }

    const attachments = await uploadFileToCloudinary(files);

    const messageForDb = {
      content: "",
      attachments,
      sender: { _id: user._id.toString() },
      chat: chatId,
    };

    const messageForRealTime = {
      ...messageForDb,
      sender: {
        _id: user._id.toString(),
        name: user.name,
      },
    };

    const message = await Message.create(messageForDb);

    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
      chatId,
    });

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getChatDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id)
      .populate("members", "name avatar bio createdAt email")
      .lean();

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    chat.members = chat.members.map(
      ({ _id, name, avatar, bio, createdAt, email }) => ({
        _id,
        name,
        avatar: avatar?.url || null,
        bio,
        createdAt,
        email,
      })
    );

    chat.groupAvatar = chat.groupAvatar ? chat.groupAvatar.url : null;

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const { name } = req.body;

    console.log(chatId);

    if (!name) {
      return next(new ErrorHandler("Invalid group name", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.groupChat) {
      return next(new ErrorHandler("Chat not found", 401));
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("Sorry, you are not the creator of this group", 403)
      );
    }

    if (chat.name === name) {
      return res.status(200).json({
        success: true,
        message: "Group name is already the same",
      });
    }

    chat.name = name;
    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Name changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new ErrorHandler("Chat not found", 401));
    }

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler(
          "You're not allowed to delete this group because you are not the creator",
          403
        )
      );
    }

    if (!chat.groupChat) {
      const userPromises = chat.members.map(async (memberId) => {
        const user = await User.findById(memberId);
        if (user) {
          chat.members.forEach(async (otherMemberId) => {
            if (otherMemberId.toString() !== memberId.toString()) {
              user.friends = user.friends.filter(
                (friendId) => friendId.toString() !== otherMemberId.toString()
              );
              await user.save();

              const otherUser = await User.findById(otherMemberId);
              if (otherUser) {
                otherUser.friends = otherUser.friends.filter(
                  (friendId) => friendId.toString() !== memberId.toString()
                );
                await otherUser.save();
              }
            }
          });
        }
      });

      await Promise.all(userPromises);
    }

    const messageWithAttachment = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    messageWithAttachment.forEach(({ attachments }) =>
      attachments.forEach((public_id) => public_ids.push(public_id))
    );

    await Promise.all([
      deleteFilesFromCloudinary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chat: chatId }),
    ]);

    const message = chat.groupChat
      ? "Group deleted successfully"
      : "Chat deleted successfully";

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const { page = 1 } = req.query;

    const resultPerPage = Number(process.env.LIMIT_PER_PAGE) || 10; // Default value if environment variable is not set
    const skip = (page - 1) * resultPerPage;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.members.includes(req.user.toString())) {
      return next(new ErrorHandler("Your not member of this group", 400));
    }

    const [messages, totalMessageCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessageCount / resultPerPage);

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const allChats = async (req, res, next) => {
  const { user } = req;

  try {
    const allChats = await Chat.find({ members: user }).populate(
      "members",
      "name avatar"
    );

    const transformedChats = await Promise.all(
      allChats.map(async (chat) => {
        const { name, members, _id, groupChat, groupAvatar } = chat;
        const otherMembers = getOtherMembers(members, user);

        const lastMessage = await Message.findOne({ chat: _id })
          .sort({ createdAt: -1 })
          .select("content createdAt")
          .exec();

        return {
          _id,
          groupChat,
          avatar: groupChat ? groupAvatar.url : otherMembers.avatar.url,
          name: groupChat ? name : otherMembers.name,
          members: filterMembersForId(members, req.user),
          lastMessage: lastMessage || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      Chats: transformedChats,
    });
  } catch (error) {
    next(error);
  }
};

const changeGroupAvatar = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const file = req.file;

    if (!chatId) {
      return next(new ErrorHandler("Chat ID is required", 400));
    }

    if (!file) {
      return next(new ErrorHandler("Avatar file is required", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.groupChat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (chat?.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not authorized to change the avatar", 403)
      );
    }

    const result = await uploadFileToCloudinary([file]);

    const groupAvatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    chat.groupAvatar = groupAvatar;
    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Profile image changed successfully",
      groupAvatar,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addMembers,
  allChats,
  changeGroupAvatar,
  deleteChat,
  getAllGroups,
  getChatDetails,
  getMessages,
  leaveGroup,
  newGroup,
  removeMember,
  renameGroup,
  sendAttachment,
};
