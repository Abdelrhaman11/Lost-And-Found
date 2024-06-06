import { userModel } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../../utils/cloud.js";
import { reportModel } from "../../../DB/models/report.model.js";
import { postModel } from "../../../DB/models/post.model.js";
import { imageModel } from "../../../DB/models/image.mode.js";

// Update Profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.name,
      nId: req.body.nId,
      email: req.body.email,
      Location: req.body.Location,
      gender: req.body.gender,
      phone: req.body.phone,
      userName: req.body.userName,
    },
    { new: true }
  );
  if (!user) return next(new Error("user not found !"));

  return res.json({ success: true, result: user });
});

// update profile image
export const updateProfileImage = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) return next(new Error("user not found !"));

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: user.profileImage.id,
      }
    );

    user.profileImage.url = secure_url;
    user.profileImage.id = public_id;
  }

  await user.save();
  return res.json({ success: true });
});

// update cover image
export const updateCoverProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) return next(new Error("user not found !"));

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: user.coverImage.id,
      }
    );

    user.coverImage.url = secure_url;
    user.coverImage.id = public_id;
  }

  await user.save();
  return res.json({ success: true });
});

// Change Password
export const changePassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) return next(new Error("user not found !"));

  const match = bcryptjs.compareSync(req.body.oldPassword, user.password);

  if (!match) return res.json({ message: "oldPassword is worng" });
  const hashPassword = bcryptjs.hashSync(
    req.body.newPassword,
    Number(process.env.SALT_ROUND)
  );

  user.password = hashPassword;
  await user.save();

  return res.json({ success: true, result: user });
});

// View profile
export const viewProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  return res.json({ success: true, user });
});

// view posts for each user
export const viewposts = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) return next(new Error("User not found!"));

  const posts = await postModel.find({ createdBy: user._id });
  if (!posts) return next(new Error("Posts not found!"));

  // Populate images and user for each post
  const populatedPosts = await Promise.all(
    posts.map(async (post) => {
      const populatedPost = { ...post.toObject() };

      // Populate images for the post
      if (populatedPost.imageId) {
        const image = await imageModel
          .findById(populatedPost.imageId)
          .select("images.url");
        populatedPost.image = image;
      }
      // Populate user for the post
      const user = await userModel
        .findById(populatedPost.createdBy)
        .select("name profileImage.url status");
      populatedPost.user = user;

      return populatedPost;
    })
  );
  return res.json({ success: true, posts: populatedPosts });
});

// View others Profile
export const ViewOthersProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  // Find user by ID
  const userProfile = await userModel
    .findById(userId)
    .select(
      "-password -role -isConfirmed -activationCode -profileImage.id -coverImage.id"
    );
  if (!userProfile) {
    return next(new Error("User not found"));
  }

  return res.json({ success: true, userProfile });
});

// View others posts
export const ViewOthersPosts = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  // Find user by ID
  const userProfile = await userModel.findById(userId);
  if (!userProfile) {
    return next(new Error("User not found"));
  }
  const userPosts = await postModel
    .find({ createdBy: userId })
    .populate(
      "createdBy",
      "-cloudFolder -password -isConfirmed -gender -nId -email -role -activationCode -Location -phone -profileImage.id -profileImage.featureVector -coverImage"
    ); 

  const postsWithImages = await Promise.all(
    userPosts.map(async (post) => {
      const image = await imageModel
        .findById(post.imageId)
        .select("images.url");
      return { ...post.toObject(), image }; 
    })
  );

  return res.json({ success: true, postsWithImages });
});

export const options = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.user._id)
    .select("name userName profileImage coverImage status -_id");
  return res.json({ success: true, user });
});
