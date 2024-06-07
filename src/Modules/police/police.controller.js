import { postModel } from "../../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const updateLocation = asyncHandler(async (req, res, next) => {
    const { postId  } = req.params;
  
    const post = await postModel.findById(postId).populate([{
      path:"imageId",
      select:"images.url"
    },
    {
      path:"createdBy",
      select:"name profileImage.url"
    }
]);
    if (!post) return next(new Error("Post Not Exist"));
  
    // Update address
    // post.address = req.user.name;
    post.address = req.body.darName;
    await post.save();
  
    // Populate image and user for the post
    // const image = await imageModel
    //   .findById(post.imageId)
    //   .select("images.url");
    // const user = await userModel
    //   .findById(post.createdBy)
    //   .select("name profileImage.url");
  
    // return res.json({ success: true, results: { ...post.toObject(), image, user } });
    return res.json({ success: true, results: post });
  });