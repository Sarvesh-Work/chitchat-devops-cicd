import jwt from "jsonwebtoken";
import { appName } from "../constants/index.js";
import { User } from "../models/user.models.js";
import { ErrorHandler } from "../utils/feature.js";

const verifyJwt = (req, res, next) => {
  try {
    const token = req.cookies[appName];

    if (!token) {
      return next(
        new ErrorHandler("You are not logged in. Please log in.", 401)
      );
    }

    const verified = jwt.verify(token, process.env.JWT_KEY);

    req.user = verified._id;

    next();
  } catch (error) {
    next(error);
  }
};

const socketAuthentication = async (err, socket, next) => {
  if (err) return next(err);

  try {
    const token = socket.request.cookies[appName];

    if (!token) {
      return next(new ErrorHandler("Token expired, please login", 401));
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(verifiedUser._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error(error);
    next(new ErrorHandler("Authentication failed", 401));
  }
};

export { socketAuthentication, verifyJwt };
