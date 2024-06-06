import { Router } from "express";
import * as profileController from "./userprofile.controller.js";
import * as validator from "./userprofile.validation.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router();

// Update Profile
router.put(
  "/update",
  isAuthenticated,
  isAuthorized("user"),
  isValid(validator.updateSchema),
  profileController.updateProfile
);

// update Profile Image
router.put(
  "/updateProfileImage",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).single("imageProfile"),
  profileController.updateProfileImage
);

// update Cover Profile
router.put(
  "/updateCoverProfile",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).single("coverProfile"),
  profileController.updateCoverProfile
);

// change Password
router.put(
  "/changePassword",
  isAuthenticated,
  isAuthorized("user"),
  isValid(validator.changePasswordSchema),
  profileController.changePassword
);

// View posts
router.get(
  "/posts",
  isAuthenticated,
  isAuthorized("user"),
  profileController.viewposts
);

// View Profile
router.get(
  "/profile",
  isAuthenticated,
  isAuthorized("user"),
  profileController.viewProfile
);

// View others profile
router.get(
  "/viewothersprofile/:userId",
  isAuthenticated,
  isAuthorized("user"),
  profileController.ViewOthersProfile
);

// View others Posts
router.get(
  "/viewothersposts/:userId",
  isAuthenticated,
  isAuthorized("user"),
  profileController.ViewOthersPosts
);


// options
//
router.get(
  "/options",
  isAuthenticated,
  isAuthorized("user"),
  profileController.options
);
export default router;
