import { Router } from "express";
import {
  acceptFriendRequest,
  editUserProfile,
  getAllNotifications,
  getMyFriends,
  getProfile,
  login,
  logOut,
  searchUserWhichIsNotFriend,
  sendFriendRequest,
  signUp,
} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { singleAvatar } from "../middlewares/multer.middlewares.js";

const router = Router();

// auth routes
router.route("/signUp").post(singleAvatar, signUp);
router.route("/login").post(login);
// auth routes

router.use("/verified", verifyJwt);
router.route("/verified/profile").get(getProfile);
router.route("/verified/logOut").post(logOut);
router.route("/verified/notFriendSearch").get(searchUserWhichIsNotFriend);
router.route("/verified/sendFriendRequest").put(sendFriendRequest);
router.route("/verified/acceptFriendRequest").put(acceptFriendRequest);
router.route("/verified/notifications").get(getAllNotifications);
router.route("/verified/friends").get(getMyFriends);
router.route("/verified/editProfile").put(singleAvatar, editUserProfile);

export default router;
