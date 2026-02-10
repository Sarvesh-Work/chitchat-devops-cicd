import { Router } from "express";
import {
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
} from "../controllers/chat.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  attachmentMulter,
  singleAvatar,
} from "../middlewares/multer.middlewares.js";

const router = Router();

// Apply JWT verification middleware to all routes under "/verified"
router.use("/verified", verifyJwt);

// Group creation, member management, and avatar routes
router.post("/verified/newGroup", singleAvatar, newGroup);
router.put("/verified/addNewMembers", addMembers);
router.delete("/verified/removeMember", removeMember);
router.delete("/verified/leaveGroup/:id", leaveGroup);
router.put("/verified/:id/changeAvatar", singleAvatar, changeGroupAvatar);

// Chat and message routes
router.get("/verified/allGroups", getAllGroups);
router.get("/verified/allChats", allChats);
router.get("/verified/messages/:id", getMessages);
router.post("/verified/attachments", attachmentMulter, sendAttachment);

// Chat details, rename, and delete operations
router
  .route("/verified/:id")
  .get(getChatDetails)
  .put(renameGroup)
  .delete(deleteChat);

export default router;
