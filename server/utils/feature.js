import jwt from "jsonwebtoken";
import { appName, cookieOptions } from "../constants/index.js";
import { userSocketId } from "../app.js";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

const saveToken = (res, code, message, userProfile) => {
  const userId = userProfile?._id;
  if (!userId) {
    throw new Error("User ID is required to generate a token");
  }

  const secretKey = process.env.JWT_KEY || "default_secret_key";
  const token = jwt.sign({ _id: userId }, secretKey);

  return res.status(code).cookie(appName, token, cookieOptions).json({
    success: true,
    userProfile,
    message,
  });
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getOtherMembers = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

const filterMembersForId = (members, userId) =>
  members
    .filter((member) => member._id.toString() !== userId.toString())
    .map((member) => member._id);

const deleteFilesFromCloudinary = (public_ids) => {};

const getSocketIds = (users = []) =>
  users.map((user) => userSocketId.get(user.toString()));

const uploadFileToCloudinary = async (files = []) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const result = await cloudinary.uploader.upload(getBase64(file), {
        resource_type: "auto",
        public_id: uuid(),
      });
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.log(error, "cloud");
    throw new ErrorHandler("Error in uploading files to Cloudinary", error);
  }
};

export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export {
  saveToken,
  ErrorHandler,
  getOtherMembers,
  filterMembersForId,
  deleteFilesFromCloudinary,
  getSocketIds,
  uploadFileToCloudinary,
};
