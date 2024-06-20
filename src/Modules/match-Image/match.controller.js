import { imageModel } from "../../../DB/models/image.mode.js";
import { postModel } from "../../../DB/models/post.model.js";
import { compare_faces } from "../../utils/cosine_similarity.js";
import { asyncHandler } from "../../utils/errorHandling.js";

<<<<<<< HEAD
=======
<<<<<<< HEAD
export const matchImage=asyncHandler(async(req,res,next)=>{


    const lastImages= await imageModel.find({createdBy:req.user._id})

    const last=lastImages.length-1;    
    const result = lastImages[last].images.map((image)=>{
        return {url:image.url}
    })
        // console.log(...result);
        // const jsonString1 = JSON.stringify(result);
        // const binaryData1 = Buffer.from(jsonString1);


    const images= await imageModel.find();

   let urls =images.map((image) => {
         return(image.images.map((img) => {
            return({url: img.url});
        }))
    });





   for(let i=0 ; i<=urls.length ; i++)
    {
// const jsonString = JSON.stringify(urls[0]);
// const binaryData = Buffer.from(jsonString);
        // const resultMatch=compare_faces(binaryData , binaryData1)
        const resultMatch=compare_faces(urls[i] , result)
        console.log(resultMatch);
        if(resultMatch.includes("same"))
            {

                return res.json({message:"match"})

            }
        

    }

// let x;
// const imageUrl1='https://res.cloudinary.com/dtykqby6b/image/upload/v1718117907/LostAndFound/posts/IoMaFW7Lr38Xo0o8gmQL1/e0qf1wrpg0ffm2p3w1zb.jpg'
// const imageUrl2='https://res.cloudinary.com/dtykqby6b/image/upload/v1718117910/LostAndFound/posts/IoMaFW7Lr38Xo0o8gmQL1/s488zltnz38xjbcjwkki.jpg'
// compare_faces(imageUrl1, imageUrl2).then(result => {
//     console.log(result);
//     x=result
// });

    return res.json({message:"Not-Match" , x  })


})
=======
>>>>>>> 7ead1c4808c3e6caed363896f4a24c7cc119e316
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
<<<<<<< HEAD
    // const allImages = await imageModel.find();

    // for (let imageDoc of allImages) {
=======

    // for (let imageDoc of allImages) {

>>>>>>> 7ead1c4808c3e6caed363896f4a24c7cc119e316
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
<<<<<<< HEAD
=======
>>>>>>> b98f4b0be9dd7d98e5adb821b0a07b2ac7e4e7ab
>>>>>>> 7ead1c4808c3e6caed363896f4a24c7cc119e316
