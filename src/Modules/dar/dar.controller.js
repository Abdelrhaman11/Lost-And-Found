import { asyncHandler } from "../../utils/errorHandling.js";

import { postModel } from "../../../DB/models/post.model.js";
import { imageModel } from "../../../DB/models/image.mode.js";
import { userModel } from "../../../DB/models/user.model.js";

// update Location
export const updateLocation = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
  
    const post = await postModel.findById(postId);
    if (!post) return next(new Error("Post Not Exist"));
  
    // Update address
    post.address = req.user.name;
    await post.save();
  
    // Populate image and user for the post
    const image = await imageModel
      .findById(post.imageId)
      .select("images.url");
    const user = await userModel
      .findById(post.createdBy)
      .select("name profileImage.url");
  
    return res.json({ success: true, results: { ...post.toObject(), image, user } });
  });
  
// all post in dar
export const allPosrInDar = asyncHandler(async (req, res, next) => {
  const allPosts = await postModel.find({ address: req.user.name });
  const postsWithImages = await Promise.all(
    allPosts.map(async (post) => {
      const image = await imageModel
        .findById(post.imageId)
        .select("images.url");
      const user = await userModel
        .findById(post.createdBy)
        .select("name profileImage");
      return { ...post.toObject(), image, user };
    })
  );

  return res.json({ success: true, results: postsWithImages });
});
