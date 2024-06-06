import { asyncHandler } from "./../utils/errorHandling.js";
import jwt from "jsonwebtoken";
import { tokenModel } from "../../DB/models/token.model.js";
import { userModel } from "../../DB/models/user.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // Check token existence and type
  /* if (!req.cookies) {
    return next({ status: 400, message: "Valid token is required" });
  }
  let token = req.cookies.accesstoken.split(" ")[1];

  console.log(token);
*/
  let token = req.headers["token"];
  if (!token || !token.startsWith(process.env.BEARER_KEY)) {
    return next({ status: 400, message: "Valid token is required" });
  }
  // Extract token
  token = token.split(process.env.BEARER_KEY)[1];
  // Verify token
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) {
    return next({ status: 401, message: "Invalid token" });
  }

  // Check token in DB
  const tokenDB = await tokenModel.findOne({ token, isValid: true });
  if (!tokenDB) {
    return next({ status: 401, message: "Token expired" });
  }

  // Check user existence
  const user = await userModel.findOne({ email: decoded.email });
  if (!user) {
    return next({ status: 404, message: "User not found" });
  }

  // Attach user to request object
  req.user = user;

  // Proceed to the next middleware
  return next();
});
