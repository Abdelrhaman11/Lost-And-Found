import { imageModel } from "../../../DB/models/image.mode.js";
import { postModel } from "../../../DB/models/post.model.js";
import { compare_faces } from "../../utils/cosine_similarity.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const matchImage = asyncHandler(async (req, res, next) => {


    const lastPost = await postModel.find({ createdBy: req.user._id });
    if (lastPost.length === 0) {
        return res.status(404).json({ message: "No images found for the user" });
    }

    const last1 = lastPost.length - 1;
    const latestPostDoc = lastPost[last1];
    // console.log(latestPostDoc);
    
    const typePost=latestPostDoc.type === "Lost" ? "Found" : "Lost";
    console.log(typePost);

    const lastImages = await imageModel.find({ createdBy: req.user._id });

    if (lastImages.length === 0) {
        return res.status(404).json({ message: "No images found for the user" });
    }

    const last = lastImages.length - 1;
    const latestImageDoc = lastImages[last];

    if (!latestImageDoc || !latestImageDoc.images || latestImageDoc.images.length === 0) {
        return res.status(404).json({ message: "No images found in the last entry" });
    }

    const latestImage = latestImageDoc.images[0].url; // Assuming only one image to compare


    const postss = await postModel.find({ type: typePost });

    const postIds = postss.map(post => post._id);

    const allImages = await imageModel.find({ postId: { $in: postIds } });
    console.log(allImages.length);

    // for (let imageDoc of allImages) {

    for (let i=0 ; i<allImages.length ; i++) {
        if (!allImages[i].images || allImages[i].images.length === 0) continue;

        for (let img of allImages[i].images) {
            const resultMatch = await compare_faces(latestImage, img.url);

            // Log the result to understand its format
            console.log("Result Match:", resultMatch);

            // Check if resultMatch is an object and extract the message if necessary
            const matchMessage =
                typeof resultMatch === "object" ? resultMatch.result : resultMatch;

            if (
                typeof matchMessage === "string" &&
                matchMessage.includes("Same person")
            ) {
                // Fetch the posts related to the matching images and populate images
                const post1 = await postModel.findOne({ _id: latestImageDoc.postId }).populate('imageId');
                const post2 = await postModel.findOne({ _id: allImages[i].postId }).populate('imageId');

                return res.json({
                    message: "match",
                    posts: [post1, post2]
                });
            }
        }
    }

    return res.json({ message: "Not-Match" });
});
